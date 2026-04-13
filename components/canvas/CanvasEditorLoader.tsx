'use client'

import dynamic from 'next/dynamic'
import type { RFNode, RFEdge } from './ProjectCanvas'

const ProjectCanvas = dynamic(
  () => import('./ProjectCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-neutral-500">
          <div className="w-6 h-6 border-2 border-gray-300 dark:border-neutral-600 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-xs">Loading canvas...</span>
        </div>
      </div>
    ),
  }
)

interface Props {
  initialNodes: RFNode[]
  initialEdges: RFEdge[]
}

export default function CanvasEditorLoader({ initialNodes, initialEdges }: Props) {
  return <ProjectCanvas initialNodes={initialNodes} initialEdges={initialEdges} />
}
