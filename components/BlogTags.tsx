export default function BlogTags({ tags }: { tags: string[] }) {
  return (
    <ul aria-label="Article topics" className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-neutral-200 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-300"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}
