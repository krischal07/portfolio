'use client'

import { IoAddOutline, IoSaveOutline, IoCheckmarkOutline, IoAlertCircleOutline } from 'react-icons/io5'

interface CanvasToolbarProps {
  onAddNode: () => void
  onSave: () => void
  saving: boolean
  saved: boolean
  saveError: string | null
}

export default function CanvasToolbar({ onAddNode, onSave, saving, saved, saveError }: CanvasToolbarProps) {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2 shadow-sm">
      <button
        type="button"
        onClick={onAddNode}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
      >
        <IoAddOutline size={14} />
        Add Node
      </button>

      <div className="w-px h-4 bg-gray-200 dark:bg-neutral-700" />

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className={[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
          saving
            ? 'bg-gray-100 dark:bg-neutral-800 text-gray-400 cursor-not-allowed'
            : saved
            ? 'bg-green-500 text-white'
            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100',
        ].join(' ')}
      >
        {saving ? (
          <>
            <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : saved ? (
          <>
            <IoCheckmarkOutline size={14} />
            Saved
          </>
        ) : (
          <>
            <IoSaveOutline size={14} />
            Save
          </>
        )}
      </button>

      {saveError && (
        <span className="flex items-center gap-1 text-[10px] text-red-500">
          <IoAlertCircleOutline size={12} />
          {saveError}
        </span>
      )}

      <div className="w-px h-4 bg-gray-200 dark:bg-neutral-700" />

      <span className="text-[10px] text-gray-400 dark:text-neutral-500">
        Click node to edit · Drag to reposition · Connect handles to link
      </span>
    </div>
  )
}
