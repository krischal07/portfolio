import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { socialLinksSettings } from '@/lib/db/schema'
import {
  SOCIAL_LINKS_DEFAULTS,
  SOCIAL_LINKS_ID,
  type SocialLinkItem,
  type SocialLinksValues,
} from '@/lib/social-links'

export type SocialLinksRecord = SocialLinksValues & {
  updatedAt: Date
}

export function isSocialLinkItems(value: unknown): value is SocialLinkItem[] {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (!item || typeof item !== 'object') return false
    const row = item as Record<string, unknown>
    return (
      typeof row.name === 'string' &&
      typeof row.icon === 'string' &&
      typeof row.bg === 'string' &&
      typeof row.url === 'string'
    )
  })
}

export function isMissingSocialLinksTableError(error: unknown) {
  if (!error || typeof error !== 'object') return false

  const maybeError = error as { code?: string; message?: string }
  if (maybeError.code === '42P01') return true

  const message = maybeError.message?.toLowerCase() ?? ''
  return message.includes('social_links_settings') && message.includes('does not exist')
}

export async function getSocialLinksSafe(): Promise<SocialLinksRecord> {
  try {
    const existing = await db
      .select()
      .from(socialLinksSettings)
      .where(eq(socialLinksSettings.id, SOCIAL_LINKS_ID))
      .limit(1)

    if (existing[0]) {
      return {
        items: isSocialLinkItems(existing[0].items) ? existing[0].items : SOCIAL_LINKS_DEFAULTS.items,
        updatedAt: existing[0].updatedAt,
      }
    }
  } catch (error) {
    if (!isMissingSocialLinksTableError(error)) {
      throw error
    }
  }

  return {
    ...SOCIAL_LINKS_DEFAULTS,
    updatedAt: new Date(0),
  }
}
