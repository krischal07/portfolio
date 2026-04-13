export default function BlogLoading() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl items-center justify-center px-4 py-8 sm:py-12">
      <section className="w-full animate-pulse rounded-3xl border border-gray-200/80 bg-gradient-to-b from-white to-gray-50 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-950 dark:to-black sm:p-10">
        <div className="mx-auto h-[220px] w-full max-w-[320px] rounded-2xl bg-gray-200 dark:bg-neutral-800 sm:h-[280px]" />
        <div className="mx-auto mt-4 h-3 w-32 rounded bg-gray-200 dark:bg-neutral-800" />
        <div className="mx-auto mt-4 h-9 w-64 rounded bg-gray-200 dark:bg-neutral-800" />
        <div className="mx-auto mt-4 h-4 w-full max-w-lg rounded bg-gray-200 dark:bg-neutral-800" />
        <div className="mx-auto mt-2 h-4 w-5/6 max-w-md rounded bg-gray-200 dark:bg-neutral-800" />
        <div className="mx-auto mt-8 h-10 w-32 rounded-xl bg-gray-200 dark:bg-neutral-800" />
      </section>
    </main>
  )
}
