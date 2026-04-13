import { db } from '@/lib/db'
import { blogPost } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import EditBlogPostForm from './EditBlogPostForm'

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const posts = await db.select().from(blogPost).where(eq(blogPost.id, id)).limit(1)

  if (!posts[0]) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <EditBlogPostForm post={posts[0]} />
    </div>
  )
}
