'use client'

import { useRef, useState } from 'react'
import { IoCloseOutline, IoTrashOutline, IoImageOutline, IoCloudUploadOutline } from 'react-icons/io5'
import IconSelector from './IconSelector'
import TechStackSelector from './TechStackSelector'
import type { RFNodeData } from '@/lib/canvas-types'

interface NodeEditPanelProps {
  node: RFNodeData | null
  onUpdate: (updated: RFNodeData) => void
  onDelete: () => void
  onClose: () => void
  onDuplicate?: () => void
  onNudge?: (dx: number, dy: number) => void
  onResetStyle?: () => void
}

export default function NodeEditPanel({
  node,
  onUpdate,
  onDelete,
  onClose,
  onDuplicate,
  onNudge,
  onResetStyle,
}: NodeEditPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  function patch<K extends keyof RFNodeData>(key: K, value: RFNodeData[K]) {
    if (!node) return
    const updated = { ...node, [key]: value }
    onUpdate(updated)
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !node) return
    setUploading(true)
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      patch('logoUrl', url)
    } catch {
      setUploadError('Upload failed. Try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const visible = !!node

  return (
    <div
      className={[
        'absolute top-0 right-0 h-full w-72 z-20 bg-white dark:bg-neutral-950 border-l border-gray-200 dark:border-neutral-800 shadow-xl flex flex-col transition-transform duration-200',
        visible ? 'translate-x-0' : 'translate-x-full',
      ].join(' ')}
    >
      {node && (
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
                      node.nodeType === t
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
                value={node.title}
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
                value={node.category}
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
                value={node.description}
                onChange={(e) => patch('description', e.target.value)}
                rows={3}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                placeholder="Short description..."
              />
            </div>

            {/* Icon / Logo */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                Icon
              </label>
              <IconSelector
                value={node.iconName}
                onChange={(name) => patch('iconName', name)}
              />
            </div>

            {/* Custom Logo */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                Custom Logo
                <span className="ml-1.5 normal-case tracking-normal font-normal text-gray-400">
                  (overrides icon)
                </span>
              </label>

              {node.logoUrl ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={node.logoUrl}
                    alt="logo"
                    className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-neutral-700"
                  />
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
                    >
                      <IoCloudUploadOutline size={13} />
                      {uploading ? 'Uploading…' : 'Replace'}
                    </button>
                    <button
                      type="button"
                      onClick={() => patch('logoUrl', null)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Remove logo
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-neutral-700 text-xs font-semibold text-gray-500 dark:text-neutral-400 hover:border-blue-400 hover:text-blue-500 transition-colors disabled:opacity-50"
                >
                  <IoImageOutline size={15} />
                  {uploading ? 'Uploading…' : 'Upload logo image'}
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />

              {uploadError && (
                <p className="mt-1 text-[10px] text-red-500">{uploadError}</p>
              )}
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
                    value={node.iconColor}
                    onChange={(e) => patch('iconColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200 dark:border-neutral-700"
                  />
                  <span className="text-xs text-gray-500 dark:text-neutral-400 font-mono">
                    {node.iconColor}
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
                    value={node.iconBgColor}
                    onChange={(e) => patch('iconBgColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200 dark:border-neutral-700"
                  />
                  <span className="text-xs text-gray-500 dark:text-neutral-400 font-mono">
                    {node.iconBgColor}
                  </span>
                </div>
              </div>
            </div>

            {/* Position */}
            {onNudge && (
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                  Position
                </label>
                <div className="grid grid-cols-3 gap-1.5 w-28">
                  <div />
                  <button
                    type="button"
                    onClick={() => onNudge(0, -20)}
                    className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700"
                  >
                    Up
                  </button>
                  <div />
                  <button
                    type="button"
                    onClick={() => onNudge(-20, 0)}
                    className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700"
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => onNudge(0, 20)}
                    className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => onNudge(20, 0)}
                    className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-700"
                  >
                    Right
                  </button>
                </div>
              </div>
            )}

            {/* Tech stack */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
                Tech Stack
              </label>
              <TechStackSelector
                value={node.techStack}
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
                value={node.date ?? ''}
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
                value={node.githubUrl ?? ''}
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
                value={node.liveUrl ?? ''}
                onChange={(e) => patch('liveUrl', e.target.value || null)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Delete button */}
          <div className="p-4 border-t border-gray-100 dark:border-neutral-800 shrink-0">
            {(onDuplicate || onResetStyle) && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                {onDuplicate && (
                  <button
                    type="button"
                    onClick={onDuplicate}
                    className="w-full py-2 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    Duplicate
                  </button>
                )}
                {onResetStyle && (
                  <button
                    type="button"
                    onClick={onResetStyle}
                    className="w-full py-2 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    Reset Style
                  </button>
                )}
              </div>
            )}
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
