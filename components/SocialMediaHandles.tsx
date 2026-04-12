import { FiArrowUpRight } from 'react-icons/fi'
import { FaXTwitter, FaGithub, FaLinkedin, FaDiscord, FaYoutube } from 'react-icons/fa6'
import { SiDailydotdev } from 'react-icons/si'
import type { IconType } from 'react-icons'
import socialsData from '@/data/socials.json'

// ── Icon map ───────────────────────────────────────────────────
const ICON_MAP: Record<string, IconType> = {
  x:        FaXTwitter,
  github:   FaGithub,
  linkedin: FaLinkedin,
  dailydev: SiDailydotdev,
  discord:  FaDiscord,
  youtube:  FaYoutube,
}

const COLS = 3

const SocialMediaHandles = () => {
  const rows: (typeof socialsData.socials)[] = []
  for (let i = 0; i < socialsData.socials.length; i += COLS) {
    rows.push(socialsData.socials.slice(i, i + COLS))
  }

  return (
    <div className="border-t border-gray-200 dark:border-neutral-800">
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={`flex ${rowIdx < rows.length - 1 ? 'border-b border-gray-200 dark:border-neutral-800' : ''}`}
        >
          {row.map((social, i) => {
            const Icon = ICON_MAP[social.icon] ?? FaXTwitter
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors ${
                  i < row.length - 1 ? 'border-r border-gray-200 dark:border-neutral-800' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${social.bg}`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{social.name}</span>
                </div>
                <FiArrowUpRight className="text-gray-400 dark:text-neutral-500 text-base" />
              </a>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default SocialMediaHandles
