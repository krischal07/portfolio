import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { subInfoSettings } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { SUB_INFO_DEFAULTS, SUB_INFO_ID, type SubInfoItem, type SubInfoValues } from '@/lib/sub-info'
import { isMissingSubInfoTableError } from '@/lib/sub-info-db'

type SubInfoResponse = SubInfoValues & {
  updatedAt: string
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

function toResponse(row?: typeof subInfoSettings.$inferSelect): SubInfoResponse {
  if (!row) {
    return {
      ...SUB_INFO_DEFAULTS,
      updatedAt: new Date(0).toISOString(),
    }
  }

  return {
    tzOffset: row.tzOffset,
    items: isSubInfoItemArray(row.items) ? row.items : SUB_INFO_DEFAULTS.items,
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function GET() {
  try {
    const existing = await db
      .select()
      .from(subInfoSettings)
      .where(eq(subInfoSettings.id, SUB_INFO_ID))
      .limit(1)

    return NextResponse.json(toResponse(existing[0]))
  } catch (error) {
    if (!isMissingSubInfoTableError(error)) {
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

  const tzOffset = Number(body?.tzOffset)
  const items = body?.items

  if (!Number.isFinite(tzOffset) || !isSubInfoItemArray(items)) {
    return NextResponse.json(
      { error: 'tzOffset must be a number and items must be a valid list' },
      { status: 400 }
    )
  }

  const updated = await db
    .insert(subInfoSettings)
    .values({
      id: SUB_INFO_ID,
      tzOffset,
      items,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: subInfoSettings.id,
      set: {
        tzOffset,
        items,
        updatedAt: new Date(),
      },
    })
    .returning()

  return NextResponse.json(toResponse(updated[0]))
}
