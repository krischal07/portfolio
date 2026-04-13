export default function HomeLoading() {
  return (
    <main className="mx-auto md:max-w-3xl w-full px-4 py-8 animate-pulse">
      <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-neutral-800" />
      <div className="mt-4 h-10 w-64 rounded-xl bg-gray-200 dark:bg-neutral-800" />
      <div className="mt-3 h-4 w-full max-w-2xl rounded bg-gray-200 dark:bg-neutral-800" />
      <div className="mt-2 h-4 w-5/6 max-w-xl rounded bg-gray-200 dark:bg-neutral-800" />

      <div className="mt-8 grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded-lg bg-gray-200 dark:bg-neutral-800" />
        ))}
      </div>

      <div className="mt-10">
        <div className="h-8 w-44 rounded-lg bg-gray-200 dark:bg-neutral-800" />
        <div className="mt-4 h-28 rounded-2xl bg-gray-200 dark:bg-neutral-800" />
      </div>

      <div className="mt-10 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-200 dark:bg-neutral-800" />
        ))}
      </div>
    </main>
  )
}
