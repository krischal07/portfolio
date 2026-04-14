import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { experienceSettings } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { EXPERIENCE_DEFAULTS, EXPERIENCE_ID, type ExperienceItem, type ExperienceValues } from '@/lib/experience'
import { isExperienceItems, isMissingExperienceTableError } from '@/lib/experience-db'

type ExperienceResponse = ExperienceValues & {
  updatedAt: string
}

function toResponse(row?: typeof experienceSettings.$inferSelect): ExperienceResponse {
  if (!row) {
    return {
      ...EXPERIENCE_DEFAULTS,
      updatedAt: new Date(0).toISOString(),
    }
  }

  return {
    items: isExperienceItems(row.items) ? row.items : EXPERIENCE_DEFAULTS.items,
    updatedAt: row.updatedAt.toISOString(),
  }
}

function hasValidCompanies(items: ExperienceItem[]) {
  return items.every((item) => item.id && item.company && item.location && item.logoBg && Array.isArray(item.roles))
}

export async function GET() {
  try {
    const existing = await db
      .select()
      .from(experienceSettings)
      .where(eq(experienceSettings.id, EXPERIENCE_ID))
      .limit(1)

    return NextResponse.json(toResponse(existing[0]))
  } catch (error) {
    if (!isMissingExperienceTableError(error)) {
      throw error
    }

    return NextResponse.json(toResponse())
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const items = body?.items

  if (!isExperienceItems(items) || items.length === 0 || !hasValidCompanies(items)) {
    return NextResponse.json(
      { error: 'items must be a valid non-empty experience list' },
      { status: 400 }
    )
  }

  const updated = await db
    .insert(experienceSettings)
    .values({
      id: EXPERIENCE_ID,
      items,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: experienceSettings.id,
      set: {
        items,
        updatedAt: new Date(),
      },
    })
    .returning()

  return NextResponse.json(toResponse(updated[0]))
}
