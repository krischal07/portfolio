export default function ProjectsLoading() {
  return (
    <main className="mx-auto md:max-w-3xl w-full px-4 py-8 animate-pulse">
      <div className="h-8 w-36 rounded-lg bg-gray-200 dark:bg-neutral-800" />

      <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-900 md:hidden">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-200 dark:bg-neutral-800" />
          ))}
        </div>
      </div>

      <div className="mt-8 hidden rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-neutral-700 dark:bg-neutral-900 md:block">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-gray-200 dark:bg-neutral-800" />
          ))}
        </div>
      </div>
    </main>
  )
}
