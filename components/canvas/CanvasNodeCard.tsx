'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { IoBulbOutline } from 'react-icons/io5'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { NODE_ICON_MAP, TECH_ICON_MAP, TECH_COLORS } from '@/lib/canvas-icons'
import type { RFNodeData } from '@/lib/canvas-types'

export type CanvasNodeCardData = RFNodeData & { editorMode?: boolean }

function CanvasNodeCard({ data, selected }: NodeProps) {
  const nodeData = data as CanvasNodeCardData
  const Icon = NODE_ICON_MAP[nodeData.iconName] ?? IoBulbOutline
  const isEditor = nodeData.editorMode ?? false

  return (
    <div
      className={[
        'w-[220px] bg-white dark:bg-neutral-900 border rounded-2xl shadow-sm p-4 flex flex-col gap-2 transition-all',
        selected
          ? 'border-blue-500 ring-2 ring-blue-400/30'
          : 'border-gray-200 dark:border-neutral-700',
      ].join(' ')}
    >
      {/* Keep handles mounted for exact edge anchoring in view mode */}
      <>
        <Handle
          type="target"
          position={Position.Top}
          className={[
            '!w-3 !h-3 !border-2 !border-white dark:!border-neutral-900',
            isEditor ? '!bg-blue-400' : '!bg-transparent !border-transparent !opacity-0 !pointer-events-none',
          ].join(' ')}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className={[
            '!w-3 !h-3 !border-2 !border-white dark:!border-neutral-900',
            isEditor ? '!bg-blue-400' : '!bg-transparent !border-transparent !opacity-0 !pointer-events-none',
          ].join(' ')}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left-target"
          className={[
            '!w-3 !h-3 !border-2 !border-white dark:!border-neutral-900',
            isEditor ? '!bg-blue-400' : '!bg-transparent !border-transparent !opacity-0 !pointer-events-none',
          ].join(' ')}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right-source"
          className={[
            '!w-3 !h-3 !border-2 !border-white dark:!border-neutral-900',
            isEditor ? '!bg-blue-400' : '!bg-transparent !border-transparent !opacity-0 !pointer-events-none',
          ].join(' ')}
        />
      </>

      {/* Header: icon + category + title */}
      <div className="flex items-start gap-3">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base"
          style={{ backgroundColor: nodeData.iconBgColor, color: nodeData.iconColor }}
        >
          <Icon />
        </span>
        <div className="flex flex-col gap-0.5 min-w-0 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] font-semibold tracking-widest uppercase text-gray-400 dark:text-neutral-500">
              {nodeData.category}
            </span>
            <span
              className={[
                'text-[8px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full',
                nodeData.nodeType === 'milestone'
                  ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
              ].join(' ')}
            >
              {nodeData.nodeType}
            </span>
          </div>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight truncate">
            {nodeData.title}
          </span>
        </div>
      </div>

      {/* Description */}
      {nodeData.description && (
        <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
          {nodeData.description}
        </p>
      )}

      {/* Date */}
      {nodeData.date && (
        <p className="text-[10px] text-gray-400 dark:text-neutral-500 italic">
          {nodeData.date}
        </p>
      )}

      {/* Tech stack badges */}
      {nodeData.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {nodeData.techStack.map((techKey) => {
            const TechIcon = TECH_ICON_MAP[techKey]
            if (!TechIcon) return null
            return (
              <div
                key={techKey}
                title={techKey}
                className="w-6 h-6 rounded-md border border-dashed border-gray-200 dark:border-neutral-700 dark:bg-zinc-800 flex items-center justify-center"
              >
                <TechIcon
                  className="text-[10px]"
                  style={{ color: TECH_COLORS[techKey] ?? '#888' }}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Links */}
      {(nodeData.githubUrl || nodeData.liveUrl) && (
        <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-neutral-800">
          {nodeData.githubUrl && (
            <a
              href={nodeData.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FiGithub className="text-xs" />
              <span>GitHub</span>
            </a>
          )}
          {nodeData.liveUrl && (
            <a
              href={nodeData.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FiExternalLink className="text-xs" />
              <span>Live</span>
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(CanvasNodeCard)
