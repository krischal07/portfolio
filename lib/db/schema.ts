import { pgTable, text, timestamp, boolean, jsonb, real } from 'drizzle-orm/pg-core'

// ── Better Auth required tables ────────────────────────────────────────────

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

// ── Application tables ─────────────────────────────────────────────────────

export const blogPost = pgTable('blog_posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  status: text('status', { enum: ['draft', 'published'] })
    .notNull()
    .default('draft'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const project = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  techStack: jsonb('tech_stack').$type<string[]>().notNull().default([]),
  githubUrl: text('github_url'),
  liveUrl: text('live_url'),
  date: text('date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const headerInformation = pgTable('header_information', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  tagline: text('tagline').notNull(),
  bio1: text('bio_1').notNull(),
  bio2: text('bio_2').notNull(),
  bio3: text('bio_3').notNull(),
  bioHtml: text('bio_html').notNull().default(''),
  email: text('email').notNull(),
  avatarLight: text('avatar_light').notNull(),
  avatarDark: text('avatar_dark').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const subInfoSettings = pgTable('sub_info_settings', {
  id: text('id').primaryKey(),
  tzOffset: real('tz_offset').notNull().default(0),
  items: jsonb('items')
    .$type<Array<{ icon: string; label: string | null; highlight: string | null; fullWidth: boolean }>>()
    .notNull()
    .default([]),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const socialLinksSettings = pgTable('social_links_settings', {
  id: text('id').primaryKey(),
  items: jsonb('items')
    .$type<Array<{ name: string; icon: string; bg: string; url: string }>>()
    .notNull()
    .default([]),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const experienceSettings = pgTable('experience_settings', {
  id: text('id').primaryKey(),
  items: jsonb('items')
    .$type<
      Array<{
        id: string
        company: string
        logoIcon: string
        logoPath?: string
        logoPathLight?: string
        logoPathDark?: string
        location: string
        logoBg: string
        current: boolean
        roles: Array<{
          id: string
          title: string
          icon: string
          type: string
          startDate: string
          endDate: string | null
          technologies: Array<{ name: string; icon: string; color: string }>
          whatIDid: string[]
          defaultExpanded: boolean
        }>
      }>
    >()
    .notNull()
    .default([]),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ── Canvas tables ───────────────────────────────────────────────────────────

export const projectNode = pgTable('project_nodes', {
  id: text('id').primaryKey(),
  nodeType: text('node_type', { enum: ['milestone', 'project'] })
    .notNull()
    .default('project'),
  iconName: text('icon_name').notNull().default('bulb'),
  iconColor: text('icon_color').notNull().default('#ffffff'),
  iconBgColor: text('icon_bg_color').notNull().default('#0d9488'),
  category: text('category').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  techStack: jsonb('tech_stack').$type<string[]>().notNull().default([]),
  githubUrl: text('github_url'),
  liveUrl: text('live_url'),
  date: text('date'),
  positionX: real('position_x').notNull().default(0),
  positionY: real('position_y').notNull().default(0),
  mobilePositionX: real('mobile_position_x'),
  mobilePositionY: real('mobile_position_y'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const projectEdge = pgTable('project_edges', {
  id: text('id').primaryKey(),
  source: text('source')
    .notNull()
    .references(() => projectNode.id, { onDelete: 'cascade' }),
  target: text('target')
    .notNull()
    .references(() => projectNode.id, { onDelete: 'cascade' }),
  sourceHandle: text('source_handle'),
  targetHandle: text('target_handle'),
  label: text('label'),
  labelType: text('label_type', { enum: ['time', 'action'] })
    .notNull()
    .default('action'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
