import { db } from '@/lib/db'
import { blogPost } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'

export default async function AdminBlogPage() {
  const posts = await db
    .select()
    .from(blogPost)
    .orderBy(desc(blogPost.createdAt))

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium"
        >
          New Post
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="text-sm text-gray-500">No posts yet. Create your first one.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm">{post.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {post.status} · /{post.slug}
                </p>
              </div>
              <Link
                href={`/admin/blog/${post.id}/edit`}
                className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
