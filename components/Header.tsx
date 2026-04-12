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
          <img src="/profile/pp_light.png" alt="Krischal Shrestha profile" className="block dark:hidden" />
          <img src="/profile/pp_dark.png" alt="Krischal Shrestha profile" className="hidden dark:block" />
        </div>

        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Krischal Shrestha</h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400 flex items-center gap-1.5 flex-wrap">

            <span className='font-medium italic'>
                
                Design-minded developer building scalable systems.
                
                </span>
          
           
          </p>
        </div>
      </div>

      {/* Row 2: Bio */}
      <p className="text-sm text-gray-600 dark:text-neutral-400">
      <p>
I’m a <em>software engineer</em> mostly messing with <strong>AI</strong> and code, breaking things and then acting surprised when they break. Currently building <strong>Samparka</strong> and <strong>Upasthit</strong> trying to make products that actually work, not just look good in demos.
</p>
<br />
<p>
I also run <strong>Rocket Space</strong>, where I design fast, <em>minimal</em> websites… because nothing screams bad engineering like a slow “modern” site.
</p>
<br />
<p>
Ship, monitor, iterate, scale. <strong>everyday</strong>.
</p>
      </p>

 

   
    </header>
  )
}

export default Header
