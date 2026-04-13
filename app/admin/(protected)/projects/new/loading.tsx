export default function NewProjectSkeleton() {
  return (
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="h-7 w-32 rounded-lg bg-gray-200 dark:bg-neutral-800 mb-6" />

      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-10 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        {/* Description textarea */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-24 w-full rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-16 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        {/* Tech stack */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        {/* GitHub URL */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        {/* Live URL */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-10 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        {/* Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-9 w-32 rounded-lg bg-gray-200 dark:bg-neutral-800" />
          <div className="h-9 w-20 rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  )
}
