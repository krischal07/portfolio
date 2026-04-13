export default function DashboardSkeleton() {
  return (
    <div className="max-w-screen-xl animate-pulse">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-7 w-36 rounded-lg bg-gray-200 dark:bg-neutral-800" />
          <div className="mt-1.5 h-4 w-52 rounded bg-gray-200 dark:bg-neutral-800" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 rounded-lg bg-gray-200 dark:bg-neutral-800" />
          <div className="h-8 w-28 rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-neutral-800" />
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-neutral-800" />
            </div>
            <div className="h-9 w-14 rounded bg-gray-200 dark:bg-neutral-800" />
            <div className="mt-1.5 h-3 w-28 rounded bg-gray-200 dark:bg-neutral-800" />
          </div>
        ))}
      </div>

      {/* Recent content panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden"
          >
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-200 dark:bg-neutral-800" />
                <div className="h-4 w-36 rounded bg-gray-200 dark:bg-neutral-800" />
              </div>
              <div className="h-3 w-14 rounded bg-gray-200 dark:bg-neutral-800" />
            </div>
            {/* Panel rows */}
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <div className="h-4 w-44 rounded bg-gray-200 dark:bg-neutral-800" />
                    <div className="mt-1.5 h-3 w-28 rounded bg-gray-200 dark:bg-neutral-800" />
                  </div>
                  <div className="ml-3 h-5 w-16 rounded-full bg-gray-200 dark:bg-neutral-800" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
