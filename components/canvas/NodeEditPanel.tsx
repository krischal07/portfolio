'use client'

import { useEffect, useState } from 'react'
import { IoCloseOutline, IoTrashOutline } from 'react-icons/io5'
import IconSelector from './IconSelector'
import TechStackSelector from './TechStackSelector'
import type { RFNodeData } from '@/lib/canvas-types'

interface NodeEditPanelProps {
  node: RFNodeData | null
  onUpdate: (updated: RFNodeData) => void
  onDelete: () => void
  onClose: () => void
}

export default function NodeEditPanel({ node, onUpdate, onDelete, onClose }: NodeEditPanelProps) {
  const [form, setForm] = useState<RFNodeData | null>(null)

  // Sync form state when selected node changes
  useEffect(() => {
    setForm(node ? { ...node } : null)
  }, [node?.id])

  function patch<K extends keyof RFNodeData>(key: K, value: RFNodeData[K]) {
    if (!form) return
    const updated = { ...form, [key]: value }
    setForm(updated)
    onUpdate(updated)
  }

  const visible = !!form

  return (
    <div
      className={[
        'absolute top-0 right-0 h-full w-72 z-20 bg-white dark:bg-neutral-950 border-l border-gray-200 dark:border-neutral-800 shadow-xl flex flex-col transition-transform duration-200',
        visible ? 'translate-x-0' : 'translate-x-full',
      ].join(' ')}
    >
      {form && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-neutral-800 shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Edit Node</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              <IoCloseOutline size={18} />
            </button>
          </div>

          {/* Scrollable form body */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {/* Node type */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                Type
              </label>
              <div className="flex gap-2">
                {(['project', 'milestone'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => patch('nodeType', t)}
                    className={[
                      'flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border',
                      form.nodeType === t
                        ? t === 'milestone'
                          ? 'bg-teal-500 text-white border-transparent'
                          : 'bg-purple-500 text-white border-transparent'
                        : 'bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 border-gray-200 dark:border-neutral-700',
                    ].join(' ')}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => patch('title', e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="Node title"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => patch('category', e.target.value.toUpperCase())}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 uppercase tracking-wider"
                placeholder="PROJECT"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => patch('description', e.target.value)}
                rows={3}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                placeholder="Short description..."
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                Icon
              </label>
              <IconSelector
                value={form.iconName}
                onChange={(name) => patch('iconName', name)}
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                  Icon Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.iconColor}
                    onChange={(e) => patch('iconColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200 dark:border-neutral-700"
                  />
                  <span className="text-xs text-gray-500 dark:text-neutral-400 font-mono">
                    {form.iconColor}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                  BG Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.iconBgColor}
                    onChange={(e) => patch('iconBgColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200 dark:border-neutral-700"
                  />
                  <span className="text-xs text-gray-500 dark:text-neutral-400 font-mono">
                    {form.iconBgColor}
                  </span>
                </div>
              </div>
            </div>

            {/* Tech stack */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                Tech Stack
              </label>
              <TechStackSelector
                value={form.techStack}
                onChange={(stack) => patch('techStack', stack)}
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                Date
              </label>
              <input
                type="text"
                value={form.date ?? ''}
                onChange={(e) => patch('date', e.target.value || null)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="Jan 2024"
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={form.githubUrl ?? ''}
                onChange={(e) => patch('githubUrl', e.target.value || null)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="https://github.com/..."
              />
            </div>

            {/* Live URL */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                Live URL
              </label>
              <input
                type="url"
                value={form.liveUrl ?? ''}
                onChange={(e) => patch('liveUrl', e.target.value || null)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Delete button */}
          <div className="p-4 border-t border-gray-100 dark:border-neutral-800 shrink-0">
            <button
              type="button"
              onClick={onDelete}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-red-500 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <IoTrashOutline size={14} />
              Delete Node
            </button>
          </div>
        </>
      )}
    </div>
  )
}
