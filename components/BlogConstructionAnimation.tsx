'use client'

import Lottie from 'lottie-react'
import animationData from '@/public/lottie/under-construction.json'

export default function BlogConstructionAnimation() {
  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      className="h-full w-full absolute right-5 md:right-10"
    />
  )
}
