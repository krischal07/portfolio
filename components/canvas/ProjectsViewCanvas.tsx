'use client'

import {
  ReactFlow,
  ReactFlowProvider,
  MarkerType,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import CanvasNodeCard from './CanvasNodeCard'
import CanvasEdgeLabel from './CanvasEdgeLabel'
import type { RFNode, RFEdge } from './ProjectCanvas'

const nodeTypes: NodeTypes = { journeyNode: CanvasNodeCard }
const edgeTypes: EdgeTypes = { journeyEdge: CanvasEdgeLabel }

interface ProjectsViewCanvasProps {
  nodes: RFNode[]
  edges: RFEdge[]
}

function ViewCanvasInner({ nodes, edges }: ProjectsViewCanvasProps) {
  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodes={nodes}
      edges={edges}
      fitView
      fitViewOptions={{ padding: 0.01, minZoom: 0.2, maxZoom: 1 }}
      defaultEdgeOptions={{
        type: 'journeyEdge',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
      }}
      nodesDraggable={false}
      nodesConnectable={false}
      nodesFocusable={false}
      edgesFocusable={false}
      elementsSelectable={false}
      panOnDrag={false}
      panOnScroll={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
      minZoom={0.2}
      maxZoom={1}
      proOptions={{ hideAttribution: true }}
      className="rounded-2xl"
    />
  )
}

export default function ProjectsViewCanvas(props: ProjectsViewCanvasProps) {
  return (
    <ReactFlowProvider>
      <ViewCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
