'use client'

import { useEffect, useState } from 'react'
import {
  IoCodeSlashOutline,
  IoBulbOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoCallOutline,
  IoMailOutline,
  IoLinkOutline,
  IoMaleOutline,
} from 'react-icons/io5'
import type { IconType } from 'react-icons'
import { type SubInfoItem } from '@/lib/sub-info'

// ── Icon map ───────────────────────────────────────────────────
const ICON_MAP: Record<string, IconType> = {
  code:     IoCodeSlashOutline,
  bulb:     IoBulbOutline,
  location: IoLocationOutline,
  time:     IoTimeOutline,
  phone:    IoCallOutline,
  email:    IoMailOutline,
  link:     IoLinkOutline,
  gender:   IoMaleOutline,
}

// ── Clock hook ─────────────────────────────────────────────────
function useLocalTime(tzOffset: number) {
  const [display, setDisplay] = useState({ time: '', offset: '' })

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const userMs = now.getTime() + (tzOffset * 60 + now.getTimezoneOffset()) * 60_000
      const userDate = new Date(userMs)
      const h = String(userDate.getHours()).padStart(2, '0')
      const m = String(userDate.getMinutes()).padStart(2, '0')

      const viewerOffset = -now.getTimezoneOffset() / 60
      const diff = tzOffset - viewerOffset
      const abs = Math.abs(diff)
      const label = diff === 0 ? 'same time' : diff > 0 ? `${abs}h ahead` : `${abs}h behind`

      setDisplay({ time: `${h}:${m}`, offset: label })
    }
    update()
    const id = setInterval(update, 30_000)
    return () => clearInterval(id)
  }, [tzOffset])

  return display
}

// ── Icon box ───────────────────────────────────────────────────
function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-8 h-8 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex items-center justify-center shrink-0 text-gray-500 dark:text-neutral-400 text-sm">
      {children}
    </span>
  )
}

// ── Component ──────────────────────────────────────────────────
type SubInfoProps = {
  tzOffset: number
  info: SubInfoItem[]
}

const SubInfo = ({ tzOffset, info }: SubInfoProps) => {
  const { time } = useLocalTime(tzOffset)

  return (
    <section className="flex flex-col gap-6 py-2">
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {info.map((item, index) => {
          const Icon = ICON_MAP[item.icon]
          if (!Icon) return null

          const content =
            item.icon === 'time' ? (
              time ? (
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{time}</span>
                  {/* <span className="text-gray-400 dark:text-neutral-500"> // {offset}</span> */}
                </span>
              ) : null
            ) : (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.label}
                {item.highlight && (
                  <span className="text-sm text-zinc-800 dark:text-gray-200 font-bold"> {item.highlight}</span>
                )}
              </span>
            )

          return (
            <div
              key={`${item.icon}-${index}`}
              className={item.fullWidth ? 'sm:col-span-2' : ''}
            >
              <div className="flex items-center gap-3">
                <IconBox>
                  <Icon />
                </IconBox>
                {content}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default SubInfo
