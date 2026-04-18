'use client'

import { useState } from 'react'
import {
  applyNodeChanges,
  type NodeChange,
} from '@xyflow/react'
import {
  IoCloseOutline,
  IoPhonePortraitOutline,
  IoTabletPortraitOutline,
  IoDesktopOutline,
  IoPencilOutline,
  IoSaveOutline,
  IoCheckmarkOutline,
  IoAlertCircleOutline,
} from 'react-icons/io5'
import type { RFNode, RFEdge } from './ProjectCanvas'
import type { RFNodeData, CanvasNodeData, CanvasEdgeData } from '@/lib/canvas-types'
import NodeEditPanel from './NodeEditPanel'
import CanvasPreviewInteractive from './CanvasPreviewInteractive'

// ─── Constants (mirror app/projects/page.tsx) ────────────────────────────────
const NODE_WIDTH = 260
const NODE_HEIGHT = 190
const CANVAS_PADDING = 80
const MOBILE_CANVAS_WIDTH = 360
const MOBILE_NODE_WIDTH = 184
const MOBILE_NODE_HEIGHT = 176
const MOBILE_CANVAS_PADDING = 14
const MOBILE_LABEL_BUFFER = 64

// ─── Types ────────────────────────────────────────────────────────────────────
type Device = 'mobile' | 'tablet' | 'desktop'

const DEVICES: { id: Device; label: string; icon: React.ReactNode; width: number }[] = [
  { id: 'mobile', label: 'Mobile', icon: <IoPhonePortraitOutline size={14} />, width: 390 },
  { id: 'tablet', label: 'Tablet', icon: <IoTabletPortraitOutline size={14} />, width: 768 },
  { id: 'desktop', label: 'Desktop', icon: <IoDesktopOutline size={14} />, width: 1280 },
]

// ─── Layout computation (pure function) ──────────────────────────────────────
interface Layouts {
  rfNodes: RFNode[]
  rfEdges: RFEdge[]
  canvasWidth: number
  canvasHeight: number
  mobileNodes: RFNode[]
  mobileEdges: RFEdge[]
  mobileCanvasWidth: number
  mobileCanvasHeight: number
  mobileXScale: number
  mobileYScale: number
}

function computeLayouts(nodes: RFNode[], edges: RFEdge[]): Layouts {
  if (nodes.length === 0) {
    return {
      rfNodes: [],
      rfEdges: edges,
      canvasWidth: 760,
      canvasHeight: 560,
      mobileNodes: [],
      mobileEdges: edges.map((e) => ({ ...e, data: { ...e.data, compactMode: true } })),
      mobileCanvasWidth: MOBILE_CANVAS_WIDTH,
      mobileCanvasHeight: 520,
      mobileXScale: 1,
      mobileYScale: 1,
    }
  }

  // Step 1: normalize to public-page coordinates
  const minX = Math.min(...nodes.map((n) => n.position.x))
  const minY = Math.min(...nodes.map((n) => n.position.y))

  const rfNodes: RFNode[] = nodes.map((n) => ({
    ...n,
    position: {
      x: n.position.x - minX + CANVAS_PADDING,
      y: n.position.y - minY + CANVAS_PADDING,
    },
    data: { ...n.data, editorMode: false },
  }))

  // Step 2: desktop canvas dimensions
  const maxX = Math.max(...rfNodes.map((n) => n.position.x + NODE_WIDTH))
  const maxY = Math.max(...rfNodes.map((n) => n.position.y + NODE_HEIGHT))
  const canvasWidth = Math.max(760, Math.ceil(maxX + CANVAS_PADDING))
  const canvasHeight = Math.max(560, Math.ceil(maxY + CANVAS_PADDING))

  // Step 3: mobile positions
  const minRfX = Math.min(...rfNodes.map((n) => n.position.x))
  const maxRfX = Math.max(...rfNodes.map((n) => n.position.x))
  const minRfY = Math.min(...rfNodes.map((n) => n.position.y))
  const maxRfY = Math.max(...rfNodes.map((n) => n.position.y))
  const horizontalRange = Math.max(1, maxRfX - minRfX)
  const verticalRange = Math.max(1, maxRfY - minRfY)

  const availableMobileWidth =
    MOBILE_CANVAS_WIDTH - MOBILE_NODE_WIDTH - MOBILE_CANVAS_PADDING * 2 - MOBILE_LABEL_BUFFER
  const mobileXScale = Math.min(1, Math.max(0.7, availableMobileWidth / horizontalRange))
  const mobileYScale = Math.max(0.92, mobileXScale * 1.08)

  const mobileNodes: RFNode[] = rfNodes.map((n) => ({
    ...n,
    position:
      n.data.mobilePositionX != null && n.data.mobilePositionY != null
        ? { x: n.data.mobilePositionX, y: n.data.mobilePositionY }
        : {
            x: (n.position.x - minRfX) * mobileXScale + MOBILE_CANVAS_PADDING,
            y: (n.position.y - minRfY) * mobileYScale + MOBILE_CANVAS_PADDING,
          },
    data: { ...n.data, compactMode: true },
  }))

  const mobileEdges: RFEdge[] = edges.map((e) => ({
    ...e,
    data: { ...e.data, compactMode: true },
  }))

  const mobileMaxX = Math.max(...mobileNodes.map((n) => n.position.x + MOBILE_NODE_WIDTH))
  const mobileMaxY = Math.max(...mobileNodes.map((n) => n.position.y + MOBILE_NODE_HEIGHT))
  const mobileCanvasWidth = Math.max(
    MOBILE_CANVAS_WIDTH,
    Math.ceil(mobileMaxX + MOBILE_CANVAS_PADDING)
  )
  const mobileCanvasHeight = Math.max(
    520,
    Math.ceil(mobileMaxY + MOBILE_CANVAS_PADDING + verticalRange * 0.06)
  )

  return {
    rfNodes,
    rfEdges: edges,
    canvasWidth,
    canvasHeight,
    mobileNodes,
    mobileEdges,
    mobileCanvasWidth,
    mobileCanvasHeight,
    mobileXScale,
    mobileYScale,
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
interface CanvasPreviewModalProps {
  nodes: RFNode[]
  edges: RFEdge[]
  onClose: () => void
  onNodesChange: (nodes: RFNode[]) => void
}

export default function CanvasPreviewModal({ nodes, edges, onClose, onNodesChange }: CanvasPreviewModalProps) {
  const [activeDevice, setActiveDevice] = useState<Device>('mobile')
  const [editMode, setEditMode] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Global node data state (for NodeEditPanel propagation back to main editor)
  const [localNodes, setLocalNodes] = useState<RFNode[]>(nodes)

  // Compute layouts once on modal open
  const [layouts] = useState<Layouts>(() => computeLayouts(nodes, edges))

  // Per-device layout state — positions and edge labels are independent per device
  const [deviceNodes, setDeviceNodes] = useState<Record<Device, RFNode[]>>(() => ({
    mobile: layouts.mobileNodes,
    tablet: layouts.rfNodes.map((n) => ({ ...n })),
    desktop: layouts.rfNodes.map((n) => ({ ...n })),
  }))

  const [deviceEdges, setDeviceEdges] = useState<Record<Device, RFEdge[]>>(() => ({
    mobile: layouts.mobileEdges,
    tablet: layouts.rfEdges.map((e) => ({ ...e })),
    desktop: layouts.rfEdges.map((e) => ({ ...e })),
  }))

  // Mobile uses ReactFlow viewport zoom instead of CSS transform
  const mobileScale = Math.min(1, 390 / layouts.mobileCanvasWidth)
  const mobileContainerHeight = Math.ceil(layouts.mobileCanvasHeight * mobileScale)

  // ── Handlers ──────────────────────────────────────────────────────────────

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setSaveError(null)

    let updatedLocalNodes: RFNode[]
    let canvasNodes: CanvasNodeData[]

    if (activeDevice === 'mobile') {
      // Mobile: store visual positions directly as mobilePositionX/mobilePositionY.
      // Raw positionX/positionY stays unchanged.
      const mobilePosById = new Map(deviceNodes.mobile.map((dn) => [dn.id, dn.position]))

      updatedLocalNodes = localNodes.map((n) => {
        const mPos = mobilePosById.get(n.id)
        return mPos
          ? { ...n, data: { ...n.data, mobilePositionX: mPos.x, mobilePositionY: mPos.y } }
          : n
      })

      canvasNodes = updatedLocalNodes.map((n) => ({
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
        mobilePositionX: n.data.mobilePositionX ?? null,
        mobilePositionY: n.data.mobilePositionY ?? null,
      }))
    } else {
      // Tablet / Desktop: reverse-transform rfNodes-space positions → raw DB coordinates.
      // Mobile-specific positions are preserved as-is.
      const minRawX = localNodes.length > 0 ? Math.min(...localNodes.map((n) => n.position.x)) : 0
      const minRawY = localNodes.length > 0 ? Math.min(...localNodes.map((n) => n.position.y)) : 0

      const rawPosById = new Map(
        deviceNodes[activeDevice].map((dn) => [
          dn.id,
          {
            x: dn.position.x - CANVAS_PADDING + minRawX,
            y: dn.position.y - CANVAS_PADDING + minRawY,
          },
        ])
      )

      updatedLocalNodes = localNodes.map((n) => {
        const rawPos = rawPosById.get(n.id)
        return rawPos ? { ...n, position: rawPos } : n
      })

      canvasNodes = updatedLocalNodes.map((n) => ({
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
        mobilePositionX: n.data.mobilePositionX ?? null,  // preserve existing mobile layout
        mobilePositionY: n.data.mobilePositionY ?? null,
      }))
    }

    // Use per-device edge labels
    const canvasEdges: CanvasEdgeData[] = deviceEdges[activeDevice].map((e) => ({
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
        setLocalNodes(updatedLocalNodes)
        onNodesChange(updatedLocalNodes)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } catch {
      setSaveError('Network error')
    } finally {
      setSaving(false)
    }
  }

  function handleDeviceNodesChange(device: Device, changes: NodeChange[]) {
    setDeviceNodes((prev) => ({
      ...prev,
      [device]: applyNodeChanges(changes, prev[device]) as RFNode[],
    }))
  }

  function handleDeviceEdgeUpdate(
    device: Device,
    edgeId: string,
    label: string,
    labelType: 'time' | 'action'
  ) {
    setDeviceEdges((prev) => ({
      ...prev,
      [device]: prev[device].map((e) =>
        e.id === edgeId ? { ...e, data: { ...e.data, label, labelType } } : e
      ),
    }))
  }

  function handleDeviceEdgeDelete(device: Device, edgeId: string) {
    setDeviceEdges((prev) => ({
      ...prev,
      [device]: prev[device].filter((e) => e.id !== edgeId),
    }))
  }

  // Node content edit — updates ALL devices + propagates to main editor
  function handleNodeUpdate(updated: RFNodeData) {
    const patchData = (arr: RFNode[]) =>
      arr.map((n) => (n.id === selectedNodeId ? { ...n, data: { ...n.data, ...updated } } : n))

    setDeviceNodes((prev) => ({
      mobile: patchData(prev.mobile),
      tablet: patchData(prev.tablet),
      desktop: patchData(prev.desktop),
    }))

    const newLocal = localNodes.map((n) =>
      n.id === selectedNodeId ? { ...n, data: { ...n.data, ...updated } } : n
    )
    setLocalNodes(newLocal)
    onNodesChange(newLocal)
  }

  function handleNodeClick(nodeId: string) {
    setSelectedNodeId(nodeId)
  }

  function handleSwitchDevice(device: Device) {
    setActiveDevice(device)
    setSelectedNodeId(null)
  }

  function toggleEditMode() {
    setEditMode((m) => !m)
    setSelectedNodeId(null)
  }

  // Selected node data (from localNodes — source of truth for content)
  const selectedNodeData =
    (localNodes.find((n) => n.id === selectedNodeId)?.data as RFNodeData | undefined) ?? null

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Header */}
      <div className="flex-none flex items-center justify-between px-5 py-3 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Preview</span>

        <div className="flex items-center gap-3">
          {/* Device switcher */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-neutral-800 rounded-lg p-1">
            {DEVICES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleSwitchDevice(d.id)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
                  activeDevice === d.id
                    ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-gray-300',
                ].join(' ')}
              >
                {d.icon}
                {d.label}
                <span className="text-[10px] text-gray-400 dark:text-neutral-500">{d.width}px</span>
              </button>
            ))}
          </div>

          {/* Edit toggle */}
          <button
            type="button"
            onClick={toggleEditMode}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border',
              editMode
                ? 'bg-blue-500 text-white border-transparent'
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700',
            ].join(' ')}
          >
            <IoPencilOutline size={14} />
            {editMode ? 'Editing' : 'Edit'}
          </button>

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              saving
                ? 'bg-gray-100 dark:bg-neutral-800 text-gray-400 cursor-not-allowed'
                : saved
                ? 'bg-green-500 text-white'
                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100',
            ].join(' ')}
          >
            {saving ? (
              <>
                <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <IoCheckmarkOutline size={14} />
                Saved
              </>
            ) : (
              <>
                <IoSaveOutline size={14} />
                Save
              </>
            )}
          </button>

          {saveError && (
            <span className="flex items-center gap-1 text-[10px] text-red-500">
              <IoAlertCircleOutline size={12} />
              {saveError}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <IoCloseOutline size={20} />
        </button>
      </div>

      {/* Body — relative so NodeEditPanel can slide in from right */}
      <div className="relative flex-1 overflow-hidden">
        {/* Scrollable preview area */}
        <div className="overflow-y-auto h-full flex flex-col items-center py-8 px-4 gap-0">

          {/* Mobile */}
          {activeDevice === 'mobile' && (
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs text-gray-400 dark:text-neutral-500">iPhone — 390px</span>
              <div
                className="rounded-[2rem] border-[6px] border-gray-300 dark:border-neutral-600 shadow-2xl overflow-hidden bg-white dark:bg-neutral-900"
                style={{ width: 390 + 12 }}
              >
                <div style={{ width: 390, height: mobileContainerHeight }}>
                  <CanvasPreviewInteractive
                    nodes={deviceNodes.mobile}
                    edges={deviceEdges.mobile}
                    scale={mobileScale}
                    draggable={editMode}
                    onNodesChange={(changes) => handleDeviceNodesChange('mobile', changes)}
                    onEdgeUpdate={(id, label, type) => handleDeviceEdgeUpdate('mobile', id, label, type)}
                    onEdgeDelete={(id) => handleDeviceEdgeDelete('mobile', id)}
                    onNodeClick={handleNodeClick}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tablet */}
          {activeDevice === 'tablet' && (
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs text-gray-400 dark:text-neutral-500">Tablet — 768px</span>
              <div
                className="rounded-2xl border-[6px] border-gray-300 dark:border-neutral-600 shadow-2xl overflow-hidden bg-white dark:bg-neutral-900"
                style={{ width: 768 + 12 }}
              >
                <div className="overflow-x-auto" style={{ width: 768 }}>
                  <div style={{ width: layouts.canvasWidth, height: layouts.canvasHeight }}>
                    <CanvasPreviewInteractive
                      nodes={deviceNodes.tablet}
                      edges={deviceEdges.tablet}
                      draggable={editMode}
                      onNodesChange={(changes) => handleDeviceNodesChange('tablet', changes)}
                      onEdgeUpdate={(id, label, type) => handleDeviceEdgeUpdate('tablet', id, label, type)}
                      onEdgeDelete={(id) => handleDeviceEdgeDelete('tablet', id)}
                      onNodeClick={handleNodeClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop */}
          {activeDevice === 'desktop' && (
            <div className="flex flex-col items-center gap-3 w-full md:max-w-3xl">
              <span className="text-xs text-gray-400 dark:text-neutral-500">Desktop — md:max-w-3xl</span>
              <div className="rounded-2xl border-[6px] border-gray-300 dark:border-neutral-600 shadow-2xl overflow-hidden bg-white dark:bg-neutral-900 w-full">
                <div className="w-full" style={{ height: layouts.canvasHeight }}>
                    <CanvasPreviewInteractive
                      nodes={deviceNodes.desktop}
                      edges={deviceEdges.desktop}
                      draggable={editMode}
                      onNodesChange={(changes) => handleDeviceNodesChange('desktop', changes)}
                      onEdgeUpdate={(id, label, type) => handleDeviceEdgeUpdate('desktop', id, label, type)}
                      onEdgeDelete={(id) => handleDeviceEdgeDelete('desktop', id)}
                      onNodeClick={handleNodeClick}
                    />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Node edit panel — slides in from right */}
        <NodeEditPanel
          node={selectedNodeData}
          onUpdate={handleNodeUpdate}
          onDelete={() => {}}
          onClose={() => setSelectedNodeId(null)}
        />
      </div>
    </div>
  )
}
