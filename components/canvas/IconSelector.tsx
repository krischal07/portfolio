'use client'

import { IoBulbOutline } from 'react-icons/io5'
import { NODE_ICON_MAP } from '@/lib/canvas-icons'

interface IconSelectorProps {
  value: string
  onChange: (iconName: string) => void
}

export default function IconSelector({ value, onChange }: IconSelectorProps) {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {Object.entries(NODE_ICON_MAP).map(([name, Icon]) => (
        <button
          key={name}
          type="button"
          title={name}
          onClick={() => onChange(name)}
          className={[
            'w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all',
            value === name
              ? 'bg-blue-500 text-white ring-2 ring-blue-400/40'
              : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-neutral-700',
          ].join(' ')}
        >
          <Icon />
        </button>
      ))}
    </div>
  )
}
