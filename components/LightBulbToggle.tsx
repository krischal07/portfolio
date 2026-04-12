'use client'

import { useState, useCallback, useEffect } from 'react'
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5'

type CordState = 'idle' | 'pull' | 'swing'

const cordAnimationClass: Record<CordState, string> = {
  idle:  '',
  pull:  '[animation:cord-pull_0.6s_ease-out_forwards]',
  swing: '[animation:cord-swing_1.2s_ease-out_forwards]',
}

export default function LightBulbToggle() {
  const [cordState, setCordState] = useState<CordState>('idle')
  const [isDark, setIsDark] = useState(false)
  const [sparkTick, setSparkTick] = useState(0)

  // Sync isDark with html class on mount
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  // Scroll → swing
  useEffect(() => {
    const isMobileLike =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      navigator.maxTouchPoints > 0

    if (isMobileLike) return

    let lastY = window.scrollY
    let lastTriggerAt = 0

    const handleScroll = () => {
      const now = performance.now()
      const deltaY = Math.abs(window.scrollY - lastY)
      lastY = window.scrollY

      if (deltaY < 6 || now - lastTriggerAt < 220) return

      lastTriggerAt = now
      setCordState(prev => (prev === 'pull' || prev === 'swing') ? prev : 'swing')
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = useCallback(() => {
    setCordState('pull')
    setSparkTick(tick => tick + 1)

    const switchTheme = () => {
      const nowDark = document.documentElement.classList.toggle('dark')
      localStorage.setItem('theme', nowDark ? 'dark' : 'light')
      setIsDark(nowDark)
    }

    if (typeof (document as any).startViewTransition === 'function') {
      ;(document as any).startViewTransition(switchTheme)
    } else {
      switchTheme()
    }
  }, [])

  const handleAnimationEnd = useCallback(() => {
    setCordState(prev => (prev === 'idle' ? prev : 'idle'))
  }, [])

  return (
    <button
      aria-label="Toggle theme"
      onClick={handleClick}
      className="relative flex items-center justify-center cursor-pointer"
    >
      {/* Card */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center">
        {isDark
          ? <IoMoonOutline className="size-7 text-gray-400" />
          : <IoSunnyOutline className="size-7 text-gray-500" />
        }
      </div>

      {/* Connector + cord + bead — hangs below card */}
      <div
        onAnimationEnd={handleAnimationEnd}
        className={`absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center origin-top ${cordAnimationClass[cordState]}`}
      >
        {/* Double-line connector (ceiling mount) */}
        <div className="flex flex-col gap-0.75 mb-0.5">
          <div className="w-1.5 h-px bg-slate-500 rounded-full" />
          <div className="w-1.5 h-px bg-slate-500 rounded-full" />
        </div>

        {/* Cord — SVG wavy path to look like fabric pull cord */}
        <svg width="6" height="56" viewBox="0 0 6 56" fill="none" className="overflow-visible">
          <path
            d="M3,0 C5,10 1,20 3,30 C5,40 1,50 3,56"
            stroke="#64748b"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full bg-slate-600" />
          {sparkTick > 0 && (
            <div key={sparkTick} aria-hidden className="cord-spark pointer-events-none absolute top-1/2 left-1/2">
              <span className="cord-ray" />
              <span className="cord-ray" />
              <span className="cord-ray" />
              <span className="cord-ray" />
              <span className="cord-ray" />
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
