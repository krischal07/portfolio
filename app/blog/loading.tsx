export default function BlogLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading blog articles"
      className="mx-auto min-h-screen w-full min-w-0 max-w-3xl px-4 py-10 sm:py-14"
    >
      <span className="sr-only">Loading blog articles…</span>
      <div className="animate-pulse">
        <div className="mb-8 h-3 w-36 rounded-full bg-gray-200 dark:bg-neutral-800" />
        <div className="h-10 w-3/4 max-w-xl rounded-lg bg-gray-200 dark:bg-neutral-800" />
        <div className="mt-4 h-4 w-full max-w-2xl rounded bg-gray-200 dark:bg-neutral-800" />
        <div className="mt-2 h-4 w-2/3 max-w-xl rounded bg-gray-200 dark:bg-neutral-800" />

        <section className="mt-10 grid overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 md:grid-cols-[1fr_1fr]">
          <div className="min-h-64 bg-gray-200 dark:bg-neutral-800 sm:min-h-80" />
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <div className="h-3 w-28 rounded bg-gray-200 dark:bg-neutral-800" />
            <div className="mt-5 h-8 w-full rounded bg-gray-200 dark:bg-neutral-800" />
            <div className="mt-2 h-8 w-4/5 rounded bg-gray-200 dark:bg-neutral-800" />
            <div className="mt-5 h-4 w-full rounded bg-gray-200 dark:bg-neutral-800" />
            <div className="mt-2 h-4 w-5/6 rounded bg-gray-200 dark:bg-neutral-800" />
            <div className="mt-7 flex gap-2">
              <div className="h-7 w-24 rounded-full bg-gray-200 dark:bg-neutral-800" />
              <div className="h-7 w-32 rounded-full bg-gray-200 dark:bg-neutral-800" />
            </div>
            <div className="mt-8 h-10 w-36 rounded-full bg-gray-200 dark:bg-neutral-800" />
          </div>
        </section>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[0, 1].map((item) => (
            <div key={item} className="h-36 rounded-2xl border border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-900" />
          ))}
        </div>
      </div>
    </main>
  )
}
