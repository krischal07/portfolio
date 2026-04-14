'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
}

const quillFormats = ['bold', 'italic', 'underline', 'list', 'link']

type HeaderInformationFormValues = {
  name: string
  tagline: string
  bioHtml: string
  email: string
  avatarLight: string
  avatarDark: string
  updatedAt: string
}

export default function HeaderInformationForm({ initialValues }: { initialValues: HeaderInformationFormValues }) {
  const [values, setValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/information/header', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name,
        tagline: values.tagline,
        bioHtml: values.bioHtml,
        email: values.email,
        avatarLight: values.avatarLight,
        avatarDark: values.avatarDark,
      }),
    })

    const body = await res.json()

    if (!res.ok) {
      setError(body.error ?? 'Failed to save header information')
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-gray-600 dark:text-neutral-300">Name</span>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-neutral-700 dark:text-white dark:focus:border-neutral-500"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-gray-600 dark:text-neutral-300">Email</span>
            <input
              name="email"
              value={values.email}
              onChange={handleChange}
              required
              type="email"
              className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-neutral-700 dark:text-white dark:focus:border-neutral-500"
            />
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-1.5 text-sm">
          <span className="text-gray-600 dark:text-neutral-300">Tagline</span>
          <input
            name="tagline"
            value={values.tagline}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-neutral-700 dark:text-white dark:focus:border-neutral-500"
          />
        </label>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-gray-600 dark:text-neutral-300">Avatar Light Path</span>
            <input
              name="avatarLight"
              value={values.avatarLight}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-neutral-700 dark:text-white dark:focus:border-neutral-500"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-gray-600 dark:text-neutral-300">Avatar Dark Path</span>
            <input
              name="avatarDark"
              value={values.avatarDark}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-neutral-700 dark:text-white dark:focus:border-neutral-500"
            />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <p className="mb-4 text-sm font-medium text-gray-900 dark:text-white">Bio Content</p>

        <div className="space-y-2 text-sm">
          <p className="text-gray-600 dark:text-neutral-300">
            Use rich text for paragraphs and formatting (bold, italic, underline, links, lists).
          </p>
          <div className="quill-editor overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-700">
            <ReactQuill
              theme="snow"
              value={values.bioHtml}
              onChange={(html) => setValues((prev) => ({ ...prev, bioHtml: html }))}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Write your bio content..."
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {loading ? 'Saving...' : 'Save Header'}
        </button>
        <span className="text-xs text-gray-400 dark:text-neutral-500">
          Last updated: {new Date(values.updatedAt).toLocaleString()}
        </span>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
      </div>
    </form>
  )
}
