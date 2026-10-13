import type { Metadata } from 'next'
import { cache } from 'react'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/db'
import { blogPost } from '@/lib/db/schema'
import BlogMarkdown from '@/components/BlogMarkdown'
import BlogTags from '@/components/BlogTags'
import { MARKISH_BLOG_COVER, MARKISH_BLOG_TAGS } from '@/lib/blog-presentation'

const getPublishedPost = cache(async (slug: string) => {
  const posts = await db
    .select()
    .from(blogPost)
    .where(eq(blogPost.slug, slug))
    .limit(1)
  const post = posts[0]
  return post?.status === 'published' ? post : null
})

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPost(slug)

  if (!post) {
    return { title: 'Article not found', robots: { index: false, follow: false } }
  }

  const description = post.excerpt || `A build note from Krischal Shrestha about ${post.title}.`
  const canonical = `https://krischal.space/blog/${post.slug}`

  return {
    title: post.title,
    description,
    keywords: [
      'Markish',
      'markish.tech',
      'social media management',
      'social media scheduling',
      'content planning',
      'social media publishing',
      'Krischal Shrestha',
    ],
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: post.title,
      description,
      siteName: 'Krischal Shrestha',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ['https://krischal.space'],
      images: [{ url: MARKISH_BLOG_COVER.src, alt: MARKISH_BLOG_COVER.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [MARKISH_BLOG_COVER.src],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPublishedPost(slug)
  if (!post) notFound()

  const canonical = `https://krischal.space/blog/${post.slug}`
  const description = post.excerpt || `A build note from Krischal Shrestha about ${post.title}.`
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Krischal Shrestha',
      url: 'https://krischal.space',
    },
    publisher: {
      '@type': 'Person',
      name: 'Krischal Shrestha',
      url: 'https://krischal.space',
    },
    mainEntityOfPage: canonical,
    about: {
      '@type': 'Organization',
      name: 'Markish',
      url: 'https://www.markish.tech/',
    },
    keywords: MARKISH_BLOG_TAGS.join(', '),
    image: `https://krischal.space${MARKISH_BLOG_COVER.src}`,
  }

  return (
    <main className="mx-auto min-h-screen w-full min-w-0 max-w-3xl px-4 py-10 sm:py-14">
      <article>
        <header className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
          >
            <span aria-hidden="true">←</span> Markish build notes
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-5xl sm:leading-[1.12]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-neutral-300">
              {post.excerpt}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-2 text-sm text-gray-500 dark:text-neutral-400">
            <span>By Krischal Shrestha</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.createdAt.toISOString()}>
              {new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(post.createdAt)}
            </time>
          </div>
          <div className="mt-6">
            <BlogTags tags={MARKISH_BLOG_TAGS} />
          </div>
        </header>

        <figure className="relative mt-9 aspect-[16/8.5] overflow-hidden rounded-3xl border border-gray-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
          <Image
            src={MARKISH_BLOG_COVER.src}
            alt={MARKISH_BLOG_COVER.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover"
          />
          <figcaption className="sr-only">Markish product and brand overview</figcaption>
        </figure>

        <div className="mt-10 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
          <div className="min-w-0">
            <BlogMarkdown content={post.content} />
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo/markish.jpg"
                  alt="Markish logo"
                  width={44}
                  height={44}
                  className="rounded-xl"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Markish</p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">Social media, made simpler</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-neutral-300">
                Plan, schedule, and publish social posts, work with your team, and track results in one place.
              </p>
              <a
                href="https://www.markish.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 dark:bg-white dark:text-gray-950 dark:hover:bg-emerald-200"
              >
                Visit Markish <span aria-hidden="true">↗</span>
              </a>
              <p className="mt-3 text-center text-xs text-gray-500 dark:text-neutral-400">markish.tech</p>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-200 p-5 dark:border-neutral-800">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-neutral-400">In this article</p>
              <a href="#the-work-around-the-post-matters" className="mt-4 block text-sm text-gray-700 underline decoration-gray-300 underline-offset-4 dark:text-neutral-300">The work around the post</a>
              <a href="#make-the-workflow-easier-to-follow" className="mt-3 block text-sm text-gray-700 underline decoration-gray-300 underline-offset-4 dark:text-neutral-300">A clearer workflow</a>
              <a href="#ai-should-support-the-teams-judgment" className="mt-3 block text-sm text-gray-700 underline decoration-gray-300 underline-offset-4 dark:text-neutral-300">AI and team judgment</a>
              <a href="#building-it-is-a-series-of-choices" className="mt-3 block text-sm text-gray-700 underline decoration-gray-300 underline-offset-4 dark:text-neutral-300">Building the product</a>
            </div>
          </aside>
        </div>

        <footer className="mt-12 flex flex-col gap-4 rounded-2xl border border-emerald-900/10 bg-emerald-50/70 p-5 dark:border-emerald-300/10 dark:bg-emerald-950/20 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm leading-6 text-gray-700 dark:text-neutral-300">
          Building Markish?{' '}
          <a
            href="https://www.markish.tech/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-950 underline underline-offset-4 dark:text-white"
          >
            Visit markish.tech ↗
          </a>
          .
          </p>
          <Link href="/blog" className="shrink-0 text-sm font-semibold text-gray-700 underline underline-offset-4 dark:text-neutral-300">More build notes →</Link>
        </footer>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
    </main>
  )
}
