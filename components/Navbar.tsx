'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IoSearchOutline } from 'react-icons/io5'
import LightBulbToggle from './LightBulbToggle'

const navLinks = [
  { label: 'Home', href: '/' },
  // { label: 'Work', href: '/work' },
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  // { label: 'Resume', href: '/resume' },
]

const Navbar = () => {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-sm bg-[var(--navbar-bg)] dark:bg-black/80 border-b border-gray-200 dark:border-neutral-800">
      <div className="mx-auto flex h-12 w-full min-w-0 max-w-3xl items-center justify-between px-4">
        {/* Left: nav links */}
        <ul className="flex min-w-0 items-center gap-4 sm:gap-6">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                prefetch
                className={`text-sm transition-colors ${
                  pathname === href
                    ? 'text-gray-900 dark:text-gray-100 font-medium'
                    : 'text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: search shortcut + dark mode toggle */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Search shortcut pill */}
          <button
            aria-label="Search"
            className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500 dark:hover:border-neutral-600 dark:hover:text-gray-300"
          >
            <IoSearchOutline className="text-base" />
            <span className="hidden text-xs sm:inline">⌘</span>
            <span className="hidden text-xs font-medium sm:inline">K</span>
          </button>

          {/* Light bulb toggle */}
          <LightBulbToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
