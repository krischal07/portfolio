'use client'

import { useState } from 'react'
import {
  IoBulbOutline,
  IoCodeSlashOutline,
  IoPersonOutline,
  IoAdd,
  IoTrashOutline,
  IoSparklesOutline,
} from 'react-icons/io5'
import {
  SiCss,
  SiBun,
  SiCypress,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiFigma,
  SiGraphql,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiNginx,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiReact,
  SiRedis,
  SiRedux,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from 'react-icons/si'
import type { IconType } from 'react-icons'
import type { ExperienceItem, ExperienceRole, ExperienceRoleTech } from '@/lib/experience'

type ExperienceFormValues = {
  items: ExperienceItem[]
  updatedAt: string
}

type TechPreset = {
  key: string
  name: string
  color: string
  icon: IconType
}

const ROLE_ICONS = [
  { key: 'code', label: 'Code', icon: IoCodeSlashOutline },
  { key: 'bulb', label: 'Bulb', icon: IoBulbOutline },
  { key: 'person', label: 'Person', icon: IoPersonOutline },
] as const

const TECH_PRESETS: TechPreset[] = [
  { key: 'javascript', name: 'JavaScript', color: '#F7DF1E', icon: SiJavascript },
  { key: 'html5', name: 'HTML5', color: '#E34F26', icon: SiHtml5 },
  { key: 'css3', name: 'CSS3', color: '#1572B6', icon: SiCss },
  { key: 'nextjs', name: 'Next.js', color: '#111111', icon: SiNextdotjs },
  { key: 'vite', name: 'Vite', color: '#646CFF', icon: SiVite },
  { key: 'typescript', name: 'TypeScript', color: '#3178C6', icon: SiTypescript },
  { key: 'tailwindcss', name: 'Tailwind CSS', color: '#06B6D4', icon: SiTailwindcss },
  { key: 'react', name: 'React', color: '#61DAFB', icon: SiReact },
  { key: 'redux', name: 'Redux', color: '#764ABC', icon: SiRedux },
  { key: 'graphql', name: 'GraphQL', color: '#E10098', icon: SiGraphql },
  { key: 'figma', name: 'Figma', color: '#F24E1E', icon: SiFigma },
  { key: 'vercel', name: 'Vercel', color: '#111111', icon: SiVercel },
  { key: 'nodejs', name: 'Node.js', color: '#339933', icon: SiNodedotjs },
  { key: 'express', name: 'Express', color: '#111111', icon: SiExpress },
  { key: 'postgresql', name: 'PostgreSQL', color: '#336791', icon: SiPostgresql },
  { key: 'redis', name: 'Redis', color: '#DC382D', icon: SiRedis },
  { key: 'supabase', name: 'Supabase', color: '#3ECF8E', icon: SiSupabase },
  { key: 'firebase', name: 'Firebase', color: '#FFCA28', icon: SiFirebase },
  { key: 'docker', name: 'Docker', color: '#2496ED', icon: SiDocker },
  { key: 'nginx', name: 'Nginx', color: '#009639', icon: SiNginx },
  { key: 'prisma', name: 'Prisma', color: '#0C344B', icon: SiPrisma },
  { key: 'mongodb', name: 'MongoDB', color: '#47A248', icon: SiMongodb },
  { key: 'jest', name: 'Jest', color: '#C21325', icon: SiJest },
  { key: 'cypress', name: 'Cypress', color: '#69D3A7', icon: SiCypress },
  { key: 'git', name: 'Git', color: '#F05032', icon: SiGit },
  { key: 'postman', name: 'Postman', color: '#FF6C37', icon: SiPostman },
  { key: 'bun', name: 'Bun', color: '#F9F1E1', icon: SiBun },
]

function emptyRole(): ExperienceRole {
  return {
    id: `role-${crypto.randomUUID().slice(0, 8)}`,
    title: 'New Role',
    icon: 'code',
    type: 'Full-time',
    startDate: '2026-01',
    endDate: null,
    technologies: [],
    whatIDid: [],
    defaultExpanded: false,
  }
}

function emptyCompany(): ExperienceItem {
  return {
    id: `company-${crypto.randomUUID().slice(0, 8)}`,
    company: 'New Company',
    logoIcon: 'code',
    location: 'Kathmandu, Nepal',
    logoBg: 'bg-white dark:bg-neutral-900',
    current: false,
    roles: [emptyRole()],
  }
}

function roleIconLabel(key: string) {
  return ROLE_ICONS.find((i) => i.key === key)?.label ?? 'Code'
}

function selectedRoleIcon(key: string) {
  return ROLE_ICONS.find((i) => i.key === key)?.icon ?? IoCodeSlashOutline
}

function hasTech(role: ExperienceRole, techKey: string) {
  return role.technologies.some((tech) => tech.icon === techKey)
}

export default function ExperienceForm({ initialValues }: { initialValues: ExperienceFormValues }) {
  const [values, setValues] = useState(initialValues)
  const [companyIndex, setCompanyIndex] = useState(0)
  const [roleIndex, setRoleIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const selectedCompany = values.items[companyIndex]
  const selectedRole = selectedCompany?.roles[roleIndex]

  function patchCompany(patch: Partial<ExperienceItem>) {
    setValues((prev) => {
      const next = [...prev.items]
      next[companyIndex] = { ...next[companyIndex], ...patch }
      return { ...prev, items: next }
    })
  }

  function patchRole(patch: Partial<ExperienceRole>) {
    setValues((prev) => {
      const next = [...prev.items]
      const roles = [...next[companyIndex].roles]
      roles[roleIndex] = { ...roles[roleIndex], ...patch }
      next[companyIndex] = { ...next[companyIndex], roles }
      return { ...prev, items: next }
    })
  }

  function patchRoleTechnology(nextTechnologies: ExperienceRoleTech[]) {
    if (!selectedRole) return
    patchRole({ technologies: nextTechnologies })
  }

  function addCompany() {
    setValues((prev) => ({ ...prev, items: [...prev.items, emptyCompany()] }))
    setCompanyIndex(values.items.length)
    setRoleIndex(0)
  }

  function removeCompany(index: number) {
    setValues((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }))
    setCompanyIndex(0)
    setRoleIndex(0)
  }

  function addRole() {
    if (!selectedCompany) return
    patchCompany({ roles: [...selectedCompany.roles, emptyRole()] })
    setRoleIndex(selectedCompany.roles.length)
  }

  function removeRole(index: number) {
    if (!selectedCompany) return
    patchCompany({ roles: selectedCompany.roles.filter((_, i) => i !== index) })
    setRoleIndex(0)
  }

  function toggleTech(tech: TechPreset) {
    if (!selectedRole) return

    if (hasTech(selectedRole, tech.key)) {
      patchRoleTechnology(selectedRole.technologies.filter((item) => item.icon !== tech.key))
      return
    }

    patchRoleTechnology([
      ...selectedRole.technologies,
      {
        name: tech.name,
        icon: tech.key,
        color: tech.color,
      },
    ])
  }

  function removeTech(index: number) {
    if (!selectedRole) return
    patchRoleTechnology(selectedRole.technologies.filter((_, i) => i !== index))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/information/experience', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: values.items }),
    })

    const body = await res.json()
    if (!res.ok) {
      setError(body.error ?? 'Failed to save experience data')
      setLoading(false)
      return
    }

    setValues((prev) => ({ ...prev, updatedAt: body.updatedAt }))
    setSuccess('Saved successfully')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Companies</p>
            <button type="button" onClick={addCompany} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"><IoAdd /> Add</button>
          </div>
          <div className="space-y-2">
            {values.items.map((company, cIndex) => (
              <button
                key={company.id}
                type="button"
                onClick={() => {
                  setCompanyIndex(cIndex)
                  setRoleIndex(0)
                }}
                className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                  cIndex === companyIndex
                    ? 'border-gray-900 bg-gray-50 dark:border-white dark:bg-neutral-800'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800/70'
                }`}
              >
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{company.company}</p>
                <p className="truncate text-xs text-gray-500 dark:text-neutral-400">{company.location}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {selectedCompany && selectedRole ? (
            <>
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Company</p>
                  <button type="button" onClick={() => removeCompany(companyIndex)} className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700"><IoTrashOutline /> Remove</button>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input value={selectedCompany.company} onChange={(e) => patchCompany({ company: e.target.value })} placeholder="Company name" className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
                  <input value={selectedCompany.location} onChange={(e) => patchCompany({ location: e.target.value })} placeholder="Location" className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
                  <input value={selectedCompany.logoPath ?? ''} onChange={(e) => patchCompany({ logoPath: e.target.value || undefined })} placeholder="Logo path" className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
                  <input value={selectedCompany.logoPathLight ?? ''} onChange={(e) => patchCompany({ logoPathLight: e.target.value || undefined })} placeholder="Logo light path" className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
                  <input value={selectedCompany.logoPathDark ?? ''} onChange={(e) => patchCompany({ logoPathDark: e.target.value || undefined })} placeholder="Logo dark path" className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
                  <input value={selectedCompany.logoBg} onChange={(e) => patchCompany({ logoBg: e.target.value })} placeholder="Logo bg class" className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Roles</p>
                  <button type="button" onClick={addRole} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"><IoAdd /> Add Role</button>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedCompany.roles.map((role, rIndex) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setRoleIndex(rIndex)}
                      className={`rounded-md px-2.5 py-1 text-xs ${
                        rIndex === roleIndex
                          ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                          : 'border border-gray-200 text-gray-600 dark:border-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {role.title || `Role ${rIndex + 1}`}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input value={selectedRole.title} onChange={(e) => patchRole({ title: e.target.value })} placeholder="Role title" className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
                  <input value={selectedRole.type} onChange={(e) => patchRole({ type: e.target.value })} placeholder="Type (Full-time, etc)" className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
                  <input value={selectedRole.startDate} onChange={(e) => patchRole({ startDate: e.target.value })} placeholder="Start YYYY-MM" className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
                  <input value={selectedRole.endDate ?? ''} onChange={(e) => patchRole({ endDate: e.target.value || null })} placeholder="End YYYY-MM (empty current)" className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-neutral-700" />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-300">
                    <input type="checkbox" checked={selectedRole.defaultExpanded} onChange={(e) => patchRole({ defaultExpanded: e.target.checked })} /> Expanded by default
                  </label>

                  <div className="inline-flex items-center gap-1 rounded-lg border border-gray-200 p-1 dark:border-neutral-700">
                    {ROLE_ICONS.map((item) => {
                      const Icon = item.icon
                      const active = selectedRole.icon === item.key
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => patchRole({ icon: item.key })}
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
                            active ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-600 dark:text-neutral-300'
                          }`}
                          title={item.label}
                        >
                          <Icon size={14} /> {item.label}
                        </button>
                      )
                    })}
                  </div>

                  <button type="button" onClick={() => removeRole(roleIndex)} className="ml-auto inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700"><IoTrashOutline /> Remove Role</button>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Tech Stack</p>

                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {TECH_PRESETS.map((tech) => {
                    const Icon = tech.icon
                    const active = hasTech(selectedRole, tech.key)
                    return (
                      <button
                        key={tech.key}
                        type="button"
                        onClick={() => toggleTech(tech)}
                        className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs transition-colors ${
                          active
                            ? 'border-gray-900 bg-gray-50 text-gray-900 dark:border-white dark:bg-neutral-800 dark:text-white'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <Icon size={14} style={{ color: tech.color }} />
                        <span className="truncate">{tech.name}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Selected Stack</p>
                  {selectedRole.technologies.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-200 px-3 py-3 text-xs text-gray-400 dark:border-neutral-700 dark:text-neutral-500">
                      Pick technologies from above. They will appear with logo + name.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedRole.technologies.map((tech, i) => {
                        const preset = TECH_PRESETS.find((p) => p.key === tech.icon)
                        const Icon = preset?.icon ?? IoSparklesOutline
                        return (
                          <button
                            key={`${tech.icon}-${i}`}
                            type="button"
                            onClick={() => removeTech(i)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                            title="Click to remove"
                          >
                            <Icon size={13} style={{ color: tech.color }} />
                            <span>{tech.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">What I did</p>
                <textarea
                  value={selectedRole.whatIDid.join('\n')}
                  onChange={(e) => patchRole({ whatIDid: e.target.value.split('\n').map((v) => v.trim()).filter(Boolean) })}
                  rows={6}
                  placeholder="One achievement per line"
                  className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm leading-relaxed dark:border-neutral-700"
                />
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Live Card Preview</p>
                <div className="rounded-lg border border-gray-200 p-3 dark:border-neutral-700">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = selectedRoleIcon(selectedRole.icon)
                      return <Icon size={16} className="text-gray-500 dark:text-neutral-300" />
                    })()}
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedRole.title}</p>
                    <span className="rounded-md border border-gray-200 px-2 py-0.5 text-[10px] text-gray-500 dark:border-neutral-700 dark:text-neutral-400">{roleIconLabel(selectedRole.icon)}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">{selectedRole.type} · {selectedCompany.company}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedRole.technologies.map((tech, i) => {
                      const preset = TECH_PRESETS.find((p) => p.key === tech.icon)
                      const Icon = preset?.icon ?? IoSparklesOutline
                      return (
                        <span key={`${tech.icon}-${i}`} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-600 dark:border-neutral-700 dark:text-neutral-300">
                          <Icon size={12} style={{ color: tech.color }} />
                          {tech.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {loading ? 'Saving...' : 'Save Experience'}
        </button>
        <span className="text-xs text-gray-400 dark:text-neutral-500">Last updated: {new Date(values.updatedAt).toLocaleString()}</span>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
      </div>
    </form>
  )
}
