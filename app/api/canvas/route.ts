import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projectNode, projectEdge } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { asc } from 'drizzle-orm'
import type { CanvasNodeData, CanvasEdgeData } from '@/lib/canvas-types'

export async function GET() {
  const [nodes, edges] = await Promise.all([
    db.select().from(projectNode).orderBy(asc(projectNode.createdAt)),
    db.select().from(projectEdge).orderBy(asc(projectEdge.createdAt)),
  ])

  return NextResponse.json({ nodes, edges })
}

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as { nodes: CanvasNodeData[]; edges: CanvasEdgeData[] }

  if (!Array.isArray(body.nodes) || !Array.isArray(body.edges)) {
    return NextResponse.json(
      { error: 'nodes and edges arrays are required' },
      { status: 400 }
    )
  }

  const now = new Date()

  const nodeValues = body.nodes.map((n) => ({
    id: n.id,
    nodeType: n.nodeType,
    iconName: n.iconName,
    iconColor: n.iconColor,
    iconBgColor: n.iconBgColor,
    category: n.category,
    title: n.title,
    description: n.description,
    techStack: n.techStack,
    githubUrl: n.githubUrl ?? null,
    liveUrl: n.liveUrl ?? null,
    date: n.date ?? null,
    positionX: n.positionX,
    positionY: n.positionY,
    createdAt: now,
    updatedAt: now,
  }))

  const edgeValues = body.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label ?? null,
    labelType: e.labelType,
    createdAt: now,
  }))

  // Full replace — delete all then re-insert sequentially
  // (neon-http driver does not support transactions)
  await db.delete(projectEdge)
  await db.delete(projectNode)
  if (nodeValues.length > 0) {
    await db.insert(projectNode).values(nodeValues)
  }
  if (edgeValues.length > 0) {
    await db.insert(projectEdge).values(edgeValues)
  }

  return NextResponse.json({ ok: true })
}
