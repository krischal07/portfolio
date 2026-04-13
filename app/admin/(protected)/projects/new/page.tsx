'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const techStackRaw = form.get('techStack') as string
    const data = {
      title: form.get('title') as string,
      description: form.get('description') as string,
      category: form.get('category') as string,
      techStack: techStackRaw.split(',').map((s) => s.trim()).filter(Boolean),
      githubUrl: form.get('githubUrl') as string || null,
      liveUrl: form.get('liveUrl') as string || null,
      date: form.get('date') as string || null,
    }

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(body.error ?? 'Failed to create project')
      setLoading(false)
      return
    }

    router.push('/admin/projects')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Project</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          name="title"
          placeholder="Title"
          required
          className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          rows={3}
          className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent resize-y"
        />
        <input
          name="category"
          placeholder="Category (e.g. Web App)"
          required
          className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
        />
        <input
          name="techStack"
          placeholder="Tech stack (comma-separated: React, TypeScript, ...)"
          className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
        />
        <input
          name="githubUrl"
          placeholder="GitHub URL (optional)"
          type="url"
          className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
        />
        <input
          name="liveUrl"
          placeholder="Live URL (optional)"
          type="url"
          className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
        />
        <input
          name="date"
          placeholder="Date (e.g. 2024-01)"
          className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving...' : 'Create Project'}
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
