'use client'

import { TECH_ICON_MAP, TECH_COLORS, TECH_LABELS } from '@/lib/canvas-icons'

interface TechStackSelectorProps {
  value: string[]
  onChange: (techStack: string[]) => void
}

export default function TechStackSelector({ value, onChange }: TechStackSelectorProps) {
  function toggle(tech: string) {
    if (value.includes(tech)) {
      onChange(value.filter((t) => t !== tech))
    } else {
      onChange([...value, tech])
    }
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {Object.entries(TECH_ICON_MAP).map(([key, Icon]) => {
        const active = value.includes(key)
        return (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className={[
              'flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all border',
              active
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                : 'bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 border-gray-200 dark:border-neutral-700 hover:border-gray-300',
            ].join(' ')}
          >
            <Icon
              className="text-xs shrink-0"
              style={{ color: active ? undefined : (TECH_COLORS[key] ?? '#888') }}
            />
            <span className="truncate">{TECH_LABELS[key] ?? key}</span>
          </button>
        )
      })}
    </div>
  )
}
