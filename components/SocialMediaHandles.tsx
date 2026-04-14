import { FiArrowUpRight } from 'react-icons/fi'
import { FaXTwitter, FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa6'
import { SiDailydotdev } from 'react-icons/si'
import type { IconType } from 'react-icons'
import { BsInstagram } from 'react-icons/bs'
import { getSocialLinksSafe } from '@/lib/social-links-db'

// ── Icon map ───────────────────────────────────────────────────
const ICON_MAP: Record<string, IconType> = {
  x:        FaXTwitter,
  github:   FaGithub,
  linkedin: FaLinkedin,
  dailydev: SiDailydotdev,
  instagram:  BsInstagram,
  youtube:  FaYoutube,
}

const SocialMediaHandles = async () => {
  const socialLinks = await getSocialLinksSafe()

  return (
    <div className="border-t border-gray-200 dark:border-neutral-800">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
        {socialLinks.items.map((social) => {
          const Icon = ICON_MAP[social.icon] ?? FaXTwitter
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 transition-colors hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ${social.bg}`}>
                  <Icon className="text-xl text-white" />
                </div>
                <span className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{social.name}</span>
              </div>
              <FiArrowUpRight className="shrink-0 text-base text-gray-400 dark:text-neutral-500" />
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default SocialMediaHandles
