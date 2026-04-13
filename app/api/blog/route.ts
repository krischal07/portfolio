import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { blogPost } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  const posts = await db
    .select()
    .from(blogPost)
    .where(eq(blogPost.status, 'published'))
    .orderBy(desc(blogPost.createdAt))

  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  if (!body.title || !body.slug || !body.content) {
    return NextResponse.json({ error: 'title, slug, and content are required' }, { status: 400 })
  }

  const post = await db
    .insert(blogPost)
    .values({
      id: crypto.randomUUID(),
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt ?? null,
      status: body.status ?? 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()

  return NextResponse.json(post[0], { status: 201 })
}
