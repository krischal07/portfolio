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
import techData from '@/data/techstack.json'

// ── Icon map ───────────────────────────────────────────────────
const ICON_MAP: Record<string, IconType> = {
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

// ── Component ──────────────────────────────────────────────────
const TechStack = () => {
  return (
    <section className="flex flex-col gap-5 py-4">
      {/* Technologies & Tools */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-gray-900">Technologies &amp; Tools</h2>
        <div className="flex flex-wrap gap-2">
          {techData.technologies.map((tech) => {
            const Icon = ICON_MAP[tech.icon]
            return (
              <div
                key={tech.name}
                title={tech.name}
                className="w-12 h-12 rounded-lg border border-dashed border-gray-300 flex items-center justify-center"
              >
                <Icon style={{ color: tech.color }} className="text-2xl" />
              </div>
            )
          })}
        </div>
      </div>

      {/* What I've done */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-sm font-bold text-gray-900">What I&apos;ve done</h2>
        <ul className="flex flex-col gap-2">
          {techData.whatIDid.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-none bg-gray-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default TechStack
