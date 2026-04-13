export default function BlogListSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-28 rounded-lg bg-gray-200 dark:bg-neutral-800" />
        <div className="h-9 w-24 rounded-lg bg-gray-200 dark:bg-neutral-800" />
      </div>

      {/* Post list */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl flex items-center justify-between"
          >
            <div className="flex-1 min-w-0">
              <div className="h-4 w-52 rounded bg-gray-200 dark:bg-neutral-800" />
              <div className="mt-1.5 h-3 w-36 rounded bg-gray-200 dark:bg-neutral-800" />
            </div>
            <div className="ml-4 h-4 w-8 rounded bg-gray-200 dark:bg-neutral-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
