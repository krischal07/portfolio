import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { subInfoSettings } from '@/lib/db/schema'
import { SUB_INFO_DEFAULTS, SUB_INFO_ID, type SubInfoItem, type SubInfoValues } from '@/lib/sub-info'

export type SubInfoRecord = SubInfoValues & {
  updatedAt: Date
}

function isSubInfoItemArray(value: unknown): value is SubInfoItem[] {
  if (!Array.isArray(value)) return false

  return value.every((item) => {
    if (!item || typeof item !== 'object') return false
    const row = item as Record<string, unknown>
    return (
      typeof row.icon === 'string' &&
      (typeof row.label === 'string' || row.label === null) &&
      (typeof row.highlight === 'string' || row.highlight === null) &&
      typeof row.fullWidth === 'boolean'
    )
  })
}

export function isMissingSubInfoTableError(error: unknown) {
  if (!error || typeof error !== 'object') return false

  const maybeError = error as { code?: string; message?: string }
  if (maybeError.code === '42P01') return true

  const message = maybeError.message?.toLowerCase() ?? ''
  return message.includes('sub_info_settings') && message.includes('does not exist')
}

export async function getSubInfoSafe(): Promise<SubInfoRecord> {
  try {
    const existing = await db
      .select()
      .from(subInfoSettings)
      .where(eq(subInfoSettings.id, SUB_INFO_ID))
      .limit(1)

    if (existing[0]) {
      return {
        tzOffset: existing[0].tzOffset,
        items: isSubInfoItemArray(existing[0].items) ? existing[0].items : SUB_INFO_DEFAULTS.items,
        updatedAt: existing[0].updatedAt,
      }
    }
  } catch (error) {
    if (!isMissingSubInfoTableError(error)) {
      throw error
    }
  }

  return {
    ...SUB_INFO_DEFAULTS,
    updatedAt: new Date(0),
  }
}
