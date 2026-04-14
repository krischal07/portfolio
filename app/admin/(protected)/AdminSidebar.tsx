'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiGrid, FiFileText, FiFolder, FiLogOut, FiLayers, FiInfo } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth-client'

type Props = {
  userName: string
  userEmail: string
}

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: FiGrid, exact: true },
]

const contentItems = [
  { label: 'Blog Posts', href: '/admin/blog', icon: FiFileText },
  { label: 'Projects', href: '/admin/projects', icon: FiFolder, exclude: '/admin/projects/canvas' },
  { label: 'Canvas Editor', href: '/admin/projects/canvas', icon: FiLayers, exact: true },
  { label: 'Information', href: '/admin/information', icon: FiInfo, exact: true },
]

export default function AdminSidebar({ userName, userEmail }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  function isActive(href: string, exact?: boolean, exclude?: string) {
    if (exact) return pathname === href
    if (exclude && pathname.startsWith(exclude)) return false
    return pathname.startsWith(href)
  }

  async function handleSignOut() {
    await signOut()
    router.push('/admin/login')
  }

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : userEmail[0].toUpperCase()

  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-screen sticky top-0 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
            <span className="text-[11px] font-bold text-white dark:text-gray-900 tracking-tight">K</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">krischal.dev</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          )
        })}

        <div className="mt-4 mb-1 px-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
            Content
          </p>
        </div>

        {contentItems.map((item) => {
          const active = isActive(item.href, (item as { exact?: boolean }).exact, (item as { exclude?: string }).exclude)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white font-medium'
                  : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + Sign Out */}
      <div className="px-3 pb-4 pt-2 border-t border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-semibold text-gray-600 dark:text-neutral-300">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{userName || 'Admin'}</p>
            <p className="text-[10px] text-gray-400 dark:text-neutral-500 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-1 w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <FiLogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
