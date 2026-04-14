'use client'

import { useCallback, useState, useEffect } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import CanvasNodeCard, { type CanvasNodeCardData } from './CanvasNodeCard'
import CanvasEdgeLabel from './CanvasEdgeLabel'
import NodeEditPanel from './NodeEditPanel'
import CanvasToolbar from './CanvasToolbar'
import CanvasPreviewModal from './CanvasPreviewModal'
import type { CanvasNodeData, CanvasEdgeData, RFNodeData } from '@/lib/canvas-types'
import { IoCloseOutline } from 'react-icons/io5'

// Define node/edge types outside component for stable reference
const nodeTypes: NodeTypes = { journeyNode: CanvasNodeCard }
const edgeTypes: EdgeTypes = { journeyEdge: CanvasEdgeLabel }

export type RFNode = Node<CanvasNodeCardData>
export type RFEdge = Edge<{ label?: string | null; labelType?: 'time' | 'action'; compactMode?: boolean }>

interface ProjectCanvasProps {
  initialNodes: RFNode[]
  initialEdges: RFEdge[]
}

function CanvasInner({ initialNodes, initialEdges }: ProjectCanvasProps) {
  const { screenToFlowPosition } = useReactFlow()

  const [nodes, setNodes] = useState<RFNode[]>(initialNodes)
  const [edges, setEdges] = useState<RFEdge[]>(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Edge label edit state
  const [edgeLabelDraft, setEdgeLabelDraft] = useState<{ label: string; labelType: 'time' | 'action' }>({ label: '', labelType: 'action' })

  // Sync edge edit form when selected edge changes
  useEffect(() => {
    if (!selectedEdgeId) return
    const edge = edges.find((e) => e.id === selectedEdgeId)
    if (edge) {
      setEdgeLabelDraft({
        label: edge.data?.label ?? '',
        labelType: edge.data?.labelType ?? 'action',
      })
    }
  }, [selectedEdgeId, edges])

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds) as RFNode[])
  }, [])

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds) as RFEdge[])
  }, [])

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          id: crypto.randomUUID(),
          type: 'journeyEdge',
          data: { label: '', labelType: 'action' as const },
        },
        eds
      ) as RFEdge[]
    )
  }, [])

  function handleNodeClick(_event: React.MouseEvent, node: Node) {
    setSelectedNodeId(node.id)
    setSelectedEdgeId(null)
  }

  function handleEdgeClick(_event: React.MouseEvent, edge: Edge) {
    setSelectedEdgeId(edge.id)
    setSelectedNodeId(null)
  }

  function handlePaneClick() {
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
  }

  function handleNodeUpdate(updated: RFNodeData) {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNodeId
          ? { ...n, data: { ...n.data, ...updated, editorMode: true } }
          : n
      )
    )
  }

  function handleNodeDelete() {
    if (!selectedNodeId) return
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId))
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId)
    )
    setSelectedNodeId(null)
  }

  function handleAddNode() {
    const rect = document.querySelector('.react-flow')?.getBoundingClientRect()
    const position = rect
      ? screenToFlowPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
      : { x: 200, y: 200 }

    const newId = crypto.randomUUID()
    const newNode: RFNode = {
      id: newId,
      type: 'journeyNode',
      position,
      data: {
        id: newId,
        nodeType: 'project',
        iconName: 'code',
        iconColor: '#ffffff',
        iconBgColor: '#3b82f6',
        category: 'PROJECT',
        title: 'New Node',
        description: '',
        techStack: [],
        githubUrl: null,
        liveUrl: null,
        date: null,
        editorMode: true,
      },
    }
    setNodes((nds) => [...nds, newNode])
    setSelectedNodeId(newId)
    setSelectedEdgeId(null)
  }

  function applyEdgeLabel() {
    if (!selectedEdgeId) return
    setEdges((eds) =>
      eds.map((e) =>
        e.id === selectedEdgeId
          ? { ...e, data: { ...e.data, label: edgeLabelDraft.label, labelType: edgeLabelDraft.labelType } }
          : e
      )
    )
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setSaveError(null)

    const canvasNodes: CanvasNodeData[] = nodes.map((n) => ({
      id: n.id,
      nodeType: n.data.nodeType,
      iconName: n.data.iconName,
      iconColor: n.data.iconColor,
      iconBgColor: n.data.iconBgColor,
      category: n.data.category,
      title: n.data.title,
      description: n.data.description,
      techStack: n.data.techStack,
      githubUrl: n.data.githubUrl ?? null,
      liveUrl: n.data.liveUrl ?? null,
      date: n.data.date ?? null,
      positionX: n.position.x,
      positionY: n.position.y,
    }))

    const canvasEdges: CanvasEdgeData[] = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.data?.label ?? null,
      labelType: e.data?.labelType ?? 'action',
    }))

    try {
      const res = await fetch('/api/canvas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes: canvasNodes, edges: canvasEdges }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Save failed' }))
        setSaveError(err.error ?? 'Save failed')
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } catch {
      setSaveError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const selectedNode = selectedNodeId
    ? (nodes.find((n) => n.id === selectedNodeId)?.data as RFNodeData | undefined) ?? null
    : null

  // Ensure all nodes have editorMode = true
  const editorNodes = nodes.map((n) => ({
    ...n,
    data: { ...n.data, editorMode: true },
  }))

  return (
    <div className="relative w-full h-full">
      <CanvasToolbar
        onAddNode={handleAddNode}
        onSave={handleSave}
        onPreview={() => setPreviewOpen(true)}
        saving={saving}
        saved={saved}
        saveError={saveError}
      />

      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={editorNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        deleteKeyCode="Delete"
        defaultEdgeOptions={{ type: 'journeyEdge', data: { label: '', labelType: 'action' } }}
        className="bg-gray-50 dark:bg-neutral-950"
      >
        <Background color="#d1d5db" gap={20} size={1} />
        <Controls className="!bottom-4 !left-4" />
        <MiniMap
          className="!bottom-4 !right-4"
          nodeColor={(node) => {
            const d = node.data as CanvasNodeCardData
            return d?.iconBgColor ?? '#888'
          }}
        />
      </ReactFlow>

      {/* Edge label editor — shown when an edge is selected */}
      {selectedEdgeId && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500 dark:text-neutral-400">Edge label</span>
          <input
            type="text"
            value={edgeLabelDraft.label}
            onChange={(e) => setEdgeLabelDraft((d) => ({ ...d, label: e.target.value }))}
            onBlur={applyEdgeLabel}
            onKeyDown={(e) => { if (e.key === 'Enter') applyEdgeLabel() }}
            className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-36"
            placeholder="e.g. 6 months later"
            autoFocus
          />
          <div className="flex gap-1">
            {(['time', 'action'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setEdgeLabelDraft((d) => ({ ...d, labelType: t }))
                  setEdges((eds) =>
                    eds.map((e) =>
                      e.id === selectedEdgeId ? { ...e, data: { ...e.data, labelType: t } } : e
                    )
                  )
                }}
                className={[
                  'px-2 py-1 rounded text-[10px] font-semibold capitalize transition-colors',
                  edgeLabelDraft.labelType === t
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400',
                ].join(' ')}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedEdgeId(null)}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <IoCloseOutline size={16} />
          </button>
        </div>
      )}

      {/* Node edit panel */}
      <NodeEditPanel
        node={selectedNode}
        onUpdate={handleNodeUpdate}
        onDelete={handleNodeDelete}
        onClose={() => setSelectedNodeId(null)}
      />

      {/* Preview modal */}
      {previewOpen && (
        <CanvasPreviewModal
          nodes={nodes}
          edges={edges}
          onNodesChange={(updated) => setNodes(updated)}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  )
}

export default function ProjectCanvas(props: ProjectCanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  )
}
