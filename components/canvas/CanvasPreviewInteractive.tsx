'use client'

import { useCallback, useState, useEffect } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  MarkerType,
  type NodeTypes,
  type EdgeTypes,
  type NodeChange,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { IoCloseOutline, IoTrashOutline } from 'react-icons/io5'

import CanvasNodeCard from './CanvasNodeCard'
import CanvasEdgeLabel from './CanvasEdgeLabel'
import type { RFNode, RFEdge } from './ProjectCanvas'

const nodeTypes: NodeTypes = { journeyNode: CanvasNodeCard }
const edgeTypes: EdgeTypes = { journeyEdge: CanvasEdgeLabel }

interface CanvasPreviewInteractiveProps {
  nodes: RFNode[]
  edges: RFEdge[]
  scale?: number
  draggable?: boolean
  onNodesChange: (changes: NodeChange[]) => void
  onEdgeUpdate: (edgeId: string, label: string, labelType: 'time' | 'action') => void
  onEdgeDelete: (edgeId: string) => void
  onNodeClick: (nodeId: string) => void
}

interface EdgeDraft {
  id: string
  label: string
  labelType: 'time' | 'action'
}

function PreviewCanvasInner({
  nodes,
  edges,
  scale,
  draggable,
  onNodesChange,
  onEdgeUpdate,
  onEdgeDelete,
  onNodeClick,
}: CanvasPreviewInteractiveProps) {
  const zoom = scale ?? 1
  const isFixedZoom = scale != null

  const [edgeDraft, setEdgeDraft] = useState<EdgeDraft | null>(null)

  // Sync edge draft when selected edge changes externally
  useEffect(() => {
    if (!edgeDraft) return
    const edge = edges.find((e) => e.id === edgeDraft.id)
    if (edge) {
      setEdgeDraft({
        id: edgeDraft.id,
        label: edge.data?.label ?? '',
        labelType: edge.data?.labelType ?? 'action',
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edgeDraft?.id])

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes)
    },
    [onNodesChange]
  )

  function handleNodeClick(_: React.MouseEvent, node: Node) {
    onNodeClick(node.id)
  }

  function handleEdgeClick(_: React.MouseEvent, edge: Edge) {
    if (!draggable) return
    const rfEdge = edge as RFEdge
    setEdgeDraft({
      id: edge.id,
      label: rfEdge.data?.label ?? '',
      labelType: rfEdge.data?.labelType ?? 'action',
    })
  }

  function applyEdgeLabel() {
    if (!edgeDraft) return
    onEdgeUpdate(edgeDraft.id, edgeDraft.label, edgeDraft.labelType)
  }

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.12, minZoom: 0.35, maxZoom: isFixedZoom ? zoom : 1 }}
        defaultEdgeOptions={{
          type: 'journeyEdge',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
        }}
        onNodesChange={handleNodesChange}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        nodesDraggable={!!draggable}
        nodesConnectable={false}
        nodesFocusable={!!draggable}
        edgesFocusable={!!draggable}
        elementsSelectable={!!draggable}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        minZoom={isFixedZoom ? zoom : 0.35}
        maxZoom={isFixedZoom ? zoom : 1}
        proOptions={{ hideAttribution: true }}
        className="rounded-2xl"
      />

      {/* Edge label editor */}
      {edgeDraft && draggable && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500 dark:text-neutral-400">Edge label</span>
          <input
            type="text"
            value={edgeDraft.label}
            onChange={(e) => setEdgeDraft((d) => d ? { ...d, label: e.target.value } : d)}
            onBlur={applyEdgeLabel}
            onKeyDown={(e) => { if (e.key === 'Enter') applyEdgeLabel() }}
            className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-32"
            placeholder="e.g. 6 months later"
            autoFocus
          />
          <div className="flex gap-1">
            {(['time', 'action'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  const updated = { ...edgeDraft, labelType: t }
                  setEdgeDraft(updated)
                  onEdgeUpdate(updated.id, updated.label, t)
                }}
                className={[
                  'px-2 py-1 rounded text-[10px] font-semibold capitalize transition-colors',
                  edgeDraft.labelType === t
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400',
                ].join(' ')}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              onEdgeDelete(edgeDraft.id)
              setEdgeDraft(null)
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-red-500 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <IoTrashOutline size={12} />
            Remove Arrow
          </button>
          <button
            type="button"
            onClick={() => setEdgeDraft(null)}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <IoCloseOutline size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default function CanvasPreviewInteractive(props: CanvasPreviewInteractiveProps) {
  return (
    <ReactFlowProvider>
      <PreviewCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
