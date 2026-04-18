export type NodeType = 'milestone' | 'project'
export type LabelType = 'time' | 'action'

export interface CanvasNodeData {
  id: string
  nodeType: NodeType
  iconName: string
  iconColor: string
  iconBgColor: string
  category: string
  title: string
  description: string
  techStack: string[]
  githubUrl?: string | null
  liveUrl?: string | null
  date?: string | null
  positionX: number
  positionY: number
  mobilePositionX?: number | null
  mobilePositionY?: number | null
}

export interface CanvasEdgeData {
  id: string
  source: string
  target: string
  sourceHandle?: string | null
  targetHandle?: string | null
  label?: string | null
  labelType: LabelType
}

export interface CanvasPayload {
  nodes: CanvasNodeData[]
  edges: CanvasEdgeData[]
}

// Data payload inside a React Flow node (position is handled by RF separately)
export type RFNodeData = Omit<CanvasNodeData, 'positionX' | 'positionY'>
