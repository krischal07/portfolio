'use client'

import { useState } from 'react'
import { FaGithub, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { SiDailydotdev } from 'react-icons/si'
import { BsInstagram } from 'react-icons/bs'
import type { IconType } from 'react-icons'
import { IoAdd, IoArrowUpOutline, IoArrowDownOutline, IoTrashOutline } from 'react-icons/io5'
import type { SocialLinkItem } from '@/lib/social-links'

type SocialLinksFormValues = {
  items: SocialLinkItem[]
  updatedAt: string
}

const ICON_OPTIONS: Array<{ key: string; label: string; icon: IconType; defaultBg: string }> = [
  { key: 'x', label: 'X', icon: FaXTwitter, defaultBg: 'bg-black' },
  { key: 'github', label: 'GitHub', icon: FaGithub, defaultBg: 'bg-gray-900' },
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, defaultBg: 'bg-blue-600' },
  { key: 'dailydev', label: 'daily.dev', icon: SiDailydotdev, defaultBg: 'bg-gray-950' },
  { key: 'instagram', label: 'Instagram', icon: BsInstagram, defaultBg: 'bg-[#ee2a7b]' },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube, defaultBg: 'bg-red-600' },
]

function optionFor(icon: string) {
  return ICON_OPTIONS.find((opt) => opt.key === icon) ?? ICON_OPTIONS[0]
}

function createEmptyItem(): SocialLinkItem {
  const base = ICON_OPTIONS[0]
  return {
    name: base.label,
    icon: base.key,
    bg: base.defaultBg,
    url: '',
  }
}

export default function SocialLinksForm({ initialValues }: { initialValues: SocialLinksFormValues }) {
  const [values, setValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function updateItem(index: number, patch: Partial<SocialLinkItem>) {
    setValues((prev) => {
      const next = [...prev.items]
      next[index] = { ...next[index], ...patch }
      return { ...prev, items: next }
    })
  }

  function addItem() {
    setValues((prev) => ({ ...prev, items: [...prev.items, createEmptyItem()] }))
  }

  function removeItem(index: number) {
    setValues((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }))
  }

  function moveItem(index: number, direction: -1 | 1) {
    setValues((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.items.length) return prev
      const next = [...prev.items]
      const [picked] = next.splice(index, 1)
      next.splice(target, 0, picked)
      return { ...prev, items: next }
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const payload = {
      items: values.items.map((item) => ({
        name: item.name.trim(),
        icon: item.icon.trim(),
        bg: item.bg.trim(),
        url: item.url.trim(),
      })),
    }

    const res = await fetch('/api/information/social-links', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const body = await res.json()

    if (!res.ok) {
      setError(body.error ?? 'Failed to save social links')
      setLoading(false)
      return
    }

    setValues((prev) => ({ ...prev, updatedAt: body.updatedAt }))
    setSuccess('Saved successfully')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Social Profiles</p>
          <button type="button" onClick={addItem} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"><IoAdd /> Add Social</button>
        </div>

        <div className="space-y-3">
          {values.items.map((item, index) => {
            const option = optionFor(item.icon)
            const Icon = option.icon
            return (
              <div key={index} className="rounded-lg border border-gray-200 p-3 dark:border-neutral-700">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[56px_1fr_1fr_1fr_auto]">
                  <div className="flex items-end">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-white ${item.bg}`}>
                      <Icon size={16} />
                    </div>
                  </div>

                  <label className="flex flex-col gap-1 text-xs">
                    <span className="text-gray-500 dark:text-neutral-400">Display Name</span>
                    <input value={item.name} onChange={(e) => updateItem(index, { name: e.target.value })} className="rounded-md border border-gray-200 bg-transparent px-2.5 py-2 text-sm dark:border-neutral-700" />
                  </label>

                  <label className="flex flex-col gap-1 text-xs">
                    <span className="text-gray-500 dark:text-neutral-400">Platform</span>
                    <div className="flex flex-wrap gap-1.5 rounded-md border border-gray-200 p-1 dark:border-neutral-700">
                      {ICON_OPTIONS.map((opt) => {
                        const OptIcon = opt.icon
                        const active = item.icon === opt.key
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => updateItem(index, { icon: opt.key, name: item.name || opt.label, bg: item.bg || opt.defaultBg })}
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
                              active
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
                            }`}
                          >
                            <OptIcon size={12} />
                            {opt.label}
                          </button>
                        )
                      })}
                    </div>
                  </label>

                  <label className="flex flex-col gap-1 text-xs">
                    <span className="text-gray-500 dark:text-neutral-400">Background Class</span>
                    <input value={item.bg} onChange={(e) => updateItem(index, { bg: e.target.value })} className="rounded-md border border-gray-200 bg-transparent px-2.5 py-2 text-sm dark:border-neutral-700" />
                  </label>

                  <div className="flex items-end gap-1 justify-end">
                    <button type="button" onClick={() => moveItem(index, -1)} className="inline-flex rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"><IoArrowUpOutline /></button>
                    <button type="button" onClick={() => moveItem(index, 1)} className="inline-flex rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"><IoArrowDownOutline /></button>
                    <button type="button" onClick={() => removeItem(index)} className="inline-flex rounded-md border border-red-200 p-2 text-red-500 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/20"><IoTrashOutline /></button>
                  </div>
                </div>

                <label className="mt-3 flex flex-col gap-1 text-xs">
                  <span className="text-gray-500 dark:text-neutral-400">Profile URL</span>
                  <input type="url" value={item.url} onChange={(e) => updateItem(index, { url: e.target.value })} className="rounded-md border border-gray-200 bg-transparent px-2.5 py-2 text-sm dark:border-neutral-700" />
                </label>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {loading ? 'Saving...' : 'Save Social Links'}
        </button>
        <span className="text-xs text-gray-400 dark:text-neutral-500">Last updated: {new Date(values.updatedAt).toLocaleString()}</span>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
      </div>
    </form>
  )
}
