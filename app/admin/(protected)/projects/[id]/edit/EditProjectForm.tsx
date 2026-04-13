'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Project = {
  id: string
  title: string
  description: string
  category: string
  techStack: string[]
  githubUrl: string | null
  liveUrl: string | null
  date: string | null
}

export default function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
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

    const res = await fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json()
      setError(body.error ?? 'Failed to update project')
      setLoading(false)
      return
    }

    router.push('/admin/projects')
  }

  async function handleDelete() {
    if (!confirm('Delete this project? This cannot be undone.')) return
    setDeleting(true)

    const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' })

    if (!res.ok) {
      setError('Failed to delete project')
      setDeleting(false)
      return
    }

    router.push('/admin/projects')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        name="title"
        defaultValue={project.title}
        placeholder="Title"
        required
        className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
      />
      <textarea
        name="description"
        defaultValue={project.description}
        placeholder="Description"
        required
        rows={3}
        className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent resize-y"
      />
      <input
        name="category"
        defaultValue={project.category}
        placeholder="Category"
        required
        className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
      />
      <input
        name="techStack"
        defaultValue={project.techStack.join(', ')}
        placeholder="Tech stack (comma-separated)"
        className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
      />
      <input
        name="githubUrl"
        defaultValue={project.githubUrl ?? ''}
        placeholder="GitHub URL (optional)"
        type="url"
        className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
      />
      <input
        name="liveUrl"
        defaultValue={project.liveUrl ?? ''}
        placeholder="Live URL (optional)"
        type="url"
        className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
      />
      <input
        name="date"
        defaultValue={project.date ?? ''}
        placeholder="Date (e.g. 2024-01)"
        className="border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm bg-transparent"
      />
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
