'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Post = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  status: 'draft' | 'published'
}

export default function EditBlogPostForm({ post }: { post: Post }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const data = {
      title: form.get('title') as string,
      slug: form.get('slug') as string,
      content: form.get('content') as string,
      excerpt: form.get('excerpt') as string,
      status: form.get('status') as string,
    }

    const res = await fetch(`/api/blog/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(body.error ?? 'Failed to update post')
      setLoading(false)
      return
    }

    router.push('/admin/blog')
  }

  async function handleDelete() {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(true)

    const res = await fetch(`/api/blog/${post.id}`, { method: 'DELETE' })

    if (!res.ok) {
      setError('Failed to delete post')
      setDeleting(false)
      return
    }

    router.push('/admin/blog')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        name="title"
        defaultValue={post.title}
        placeholder="Title"
        required
        className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
      />
      <input
        name="slug"
        defaultValue={post.slug}
        placeholder="slug-url-here"
        required
        className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
      />
      <input
        name="excerpt"
        defaultValue={post.excerpt ?? ''}
        placeholder="Short excerpt (optional)"
        className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
      />
      <textarea
        name="content"
        defaultValue={post.content}
        placeholder="Content (Markdown)"
        required
        rows={12}
        className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent font-mono resize-y"
      />
      <select
        name="status"
        defaultValue={post.status}
        className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-200 dark:border-neutral-700 rounded-lg px-4 py-2 text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="ml-auto text-red-500 hover:text-red-700 text-sm disabled:opacity-50 cursor-pointer"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </form>
  )
}
