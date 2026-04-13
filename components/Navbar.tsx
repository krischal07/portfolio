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
      <div className="mx-auto md:max-w-3xl w-full px-4 h-12 flex items-center justify-between">
        {/* Left: nav links */}
        <ul className="flex items-center gap-6">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
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
        <div className="flex items-center gap-3">
          {/* Search shortcut pill */}
          <button
            aria-label="Search"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-neutral-600 transition-colors text-sm"
          >
            <IoSearchOutline className="text-base" />
            <span className="text-xs">⌘</span>
            <span className="text-xs font-medium">K</span>
          </button>

          {/* Light bulb toggle */}
          <LightBulbToggle />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
