'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import animationData from '@/public/lottie/under-construction.json'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const BlogPage = () => {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl items-center justify-center px-4 py-8 sm:py-12">
      <section className="w-full rounded-3xl border border-gray-200/80 bg-gradient-to-b from-white to-gray-50 p-6 text-center shadow-sm dark:border-neutral-800 dark:from-neutral-950 dark:to-black sm:p-10">
        <div className="mx-auto w-full max-w-[260px] sm:max-w-[340px] md:max-w-[380px]">
          <div className=" flex items-start aspect-square w-full rounded-2xl bg-white dark:bg-black p-2 sm:p-3 relative">
            <Lottie animationData={animationData} loop autoplay className=" h-full w-full absolute right-5 md:right-10" />
          </div>
        </div>

        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-neutral-400 sm:text-xs">
          Under Construction
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-[2.6rem]">
          Blog Coming Soon
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-7 text-gray-600 dark:text-neutral-300 sm:text-base">
          I am building this section right now. Fresh posts, build notes, and engineering write-ups will land here soon.
        </p>

        <div className="mt-7 sm:mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-900"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  )
}

export default BlogPage
