'use client'

import { memo } from 'react'
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
} from '@xyflow/react'
import { IoTimeOutline, IoArrowForwardOutline } from 'react-icons/io5'
import type { LabelType } from '@/lib/canvas-types'

interface EdgeData {
  label?: string | null
  labelType?: LabelType
}

function CanvasEdgeLabel({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected,
}: EdgeProps) {
  const edgeData = (data ?? {}) as EdgeData

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeDasharray: '6 4',
          stroke: selected ? '#3b82f6' : '#64748b',
          strokeWidth: 1.5,
        }}
      />

      {edgeData.label && (
        <EdgeLabelRenderer>
          <div
            className="absolute pointer-events-none nodrag nopan"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-[9px] font-semibold tracking-wider uppercase text-gray-500 dark:text-neutral-400 shadow-sm whitespace-nowrap">
              {edgeData.labelType === 'time' ? (
                <IoTimeOutline className="text-[9px] shrink-0" />
              ) : (
                <IoArrowForwardOutline className="text-[9px] shrink-0" />
              )}
              {edgeData.label}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export default memo(CanvasEdgeLabel)
