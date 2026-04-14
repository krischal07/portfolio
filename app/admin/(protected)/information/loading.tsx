import InformationTabSkeleton from './InformationTabSkeleton'

export default function LoadingInformationPage() {
  return (
    <div className="max-w-screen-xl">
      <div className="mb-8">
        <div className="h-8 w-40 animate-pulse rounded-md bg-gray-100 dark:bg-neutral-900" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded-md bg-gray-100 dark:bg-neutral-900" />
      </div>

      <div className="mb-8 inline-flex rounded-lg border border-gray-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="h-8 w-16 animate-pulse rounded-md bg-gray-100 dark:bg-neutral-800" />
        <div className="ml-1 h-8 w-16 animate-pulse rounded-md bg-gray-100 dark:bg-neutral-800" />
        <div className="ml-1 h-8 w-16 animate-pulse rounded-md bg-gray-100 dark:bg-neutral-800" />
        <div className="ml-1 h-8 w-20 animate-pulse rounded-md bg-gray-100 dark:bg-neutral-800" />
      </div>

      <InformationTabSkeleton />
    </div>
  )
}
