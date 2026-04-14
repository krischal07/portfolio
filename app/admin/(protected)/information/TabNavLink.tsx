'use client'

import Link from 'next/link'
import { useLinkStatus } from 'next/link'

type TabNavLinkProps = {
  href: string
  label: string
  active: boolean
}

function PendingDot() {
  const { pending } = useLinkStatus()
  if (!pending) return null

  return <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-70" />
}

export default function TabNavLink({ href, label, active }: TabNavLinkProps) {
  return (
    <Link
      href={href}
      prefetch
      scroll={false}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
          : 'text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white'
      }`}
    >
      <PendingDot />
      {label}
    </Link>
  )
}
