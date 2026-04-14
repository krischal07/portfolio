import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { headerInformation } from '@/lib/db/schema'
import {
  HEADER_INFORMATION_DEFAULTS,
  HEADER_INFORMATION_ID,
  type HeaderInformationValues,
} from '@/lib/header-information'

export type HeaderInformationRecord = HeaderInformationValues & {
  updatedAt: Date
}

export function isMissingHeaderInformationTableError(error: unknown) {
  if (!error || typeof error !== 'object') return false

  const maybeError = error as { code?: string; message?: string }
  if (maybeError.code === '42P01') return true

  const message = maybeError.message?.toLowerCase() ?? ''
  return message.includes('header_information') && message.includes('does not exist')
}

export async function getHeaderInformationSafe(): Promise<HeaderInformationRecord> {
  try {
    const existing = await db
      .select()
      .from(headerInformation)
      .where(eq(headerInformation.id, HEADER_INFORMATION_ID))
      .limit(1)

    if (existing[0]) {
      const fallbackBioHtml = `<p>${existing[0].bio1}</p><p>${existing[0].bio2}</p><p>${existing[0].bio3}</p>`

      return {
        name: existing[0].name,
        tagline: existing[0].tagline,
        bioHtml: existing[0].bioHtml || fallbackBioHtml || HEADER_INFORMATION_DEFAULTS.bioHtml,
        email: existing[0].email,
        avatarLight: existing[0].avatarLight,
        avatarDark: existing[0].avatarDark,
        updatedAt: existing[0].updatedAt,
      }
    }
  } catch (error) {
    if (!isMissingHeaderInformationTableError(error)) {
      throw error
    }
  }

  return {
    ...HEADER_INFORMATION_DEFAULTS,
    updatedAt: new Date(0),
  }
}
