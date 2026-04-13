import { db } from '@/lib/db'
import { project } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'

export default async function AdminProjectsPage() {
  const projects = await db
    .select()
    .from(project)
    .orderBy(desc(project.createdAt))

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium"
        >
          New Project
        </Link>
      </div>
      {projects.length === 0 ? (
        <p className="text-sm text-gray-500">No projects yet. Create your first one.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm">{p.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {p.category}{p.date ? ` · ${p.date}` : ''}
                </p>
              </div>
              <Link
                href={`/admin/projects/${p.id}/edit`}
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
