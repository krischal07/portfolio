export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { projectNode, projectEdge } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import type { RFNode, RFEdge } from '@/components/canvas/ProjectCanvas'
import ProjectsViewCanvasLoader from '@/components/canvas/ProjectsViewCanvasLoader'

const NODE_WIDTH = 220
const NODE_HEIGHT = 190
const CANVAS_PADDING = 80

export default async function ProjectsPage() {
  const [nodes, edges] = await Promise.all([
    db.select().from(projectNode).orderBy(asc(projectNode.createdAt)),
    db.select().from(projectEdge).orderBy(asc(projectEdge.createdAt)),
  ])

  if (nodes.length === 0) {
    return (
      <main className="mx-auto max-w-3xl w-full px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Projects</h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">No projects yet.</p>
      </main>
    )
  }

  const minX = Math.min(...nodes.map((n) => n.positionX))
  const minY = Math.min(...nodes.map((n) => n.positionY))

  const rfNodes: RFNode[] = nodes.map((n) => ({
    id: n.id,
    type: 'journeyNode',
    position: {
      x: n.positionX - minX + CANVAS_PADDING,
      y: n.positionY - minY + CANVAS_PADDING,
    },
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
      editorMode: false,
    },
  }))

  const rfEdges: RFEdge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'journeyEdge',
    data: {
      label: e.label,
      labelType: e.labelType as 'time' | 'action',
    },
  }))

  const maxX = Math.max(...rfNodes.map((n) => n.position.x + NODE_WIDTH))
  const maxY = Math.max(...rfNodes.map((n) => n.position.y + NODE_HEIGHT))
  const canvasWidth = Math.max(760, Math.ceil(maxX + CANVAS_PADDING))
  const canvasHeight = Math.max(560, Math.ceil(maxY + CANVAS_PADDING))

  return (
    <main className="mx-auto md:max-w-3xl w-full px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Projects
      </h2>

      <div className="w-full overflow-x-auto">
        <div style={{ width: canvasWidth, height: canvasHeight }}>
          <ProjectsViewCanvasLoader nodes={rfNodes} edges={rfEdges} />
        </div>
      </div>
    </main>
  )
}
