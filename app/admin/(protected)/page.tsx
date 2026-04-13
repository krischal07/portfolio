import { db } from '@/lib/db'
import { blogPost, project } from '@/lib/db/schema'
import { count, eq, desc } from 'drizzle-orm'
import Link from 'next/link'
import { FiFileText, FiFolder, FiCheckCircle, FiEdit3, FiArrowRight, FiPlus } from 'react-icons/fi'

export default async function AdminDashboard() {
  const [
    totalBlogsResult,
    publishedResult,
    draftResult,
    totalProjectsResult,
    recentPosts,
    recentProjects,
  ] = await Promise.all([
    db.select({ count: count() }).from(blogPost),
    db.select({ count: count() }).from(blogPost).where(eq(blogPost.status, 'published')),
    db.select({ count: count() }).from(blogPost).where(eq(blogPost.status, 'draft')),
    db.select({ count: count() }).from(project),
    db.select().from(blogPost).orderBy(desc(blogPost.createdAt)).limit(5),
    db.select().from(project).orderBy(desc(project.createdAt)).limit(5),
  ])

  const totalBlogs = totalBlogsResult[0].count
  const publishedBlogs = publishedResult[0].count
  const draftBlogs = draftResult[0].count
  const totalProjects = totalProjectsResult[0].count

  const stats = [
    {
      label: 'Total Posts',
      value: totalBlogs,
      description: 'All blog posts',
      icon: FiFileText,
      iconBg: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Published',
      value: publishedBlogs,
      description: 'Live on the site',
      icon: FiCheckCircle,
      iconBg: 'bg-green-50 dark:bg-green-950',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Drafts',
      value: draftBlogs,
      description: 'Not yet published',
      icon: FiEdit3,
      iconBg: 'bg-amber-50 dark:bg-amber-950',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Projects',
      value: totalProjects,
      description: 'Portfolio entries',
      icon: FiFolder,
      iconBg: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ]

  return (
    <div className="max-w-screen-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">Overview of your content</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <FiPlus size={13} />
            New Post
          </Link>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors font-medium"
          >
            <FiPlus size={13} />
            New Project
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                <stat.icon size={15} className={stat.iconColor} />
              </div>
              <span className="text-sm text-gray-500 dark:text-neutral-400 font-medium">{stat.label}</span>
            </div>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiFileText size={14} className="text-gray-500 dark:text-neutral-400" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Blog Posts</h2>
            </div>
            <Link
              href="/admin/blog"
              className="flex items-center gap-1 text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              View all <FiArrowRight size={11} />
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-gray-400 dark:text-neutral-500">No posts yet.</p>
              <Link href="/admin/blog/new" className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <FiPlus size={11} /> Create your first post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/blog/${post.id}/edit`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-gray-700 dark:group-hover:text-gray-200">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                      /{post.slug}
                    </p>
                  </div>
                  <span
                    className={`ml-3 shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      post.status === 'published'
                        ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    {post.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiFolder size={14} className="text-gray-500 dark:text-neutral-400" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
            </div>
            <Link
              href="/admin/projects"
              className="flex items-center gap-1 text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              View all <FiArrowRight size={11} />
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-gray-400 dark:text-neutral-500">No projects yet.</p>
              <Link href="/admin/projects/new" className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <FiPlus size={11} /> Add your first project
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {recentProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/projects/${p.id}/edit`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-gray-700 dark:group-hover:text-gray-200">
                      {p.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                      {p.date ? `${p.date} · ` : ''}{p.category}
                    </p>
                  </div>
                  <span className="ml-3 shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400">
                    {p.category}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
