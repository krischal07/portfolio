import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projectNode } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const deleted = await db
    .delete(projectNode)
    .where(eq(projectNode.id, id))
    .returning()

  if (deleted.length === 0) {
    return NextResponse.json({ error: 'Node not found' }, { status: 404 })
  }

  // FK cascade in DB handles removal of connected edges automatically
  return new NextResponse(null, { status: 204 })
}
