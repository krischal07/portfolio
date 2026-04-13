import {
  IoBulbOutline,
  IoCodeSlashOutline,
  IoPeopleOutline,
  IoServerOutline,
  IoRocketOutline,
  IoFlashOutline,
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

export const NODE_ICON_MAP: Record<string, IconType> = {
  bulb: IoBulbOutline,
  code: IoCodeSlashOutline,
  people: IoPeopleOutline,
  database: IoServerOutline,
  rocket: IoRocketOutline,
  flash: IoFlashOutline,
}

export const TECH_ICON_MAP: Record<string, IconType> = {
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

export const TECH_COLORS: Record<string, string> = {
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

export const TECH_LABELS: Record<string, string> = {
  nextjs: 'Next.js',
  tailwindcss: 'Tailwind CSS',
  typescript: 'TypeScript',
  react: 'React',
  nodejs: 'Node.js',
  mongodb: 'MongoDB',
  docker: 'Docker',
  postgresql: 'PostgreSQL',
  figma: 'Figma',
}
