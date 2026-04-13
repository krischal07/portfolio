'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { RFNode, RFEdge } from './ProjectCanvas'
import ProjectsViewCanvasLoader from './ProjectsViewCanvasLoader'

interface MobileProjectsCanvasProps {
  nodes: RFNode[]
  edges: RFEdge[]
  canvasWidth: number
  canvasHeight: number
}

export default function MobileProjectsCanvas({
  nodes,
  edges,
  canvasWidth,
  canvasHeight,
}: MobileProjectsCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0
      setContainerWidth(width)
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scale = useMemo(() => {
    if (!containerWidth) return 1
    return Math.min(1, containerWidth / canvasWidth)
  }, [containerWidth, canvasWidth])

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div style={{ height: canvasHeight * scale }}>
        <div
          style={{
            width: canvasWidth,
            height: canvasHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <ProjectsViewCanvasLoader nodes={nodes} edges={edges} />
        </div>
      </div>
    </div>
  )
}
