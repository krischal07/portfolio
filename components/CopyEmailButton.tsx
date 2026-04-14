'use client'

import { useState } from 'react'
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5'

export default function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copyEmail}
      className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-white"
      aria-label="Copy email address"
    >
      {copied ? <IoCheckmarkOutline size={14} /> : <IoCopyOutline size={14} />}
      {copied ? 'Copied' : 'Copy Email'}
    </button>
  )
}
