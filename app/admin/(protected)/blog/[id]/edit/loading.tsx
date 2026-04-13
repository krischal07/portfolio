export default function EditBlogPostSkeleton() {
  return (
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="h-7 w-24 rounded-lg bg-gray-200 dark:bg-neutral-800 mb-6" />

      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-10 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        {/* Slug */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-10 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        {/* Excerpt */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-16 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        {/* Content textarea */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-16 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-52 w-full rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-12 rounded bg-gray-200 dark:bg-neutral-800" />
          <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
        {/* Buttons — Save, Cancel, Delete (right-aligned) */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-9 w-28 rounded-lg bg-gray-200 dark:bg-neutral-800" />
          <div className="h-9 w-20 rounded-lg bg-gray-200 dark:bg-neutral-800" />
          <div className="ml-auto h-9 w-20 rounded-lg bg-gray-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  )
}
