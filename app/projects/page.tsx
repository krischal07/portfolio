export const revalidate = 300

import { db } from '@/lib/db'
import { projectNode, projectEdge } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import type { RFNode, RFEdge } from '@/components/canvas/ProjectCanvas'
import ProjectsViewCanvasLoader from '@/components/canvas/ProjectsViewCanvasLoader'
import MobileProjectsCanvas from '@/components/canvas/MobileProjectsCanvas'

const NODE_HEIGHT = 190
const CANVAS_PADDING = 24
const MOBILE_CANVAS_WIDTH = 360
const MOBILE_CANVAS_PADDING = 14
const MOBILE_NODE_WIDTH = 184
const MOBILE_NODE_HEIGHT = 176
const MOBILE_LABEL_BUFFER = 64

export default async function ProjectsPage() {
  const [nodes, edges] = await Promise.all([
    db.select().from(projectNode).orderBy(asc(projectNode.createdAt)),
    db.select().from(projectEdge).orderBy(asc(projectEdge.createdAt)),
  ])

  if (nodes.length === 0) {
    return (
      <main className="mx-auto max-w-3xl w-full px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">My Journe</h2>
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
      logoUrl: n.logoUrl ?? null,
      category: n.category,
      title: n.title,
      description: n.description,
      techStack: n.techStack as string[],
      githubUrl: n.githubUrl,
      liveUrl: n.liveUrl,
      date: n.date,
      mobilePositionX: n.mobilePositionX ?? null,
      mobilePositionY: n.mobilePositionY ?? null,
      editorMode: false,
    },
  }))

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

  const mobileEdges: RFEdge[] = rfEdges.map((edge) => ({
    ...edge,
    data: {
      ...edge.data,
      compactMode: true,
    },
  }))

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
    data: {
      ...n.data,
      compactMode: true,
    },
  }))

  const maxY = Math.max(...rfNodes.map((n) => n.position.y + NODE_HEIGHT))
  const canvasHeight = Math.max(560, Math.ceil(maxY + CANVAS_PADDING))

  const mobileMaxX = Math.max(...mobileNodes.map((n) => n.position.x + MOBILE_NODE_WIDTH))
  const mobileMaxY = Math.max(...mobileNodes.map((n) => n.position.y + MOBILE_NODE_HEIGHT))
  const mobileCanvasWidth = Math.max(MOBILE_CANVAS_WIDTH, Math.ceil(mobileMaxX + MOBILE_CANVAS_PADDING))
  const mobileCanvasHeight = Math.max(
    520,
    Math.ceil(mobileMaxY + MOBILE_CANVAS_PADDING + verticalRange * 0.06)
  )

  return (
    <main className="mx-auto md:max-w-3xl w-full px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        My Little Journey
      </h2>

      <div className="md:hidden w-full">
        <MobileProjectsCanvas
          nodes={mobileNodes}
          edges={mobileEdges}
          canvasWidth={mobileCanvasWidth}
          canvasHeight={mobileCanvasHeight}
        />
      </div>

      <div className="hidden md:block w-full ">
        <div className="w-full" style={{ height: canvasHeight }}>    
          <ProjectsViewCanvasLoader nodes={rfNodes} edges={rfEdges} />
        </div>
      </div>
    </main>
  )
}
