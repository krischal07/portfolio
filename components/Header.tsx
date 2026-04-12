'use client'

import { useState } from 'react'
import { FaXTwitter, FaLinkedin, FaGithub, FaYoutube, FaInstagram, FaPinterest } from 'react-icons/fa6'
import { SiSpotify, SiMedium } from 'react-icons/si'
import { MdEmail } from 'react-icons/md'
import { IoCopyOutline, IoCheckmarkOutline } from 'react-icons/io5'

const EMAIL = 'krischal.shrestha9849@gmail.com'

const Header = () => {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="flex flex-col gap-4 py-6">
      {/* Row 1: Avatar + name + subtitle */}
      <div className="flex items-center gap-4">
        {/* Placeholder avatar */}
        <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center shrink-0 overflow-hidden">
          {/* <span className="text-2xl font-bold text-blue-600 select-none">KS</span> */}
          <img src="/profile/pp.png" alt="" />
        </div>

        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Krischal Shrestha</h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400 flex items-center gap-1.5 flex-wrap">
            <span>Engineer</span>
            <span>·</span>
            <span>Developer</span>
            <span>·</span>
            <span>{EMAIL}</span>
            <button
              onClick={copyEmail}
              aria-label="Copy email address"
              className="text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              {copied ? <IoCheckmarkOutline className="text-green-500" /> : <IoCopyOutline />}
            </button>
          </p>
        </div>
      </div>

      {/* Row 2: Bio */}
      <p className="text-sm text-gray-600 dark:text-neutral-400">
        Love to build cool stuff, content creator &amp; developer.
      </p>

      {/* Row 3: Spotify last played */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
        <SiSpotify className="text-green-500 text-base shrink-0" />
        <span>
          <span className="font-medium text-gray-700 dark:text-gray-300">Last played</span>
          {' — '}
          <span>Song Title · Artist Name</span>
        </span>
      </div>

      {/* Row 4: Social icons */}
      <div className="flex items-center gap-3 text-gray-400 dark:text-neutral-500">
        <a href="#" aria-label="X / Twitter" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <FaXTwitter className="text-lg" />
        </a>
        <a href="#" aria-label="LinkedIn" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <FaLinkedin className="text-lg" />
        </a>
        <a href="#" aria-label="GitHub" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <FaGithub className="text-lg" />
        </a>
        <a href="#" aria-label="YouTube" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <FaYoutube className="text-lg" />
        </a>
        <a href="#" aria-label="Instagram" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <FaInstagram className="text-lg" />
        </a>
        <a href="#" aria-label="Pinterest" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <FaPinterest className="text-lg" />
        </a>
        <a href="#" aria-label="Medium" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <SiMedium className="text-lg" />
        </a>
        <a href={`mailto:${EMAIL}`} aria-label="Email" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <MdEmail className="text-lg" />
        </a>
      </div>
    </header>
  )
}

export default Header
