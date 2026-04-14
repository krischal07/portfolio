import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { experienceSettings } from '@/lib/db/schema'
import { EXPERIENCE_DEFAULTS, EXPERIENCE_ID, type ExperienceItem, type ExperienceValues } from '@/lib/experience'

export type ExperienceRecord = ExperienceValues & {
  updatedAt: Date
}

export function isExperienceItems(value: unknown): value is ExperienceItem[] {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (!item || typeof item !== 'object') return false
    const row = item as Record<string, unknown>
    return (
      typeof row.id === 'string' &&
      typeof row.company === 'string' &&
      typeof row.logoIcon === 'string' &&
      typeof row.location === 'string' &&
      typeof row.logoBg === 'string' &&
      typeof row.current === 'boolean' &&
      Array.isArray(row.roles)
    )
  })
}

export function isMissingExperienceTableError(error: unknown) {
  if (!error || typeof error !== 'object') return false

  const maybeError = error as { code?: string; message?: string }
  if (maybeError.code === '42P01') return true

  const message = maybeError.message?.toLowerCase() ?? ''
  return message.includes('experience_settings') && message.includes('does not exist')
}

export async function getExperienceSafe(): Promise<ExperienceRecord> {
  try {
    const existing = await db
      .select()
      .from(experienceSettings)
      .where(eq(experienceSettings.id, EXPERIENCE_ID))
      .limit(1)

    if (existing[0]) {
      return {
        items: isExperienceItems(existing[0].items) ? existing[0].items : EXPERIENCE_DEFAULTS.items,
        updatedAt: existing[0].updatedAt,
      }
    }
  } catch (error) {
    if (!isMissingExperienceTableError(error)) {
      throw error
    }
  }

  return {
    ...EXPERIENCE_DEFAULTS,
    updatedAt: new Date(0),
  }
}
