import {
  IoBulbOutline,
  IoCodeSlashOutline,
  IoPeopleOutline,
  IoServerOutline,
  IoRocketOutline,
  IoFlashOutline,
  IoTimeOutline,
  IoArrowForwardOutline,
} from 'react-icons/io5'
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiNodedotjs,
  SiMongodb,
  SiDocker,
  SiPostgresql,
  SiFigma,
} from 'react-icons/si'
import type { IconType } from 'react-icons'
import projectsData from '@/data/projects.json'

// ── Types ──────────────────────────────────────────────────────
interface JourneyNode {
  id: string
  type: 'milestone' | 'project'
  iconName: string
  iconColor: string
  iconBgColor: string
  category: string
  title: string
  description: string
  tech: string[]
}

interface Connection {
  id: string
  from: string
  to: string
  label: string
  labelType: 'time' | 'action'
}

// ── Icon maps ──────────────────────────────────────────────────
const NODE_ICON_MAP: Record<string, IconType> = {
  bulb: IoBulbOutline,
  code: IoCodeSlashOutline,
  people: IoPeopleOutline,
  database: IoServerOutline,
  rocket: IoRocketOutline,
  flash: IoFlashOutline,
}

const TECH_ICON_MAP: Record<string, IconType> = {
  nextjs: SiNextdotjs,
  tailwindcss: SiTailwindcss,
  typescript: SiTypescript,
  react: SiReact,
  nodejs: SiNodedotjs,
  mongodb: SiMongodb,
  docker: SiDocker,
  postgresql: SiPostgresql,
  figma: SiFigma,
}

const TECH_COLORS: Record<string, string> = {
  nextjs: '#000000',
  tailwindcss: '#06B6D4',
  typescript: '#3178C6',
  react: '#61DAFB',
  nodejs: '#339933',
  mongodb: '#47A248',
  docker: '#2496ED',
  postgresql: '#4169E1',
  figma: '#F24E1E',
}

// ── Layout constants ───────────────────────────────────────────
// SVG viewBox: 0 0 600 CONTAINER_H
// Left col : x = 0   → 270  (45% of 600), center = 135
// Gap      : x = 270 → 330  (10% of 600)
// Right col: x = 330 → 600  (45% of 600), center = 465
//
// Node tops (px):  0, 0, 250, 500, 750
// Card height: 170px → mid-heights: 85, 85, 335, 585, 835
// Total container: 750 + 170 = 920px

const CARD_H = 170
const CONTAINER_H = 920

// Absolute top (px) and column for each node (in order)
const NODE_POSITIONS = [
  { col: 'left' as const,  top: 0   }, // node-1
  { col: 'right' as const, top: 0   }, // node-2
  { col: 'right' as const, top: 250 }, // node-3
  { col: 'left' as const,  top: 500 }, // node-4
  { col: 'left' as const,  top: 750 }, // node-5
]

// SVG arrow paths + label anchor points
// x is in 600-unit SVG space; y is in px (1 SVG unit = 1px because preserveAspectRatio="none" + height=CONTAINER_H)
// labelX / 600 → CSS left %;  labelY → CSS top px
const SVG_ARROWS = [
  {
    connId: 'conn-1',
    // Node 1 right edge (270, 85) → Node 2 left edge (330, 85): horizontal S-curve
    path: 'M 270 85 C 296 56, 304 114, 330 85',
    labelX: 300,
    labelY: 63,
  },
  {
    connId: 'conn-2',
    // Node 2 bottom center (465, 170) → Node 3 top center (465, 250): vertical
    path: 'M 465 170 C 465 198, 465 222, 465 250',
    labelX: 390,
    labelY: 210,
  },
  {
    connId: 'conn-3',
    // Node 3 left edge (330, 335) → Node 4 right edge (270, 585): diagonal
    path: 'M 330 335 C 290 378, 284 545, 270 585',
    labelX: 308,
    labelY: 460,
  },
  {
    connId: 'conn-4',
    // Node 4 bottom center (135, 670) → Node 5 top center (135, 750): vertical
    path: 'M 135 670 C 135 698, 135 722, 135 750',
    labelX: 210,
    labelY: 710,
  },
]

// ── NodeCard ───────────────────────────────────────────────────
function NodeCard({ node }: { node: JourneyNode }) {
  const Icon = NODE_ICON_MAP[node.iconName] ?? IoBulbOutline

  return (
    <div
      className="h-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-sm p-4 flex flex-col"
      style={{ minHeight: `${CARD_H}px` }}
    >
      {/* Icon box + category/title */}
      <div className="flex items-start gap-3 mb-3">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base"
          style={{ backgroundColor: node.iconBgColor, color: node.iconColor }}
        >
          <Icon />
        </span>
        <div className="flex flex-col gap-0.5 min-w-0 pt-1">
          <span className="text-[9px] font-semibold tracking-widest uppercase text-gray-400 dark:text-neutral-500">
            {node.category}
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
            {node.title}
          </span>
        </div>
      </div>

      {/* Description */}
      {node.description && (
        <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed mb-3 flex-1">
          {node.description}
        </p>
      )}

      {/* Tech badges */}
      {node.tech.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {node.tech.map((techKey) => {
            const TechIcon = TECH_ICON_MAP[techKey]
            if (!TechIcon) return null
            return (
              <div
                key={techKey}
                title={techKey}
                className="w-7 h-7 rounded-lg border border-dashed border-gray-200 dark:border-neutral-700 dark:bg-zinc-800 flex items-center justify-center"
              >
                <TechIcon
                  className="text-xs"
                  style={{ color: TECH_COLORS[techKey] ?? '#888' }}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────
export default function ProjectsPage() {
  const nodes = projectsData.journeyNodes as JourneyNode[]
  const connections = projectsData.connections as Connection[]

  return (
    <main className="mx-auto md:max-w-3xl w-full px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Projects
      </h2>

      {/* ── Desktop: 2-column with SVG overlay ── */}
      <div
        className="hidden sm:block relative w-full"
        style={{ height: `${CONTAINER_H}px` }}
      >
        {/* Cards — absolutely positioned */}
        {nodes.map((node, i) => {
          const pos = NODE_POSITIONS[i]
          if (!pos) return null
          const isLeft = pos.col === 'left'
          return (
            <div
              key={node.id}
              className="absolute w-[45%]"
              style={{
                top: `${pos.top}px`,
                left: isLeft ? 0 : undefined,
                right: isLeft ? undefined : 0,
                height: `${CARD_H}px`,
              }}
            >
              <NodeCard node={node} />
            </div>
          )
        })}

        {/* SVG arrow overlay — covers full container, arrows connect card edges */}
        <svg
          className="absolute inset-0 w-full pointer-events-none text-gray-300 dark:text-neutral-600"
          viewBox={`0 0 600 ${CONTAINER_H}`}
          preserveAspectRatio="none"
          height={CONTAINER_H}
          aria-hidden="true"
        >
          <defs>
            {SVG_ARROWS.map(({ connId }) => (
              <marker
                key={connId}
                id={`arrow-${connId}`}
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
              </marker>
            ))}
          </defs>

          {SVG_ARROWS.map(({ connId, path }) => (
            <path
              key={connId}
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              markerEnd={`url(#arrow-${connId})`}
            />
          ))}
        </svg>

        {/* Connection labels — HTML pills positioned over SVG paths */}
        {SVG_ARROWS.map(({ connId, labelX, labelY }) => {
          const connection = connections.find((c) => c.id === connId)
          if (!connection) return null
          return (
            <div
              key={connId}
              className="absolute pointer-events-none z-10"
              style={{
                left: `${(labelX / 600) * 100}%`,
                top: `${labelY}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-[9px] font-semibold tracking-wider uppercase text-gray-500 dark:text-neutral-400 shadow-sm whitespace-nowrap">
                {connection.labelType === 'time' ? (
                  <IoTimeOutline className="text-[9px] shrink-0" />
                ) : (
                  <IoArrowForwardOutline className="text-[9px] shrink-0" />
                )}
                {connection.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Mobile: single column with vertical connectors ── */}
      <div className="sm:hidden flex flex-col">
        {nodes.map((node) => {
          const connection = connections.find((c) => c.from === node.id)
          return (
            <div key={node.id}>
              <NodeCard node={node} />
              {connection && (
                <div className="flex flex-col items-start pl-5 py-1 gap-1">
                  <div className="w-px h-5 bg-gray-200 dark:bg-neutral-700" />
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-[9px] font-semibold tracking-wider uppercase text-gray-500 dark:text-neutral-400">
                    {connection.labelType === 'time' ? (
                      <IoTimeOutline className="text-[9px] shrink-0" />
                    ) : (
                      <IoArrowForwardOutline className="text-[9px] shrink-0" />
                    )}
                    {connection.label}
                  </span>
                  <div className="w-px h-5 bg-gray-200 dark:bg-neutral-700" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
