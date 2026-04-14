import experienceData from '@/data/experience.json'

export const EXPERIENCE_ID = 'main'

export type ExperienceRoleTech = {
  name: string
  icon: string
  color: string
}

export type ExperienceRole = {
  id: string
  title: string
  icon: string
  type: string
  startDate: string
  endDate: string | null
  technologies: ExperienceRoleTech[]
  whatIDid: string[]
  defaultExpanded: boolean
}

export type ExperienceItem = {
  id: string
  company: string
  logoIcon: string
  logoPath?: string
  logoPathLight?: string
  logoPathDark?: string
  location: string
  logoBg: string
  current: boolean
  roles: ExperienceRole[]
}

export type ExperienceValues = {
  items: ExperienceItem[]
}

export const EXPERIENCE_DEFAULTS: ExperienceValues = {
  items: experienceData.experiences as ExperienceItem[],
}
