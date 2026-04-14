import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { socialLinksSettings } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import {
  SOCIAL_LINKS_DEFAULTS,
  SOCIAL_LINKS_ID,
  type SocialLinkItem,
  type SocialLinksValues,
} from '@/lib/social-links'
import { isMissingSocialLinksTableError, isSocialLinkItems } from '@/lib/social-links-db'

type SocialLinksResponse = SocialLinksValues & {
  updatedAt: string
}

function toResponse(row?: typeof socialLinksSettings.$inferSelect): SocialLinksResponse {
  if (!row) {
    return {
      ...SOCIAL_LINKS_DEFAULTS,
      updatedAt: new Date(0).toISOString(),
    }
  }

  return {
    items: isSocialLinkItems(row.items) ? row.items : SOCIAL_LINKS_DEFAULTS.items,
    updatedAt: row.updatedAt.toISOString(),
  }
}

function isValidItem(item: SocialLinkItem) {
  return (
    item.name.trim().length > 0 &&
    item.icon.trim().length > 0 &&
    item.bg.trim().length > 0 &&
    item.url.trim().length > 0
  )
}

export async function GET() {
  try {
    const existing = await db
      .select()
      .from(socialLinksSettings)
      .where(eq(socialLinksSettings.id, SOCIAL_LINKS_ID))
      .limit(1)

    return NextResponse.json(toResponse(existing[0]))
  } catch (error) {
    if (!isMissingSocialLinksTableError(error)) {
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

  if (!isSocialLinkItems(items) || items.length === 0 || !items.every(isValidItem)) {
    return NextResponse.json(
      { error: 'items must be a non-empty list with name, icon, bg, and url' },
      { status: 400 }
    )
  }

  const cleanedItems = items.map((item) => ({
    name: item.name.trim(),
    icon: item.icon.trim(),
    bg: item.bg.trim(),
    url: item.url.trim(),
  }))

  const updated = await db
    .insert(socialLinksSettings)
    .values({
      id: SOCIAL_LINKS_ID,
      items: cleanedItems,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: socialLinksSettings.id,
      set: {
        items: cleanedItems,
        updatedAt: new Date(),
      },
    })
    .returning()

  return NextResponse.json(toResponse(updated[0]))
}
