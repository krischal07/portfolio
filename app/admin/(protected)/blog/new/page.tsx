'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(body.error ?? 'Failed to create post')
      setLoading(false)
      return
    }

    router.push('/admin/blog')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Blog Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          name="title"
          placeholder="Title"
          required
          className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
        />
        <input
          name="slug"
          placeholder="slug-url-here"
          required
          className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
        />
        <input
          name="excerpt"
          placeholder="Short excerpt (optional)"
          className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
        />
        <textarea
          name="content"
          placeholder="Content (Markdown)"
          required
          rows={12}
          className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent font-mono resize-y"
        />
        <select
          name="status"
          defaultValue="draft"
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
            {loading ? 'Saving...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-gray-200 dark:border-neutral-700 rounded-lg px-4 py-2 text-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
