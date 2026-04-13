import { db } from '@/lib/db'
import { project } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import EditProjectForm from './EditProjectForm'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const projects = await db.select().from(project).where(eq(project.id, id)).limit(1)

  if (!projects[0]) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
      <EditProjectForm project={projects[0]} />
    </div>
  )
}
