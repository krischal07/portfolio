import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { blogPost } from '@/lib/db/schema'
import BlogTags from '@/components/BlogTags'
import { MARKISH_BLOG_COVER, MARKISH_BLOG_TAGS } from '@/lib/blog-presentation'

export const metadata: Metadata = {
  title: 'Markish & Product Building',
  description:
    'Build notes from Krischal Shrestha on Markish, social media management, content planning, and building useful products.',
  keywords: [
    'Markish',
    'markish.tech',
    'social media management',
    'social media scheduling',
    'content planning',
    'Krischal Shrestha',
  ],
  alternates: { canonical: 'https://krischal.space/blog' },
  openGraph: {
    type: 'website',
    url: 'https://krischal.space/blog',
    title: 'Markish & Product Building | Krischal Shrestha',
    description:
      'Build notes on Markish, social media management, content planning, and building useful products.',
    images: [{ url: MARKISH_BLOG_COVER.src, alt: MARKISH_BLOG_COVER.alt }],
  },
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(date)
}

export default async function BlogPage() {
  const posts = await db
    .select()
    .from(blogPost)
    .where(eq(blogPost.status, 'published'))
    .orderBy(desc(blogPost.createdAt))

  return (
    <main className="mx-auto min-h-screen w-full min-w-0 max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
            Field notes · Markish
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
            Building a calmer way to do social media.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-neutral-300">
            Product lessons, ideas, and behind-the-scenes notes from building
            Markish for teams that plan, create, and publish together.
          </p>
        </div>
        <a
          href="https://www.markish.tech/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-white dark:text-gray-950 dark:hover:bg-emerald-200"
        >
          Explore Markish <span aria-hidden="true">↗</span>
        </a>
      </header>

      {posts.length ? (
        <div className="flex flex-col gap-5">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group grid min-w-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-950 md:grid-cols-[1fr_1fr]"
            >
              <Link
                href={`/blog/${post.slug}`}
                aria-label={`Read ${post.title}`}
                className="relative block min-h-64 overflow-hidden bg-neutral-100 dark:bg-neutral-900 sm:min-h-80"
              >
                <Image
                  src={MARKISH_BLOG_COVER.src}
                  alt={MARKISH_BLOG_COVER.alt}
                  fill
                  priority={post.id === posts[0]?.id}
                  sizes="(max-width: 768px) 100vw, 48vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.025]"
                />
              </Link>
              <div className="flex min-w-0 flex-col justify-center p-5 sm:p-7">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
                  <span>Markish journal</span>
                  <span aria-hidden="true" className="text-gray-300 dark:text-neutral-700">/</span>
                  <time dateTime={post.createdAt.toISOString()} className="tracking-normal text-gray-500 dark:text-neutral-400">
                    {formatDate(post.createdAt)}
                  </time>
                </div>
                <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-3xl">
                  <Link href={`/blog/${post.slug}`} className="decoration-emerald-500 decoration-2 underline-offset-4 group-hover:underline">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && (
                  <p className="mt-4 leading-7 text-gray-600 dark:text-neutral-300">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-6">
                  <BlogTags tags={MARKISH_BLOG_TAGS} />
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:border-emerald-600 hover:text-emerald-800 dark:border-neutral-700 dark:text-white dark:hover:border-emerald-400 dark:hover:text-emerald-300"
                  >
                    Read the story <span aria-hidden="true">→</span>
                  </Link>
                  <a
                    href="https://www.markish.tech/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
                  >
                    Visit markish.tech ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-neutral-300">
          The first Markish build note is on its way.
        </p>
      )}

      <footer className="mt-12 flex flex-col gap-4 rounded-2xl border border-emerald-900/10 bg-emerald-50/70 p-5 dark:border-emerald-300/10 dark:bg-emerald-950/20 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Made for the work behind every post.</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-neutral-300">Plan, schedule, and publish with Markish.</p>
        </div>
        <a href="https://www.markish.tech/" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-emerald-800 underline underline-offset-4 dark:text-emerald-300">
          Learn about Markish <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </main>
  )
}
