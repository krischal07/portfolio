'use client'

import { useState } from 'react'
import {
  IoCodeSlashOutline,
  IoBulbOutline,
  IoPersonOutline,
  IoCloseOutline,
  IoChevronUpOutline,
  IoChevronDownOutline,
} from 'react-icons/io5'
import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiReact,
  SiFigma,
  SiVercel,
  SiNodedotjs,
  SiPostgresql,
  SiDocker,
  SiPrisma,
  SiMongodb,
  SiGit,
  SiPostman,
  SiBun,
} from 'react-icons/si'
import type { IconType } from 'react-icons'
import experienceData from '@/data/experience.json'

// ── Role icon map ──────────────────────────────────────────────
const ROLE_ICON_MAP: Record<string, IconType> = {
  code:   IoCodeSlashOutline,
  bulb:   IoBulbOutline,
  person: IoPersonOutline,
}

// ── Tech icon map ──────────────────────────────────────────────
const TECH_ICON_MAP: Record<string, IconType> = {
  nextjs:      SiNextdotjs,
  tailwindcss: SiTailwindcss,
  typescript:  SiTypescript,
  react:       SiReact,
  figma:       SiFigma,
  vercel:      SiVercel,
  nodejs:      SiNodedotjs,
  postgresql:  SiPostgresql,
  docker:      SiDocker,
  prisma:      SiPrisma,
  mongodb:     SiMongodb,
  git:         SiGit,
  postman:     SiPostman,
  bun:         SiBun,
}

// ── Helpers ────────────────────────────────────────────────────
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '∞'
  const [year, month] = dateStr.split('-')
  return `${month}.${year}`
}

function calcDuration(startDate: string, endDate: string | null): string {
  const start = new Date(`${startDate}-01`)
  const end = endDate ? new Date(`${endDate}-01`) : new Date()
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  if (years === 0) return `${months}m`
  if (months === 0) return `${years}y`
  return `${years}y ${months}m`
}

// ── Small role icon box ────────────────────────────────────────
function IconBox({ icon }: { icon: string }) {
  const Icon = ROLE_ICON_MAP[icon] ?? IoCodeSlashOutline
  return (
    <span className="w-8 h-8 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex items-center justify-center shrink-0 text-gray-500 dark:text-neutral-400 text-sm z-10">
      <Icon />
    </span>
  )
}

// ── Company logo (circular) ────────────────────────────────────
function CompanyLogo({ icon, bg }: { icon: string; bg: string }) {
  const Icon = ROLE_ICON_MAP[icon] ?? IoCodeSlashOutline
  return (
    <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-base ${bg}`}>
      <Icon />
    </span>
  )
}

// ── Role card ──────────────────────────────────────────────────
type Role = (typeof experienceData.experiences)[0]['roles'][0]

function RoleCard({
  role,
  expanded,
  onToggle,
}: {
  role: Role
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-start gap-3">
      <IconBox icon={role.icon} />

      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{role.title}</span>
          <button
            onClick={onToggle}
            aria-label={expanded ? 'Collapse' : 'Expand'}
            className="text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mt-0.5 shrink-0"
          >
            {expanded ? (
              <IoCloseOutline className="text-base" />
            ) : (
              <span className="flex flex-col items-center leading-none">
                <IoChevronUpOutline className="text-xs" />
                <IoChevronDownOutline className="text-xs" />
              </span>
            )}
          </button>
        </div>

        {/* Meta: type | date range | duration */}
        <p className="text-xs text-gray-400 dark:text-neutral-500 flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span>{role.type}</span>
          <span className="text-gray-200 dark:text-neutral-700">|</span>
          <span>{formatDate(role.startDate)}–{formatDate(role.endDate)}</span>
          <span className="text-gray-200 dark:text-neutral-700">|</span>
          <span>{calcDuration(role.startDate, role.endDate)}</span>
        </p>

        {expanded && (
          <>
            {/* Technologies & Tools */}
            {role.technologies.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Technologies &amp; Tools</p>
                <div className="flex flex-wrap gap-2">
                  {role.technologies.map((tech) => {
                    const Icon = TECH_ICON_MAP[tech.icon] ?? SiNextdotjs
                    return (
                      <div
                        key={tech.name}
                        title={tech.name}
                        className="w-10 h-10 rounded-lg border border-dashed border-gray-300 dark:border-neutral-600 flex items-center justify-center"
                      >
                        <Icon style={{ color: tech.color }} className="text-xl" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* What I've done */}
            {role.whatIDid.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">What I&apos;ve done</p>
                <ul className="flex flex-col gap-1.5">
                  {role.whatIDid.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-500 dark:text-neutral-400">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-gray-400 dark:bg-neutral-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────
const Experience = () => {
  const [expanded, setExpanded] = useState<Set<string>>(
    () =>
      new Set(
        experienceData.experiences
          .flatMap((c) => c.roles)
          .filter((r) => r.defaultExpanded)
          .map((r) => r.id)
      )
  )

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <section className="flex flex-col py-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Experience</h2>

      {experienceData.experiences.map((company, idx) => (
        <div key={company.id} className={idx > 0 ? 'border-t border-gray-100 dark:border-neutral-800 pt-5' : ''}>
          {/* Company header */}
          <div className="flex items-center gap-2.5 mb-4">
            <CompanyLogo icon={company.logoIcon} bg={company.logoBg} />
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">{company.company}</span>

            {company.current && (
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-xs text-gray-700 dark:text-green-300">
                <span className="relative flex w-1.5 h-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-green-500" />
                </span>
                Working
              </span>
            )}
       
            
          </div>

          {/* Roles */}
          <div className="relative flex flex-col gap-5 mb-5">
            {company.roles.length > 1 && (
              <span className="absolute left-3.75 top-4 bottom-4 w-px bg-gray-200 dark:bg-neutral-700" />
            )}
            {company.roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                expanded={expanded.has(role.id)}
                onToggle={() => toggle(role.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export default Experience
