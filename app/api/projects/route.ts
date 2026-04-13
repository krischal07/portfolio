import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { project } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { desc } from 'drizzle-orm'

export async function GET() {
  const projects = await db
    .select()
    .from(project)
    .orderBy(desc(project.createdAt))

  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  if (!body.title || !body.description || !body.category) {
    return NextResponse.json(
      { error: 'title, description, and category are required' },
      { status: 400 }
    )
  }

  const created = await db
    .insert(project)
    .values({
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      category: body.category,
      techStack: body.techStack ?? [],
      githubUrl: body.githubUrl ?? null,
      liveUrl: body.liveUrl ?? null,
      date: body.date ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  return NextResponse.json(created[0], { status: 201 })
}
