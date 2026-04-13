import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../lib/db/schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

// Initial canvas positions matching the existing static layout
const INITIAL_POSITIONS: Record<string, { x: number; y: number }> = {
  'node-1': { x: 100, y: 0 },
  'node-2': { x: 500, y: 0 },
  'node-3': { x: 500, y: 280 },
  'node-4': { x: 100, y: 560 },
  'node-5': { x: 100, y: 840 },
}

const journeyNodes = [
  {
    id: 'node-1',
    type: 'milestone' as const,
    iconName: 'bulb',
    iconColor: '#ffffff',
    iconBgColor: '#0d9488',
    category: 'ORIGIN',
    title: 'Started Learning to Code',
    description: 'Picked up HTML and CSS out of curiosity. Built first static site in a weekend.',
    tech: [] as string[],
  },
  {
    id: 'node-2',
    type: 'project' as const,
    iconName: 'rocket',
    iconColor: '#ffffff',
    iconBgColor: '#7c3aed',
    category: 'PROJECT',
    title: 'Rocket Space',
    description: 'Design studio building fast, minimal websites for startups and creators.',
    tech: ['nextjs', 'tailwindcss', 'figma'],
  },
  {
    id: 'node-3',
    type: 'milestone' as const,
    iconName: 'code',
    iconColor: '#ffffff',
    iconBgColor: '#0891b2',
    category: 'MILESTONE',
    title: 'First Full-Stack App',
    description: 'Shipped a full-stack app with auth, database, and deployment — end to end.',
    tech: ['nodejs', 'postgresql', 'react'],
  },
  {
    id: 'node-4',
    type: 'project' as const,
    iconName: 'database',
    iconColor: '#ffffff',
    iconBgColor: '#0e7490',
    category: 'PRODUCT',
    title: 'Samparka Digital Loyalty',
    description: 'Digital loyalty platform connecting businesses and customers at scale.',
    tech: ['nextjs', 'typescript', 'mongodb', 'nodejs'],
  },
  {
    id: 'node-5',
    type: 'project' as const,
    iconName: 'people',
    iconColor: '#ffffff',
    iconBgColor: '#059669',
    category: 'PRODUCT',
    title: 'Upasthit',
    description: 'Attendance and team management platform built for modern organizations.',
    tech: ['nextjs', 'react', 'docker', 'mongodb'],
  },
]

const connections = [
  { id: 'conn-1', from: 'node-1', to: 'node-2', label: '6 months later', labelType: 'time' as const },
  { id: 'conn-2', from: 'node-2', to: 'node-3', label: 'learned React', labelType: 'action' as const },
  { id: 'conn-3', from: 'node-3', to: 'node-4', label: '1 year later', labelType: 'time' as const },
  { id: 'conn-4', from: 'node-4', to: 'node-5', label: 'founded Upasthit', labelType: 'action' as const },
]

async function seed() {
  console.log('Seeding canvas data...')

  // Clear existing canvas data
  await db.delete(schema.projectEdge)
  await db.delete(schema.projectNode)
  console.log('Cleared existing canvas data.')

  // Insert nodes
  const nodeRows = journeyNodes.map((node) => {
    const pos = INITIAL_POSITIONS[node.id] ?? { x: 0, y: 0 }
    return {
      id: node.id,
      nodeType: node.type,
      iconName: node.iconName,
      iconColor: node.iconColor,
      iconBgColor: node.iconBgColor,
      category: node.category,
      title: node.title,
      description: node.description,
      techStack: node.tech,
      githubUrl: null,
      liveUrl: null,
      date: null,
      positionX: pos.x,
      positionY: pos.y,
    }
  })

  await db.insert(schema.projectNode).values(nodeRows)
  console.log(`Inserted ${nodeRows.length} nodes.`)

  // Insert edges
  const edgeRows = connections.map((conn) => ({
    id: conn.id,
    source: conn.from,
    target: conn.to,
    label: conn.label,
    labelType: conn.labelType,
  }))

  await db.insert(schema.projectEdge).values(edgeRows)
  console.log(`Inserted ${edgeRows.length} edges.`)

  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
