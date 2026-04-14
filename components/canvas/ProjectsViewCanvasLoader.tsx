'use client'

import dynamic from 'next/dynamic'
import type { RFNode, RFEdge } from './ProjectCanvas'

const ProjectsViewCanvas = dynamic(
  () => import('./ProjectsViewCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[720px] rounded-2xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900">
        <div className="w-5 h-5 border-2 border-gray-300 dark:border-neutral-600 border-t-blue-500 rounded-full animate-spin" />
      </div>
    ),
  }
)

interface Props {
  nodes: RFNode[]
  edges: RFEdge[]
}

export default function  ProjectsViewCanvasLoader({ nodes, edges }: Props) {
  return <ProjectsViewCanvas nodes={nodes} edges={edges} />
}
