'use client'

import { useState } from 'react'
import {
  IoAdd,
  IoBulbOutline,
  IoCallOutline,
  IoCodeSlashOutline,
  IoLinkOutline,
  IoLocationOutline,
  IoMailOutline,
  IoMaleOutline,
  IoTimeOutline,
  IoTrashOutline,
} from 'react-icons/io5'
import type { IconType } from 'react-icons'
import type { SubInfoItem } from '@/lib/sub-info'

type SubInfoFormValues = {
  tzOffset: number
  items: SubInfoItem[]
  updatedAt: string
}

const ICON_OPTIONS: Array<{ key: string; label: string; icon: IconType }> = [
  { key: 'code', label: 'Code', icon: IoCodeSlashOutline },
  { key: 'bulb', label: 'Bulb', icon: IoBulbOutline },
  { key: 'location', label: 'Location', icon: IoLocationOutline },
  { key: 'time', label: 'Time', icon: IoTimeOutline },
  { key: 'phone', label: 'Phone', icon: IoCallOutline },
  { key: 'email', label: 'Email', icon: IoMailOutline },
  { key: 'link', label: 'Link', icon: IoLinkOutline },
  { key: 'gender', label: 'Gender', icon: IoMaleOutline },
]

function iconFor(key: string) {
  return ICON_OPTIONS.find((opt) => opt.key === key)?.icon ?? IoCodeSlashOutline
}

function createEmptyItem(): SubInfoItem {
  return {
    icon: 'code',
    label: '',
    highlight: '',
    fullWidth: false,
  }
}

export default function SubInfoForm({ initialValues }: { initialValues: SubInfoFormValues }) {
  const [values, setValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function updateItem(index: number, patch: Partial<SubInfoItem>) {
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const payload = {
      tzOffset: values.tzOffset,
      items: values.items.map((item) => ({
        icon: item.icon,
        label: item.label?.trim() ? item.label.trim() : null,
        highlight: item.highlight?.trim() ? item.highlight.trim() : null,
        fullWidth: item.fullWidth,
      })),
    }

    const res = await fetch('/api/information/sub-info', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const body = await res.json()

    if (!res.ok) {
      setError(body.error ?? 'Failed to save sub info')
      setLoading(false)
      return
    }

    setValues((prev) => ({ ...prev, updatedAt: body.updatedAt }))
    setSuccess('Saved successfully')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Sub Info Items</p>
          <button type="button" onClick={addItem} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"><IoAdd /> Add Item</button>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 md:max-w-[260px]">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-gray-600 dark:text-neutral-300">Timezone Offset</span>
            <input
              type="number"
              step="0.25"
              value={values.tzOffset}
              onChange={(e) => setValues((prev) => ({ ...prev, tzOffset: Number(e.target.value) }))}
              className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-neutral-700 dark:text-white dark:focus:border-neutral-500"
            />
          </label>
        </div>

        <div className="space-y-3">
          {values.items.map((item, index) => {
            const Icon = iconFor(item.icon)
            return (
              <div key={index} className="rounded-lg border border-gray-200 p-3 dark:border-neutral-700">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[72px_1fr_1fr_auto]">
                  <div className="flex items-end">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      <Icon size={16} />
                    </div>
                  </div>

                  <label className="flex flex-col gap-1 text-xs">
                    <span className="text-gray-500 dark:text-neutral-400">Label</span>
                    <input value={item.label ?? ''} onChange={(e) => updateItem(index, { label: e.target.value })} className="rounded-md border border-gray-200 bg-transparent px-2.5 py-2 text-sm dark:border-neutral-700" />
                  </label>

                  <label className="flex flex-col gap-1 text-xs">
                    <span className="text-gray-500 dark:text-neutral-400">Highlight</span>
                    <input value={item.highlight ?? ''} onChange={(e) => updateItem(index, { highlight: e.target.value })} className="rounded-md border border-gray-200 bg-transparent px-2.5 py-2 text-sm dark:border-neutral-700" />
                  </label>

                  <div className="flex items-end justify-end">
                    <button type="button" onClick={() => removeItem(index)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-2 text-xs text-red-500 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/20"><IoTrashOutline /> Remove</button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {ICON_OPTIONS.map((opt) => {
                    const OptIcon = opt.icon
                    const active = item.icon === opt.key
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => updateItem(index, { icon: opt.key })}
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs ${
                          active
                            ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <OptIcon size={12} />
                        {opt.label}
                      </button>
                    )
                  })}

                  <label className="ml-auto inline-flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
                    <input type="checkbox" checked={item.fullWidth} onChange={(e) => updateItem(index, { fullWidth: e.target.checked })} />
                    Full width
                  </label>
                </div>
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
          {loading ? 'Saving...' : 'Save Sub Info'}
        </button>
        <span className="text-xs text-gray-400 dark:text-neutral-500">Last updated: {new Date(values.updatedAt).toLocaleString()}</span>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
      </div>
    </form>
  )
}
