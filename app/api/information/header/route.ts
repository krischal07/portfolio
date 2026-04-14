import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { headerInformation } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import {
  HEADER_INFORMATION_DEFAULTS,
  HEADER_INFORMATION_ID,
  type HeaderInformationValues,
} from '@/lib/header-information'
import { isMissingHeaderInformationTableError } from '@/lib/header-information-db'

type HeaderInformationResponse = HeaderInformationValues & {
  updatedAt: string
}

function htmlToPlainText(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function parseBody(body: unknown): HeaderInformationValues | null {
  if (!body || typeof body !== 'object') return null

  const data = body as Record<string, unknown>

  if (
    !isNonEmptyString(data.name) ||
    !isNonEmptyString(data.tagline) ||
    !isNonEmptyString(data.bioHtml) ||
    !isNonEmptyString(data.email) ||
    !isNonEmptyString(data.avatarLight) ||
    !isNonEmptyString(data.avatarDark)
  ) {
    return null
  }

  return {
    name: data.name.trim(),
    tagline: data.tagline.trim(),
    bioHtml: data.bioHtml.trim(),
    email: data.email.trim(),
    avatarLight: data.avatarLight.trim(),
    avatarDark: data.avatarDark.trim(),
  }
}

function toResponse(row?: typeof headerInformation.$inferSelect): HeaderInformationResponse {
  if (!row) {
    return {
      ...HEADER_INFORMATION_DEFAULTS,
      updatedAt: new Date(0).toISOString(),
    }
  }

  return {
    name: row.name,
    tagline: row.tagline,
    bioHtml: row.bioHtml || `<p>${row.bio1}</p><p>${row.bio2}</p><p>${row.bio3}</p>`,
    email: row.email,
    avatarLight: row.avatarLight,
    avatarDark: row.avatarDark,
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function GET() {
  try {
    const existing = await db
      .select()
      .from(headerInformation)
      .where(eq(headerInformation.id, HEADER_INFORMATION_ID))
      .limit(1)

    return NextResponse.json(toResponse(existing[0]))
  } catch (error) {
    if (!isMissingHeaderInformationTableError(error)) {
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

  const parsed = parseBody(await request.json())

  if (!parsed) {
    return NextResponse.json(
      { error: 'All header fields are required and must be non-empty strings (including bio content)' },
      { status: 400 }
    )
  }

  const updated = await db
    .insert(headerInformation)
    .values({
      id: HEADER_INFORMATION_ID,
      ...parsed,
      bio1: htmlToPlainText(parsed.bioHtml),
      bio2: '',
      bio3: '',
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: headerInformation.id,
      set: {
        ...parsed,
        bio1: htmlToPlainText(parsed.bioHtml),
        bio2: '',
        bio3: '',
        updatedAt: new Date(),
      },
    })
    .returning()

  return NextResponse.json(toResponse(updated[0]))
}
