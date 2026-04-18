import { db } from '@/lib/db'
import { projectNode, projectEdge } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import type { RFNode, RFEdge } from '@/components/canvas/ProjectCanvas'
import CanvasEditorLoader from '@/components/canvas/CanvasEditorLoader'

export default async function CanvasEditorPage() {
  const [nodes, edges] = await Promise.all([
    db.select().from(projectNode).orderBy(asc(projectNode.createdAt)),
    db.select().from(projectEdge).orderBy(asc(projectEdge.createdAt)),
  ])

  // Convert DB flat rows to React Flow node format
  const rfNodes: RFNode[] = nodes.map((n) => ({
    id: n.id,
    type: 'journeyNode',
    position: { x: n.positionX, y: n.positionY },
    data: {
      id: n.id,
      nodeType: n.nodeType as 'project' | 'milestone',
      iconName: n.iconName,
      iconColor: n.iconColor,
      iconBgColor: n.iconBgColor,
      category: n.category,
      title: n.title,
      description: n.description,
      techStack: n.techStack as string[],
      githubUrl: n.githubUrl,
      liveUrl: n.liveUrl,
      date: n.date,
      mobilePositionX: n.mobilePositionX ?? null,
      mobilePositionY: n.mobilePositionY ?? null,
      editorMode: true,
    },
  }))

  // Convert DB edge rows to React Flow edge format
  const rfEdges: RFEdge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? undefined,
    targetHandle: e.targetHandle ?? undefined,
    type: 'journeyEdge',
    data: {
      label: e.label,
      labelType: e.labelType as 'time' | 'action',
    },
  }))

  return (
    // Negative margins cancel the layout's p-6 lg:p-8 padding
    // h-screen fills the full viewport so the canvas occupies all available space
    <div className="-m-6 lg:-m-8 h-screen relative overflow-hidden">
      <CanvasEditorLoader initialNodes={rfNodes} initialEdges={rfEdges} />
    </div>
  )
}
