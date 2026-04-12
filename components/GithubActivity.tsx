'use client'

import { useEffect, useState } from 'react'

// ── Types ──────────────────────────────────────────────────────
type ContributionDay = {
  date: string
  contributionCount: number
}

type ContributionWeek = {
  contributionDays: ContributionDay[]
}

type ContributionData = {
  totalContributions: number
  weeks: ContributionWeek[]
}

// ── Helpers ────────────────────────────────────────────────────
const CELL_STEP = 15 // cell (12px) + gap (3px)

function getColor(count: number): string {
  if (count === 0) return 'bg-gray-100 dark:bg-neutral-800'
  if (count <= 3)  return 'bg-green-200'
  if (count <= 6)  return 'bg-green-400'
  if (count <= 9)  return 'bg-green-500'
  return 'bg-green-700'
}

function getMonthSpans(weeks: ContributionWeek[]) {
  const spans: { name: string; weeks: number }[] = []
  for (const week of weeks) {
    const firstDay = week.contributionDays.find((d) => d.date)
    if (!firstDay) continue
    const [year, month, day] = firstDay.date.split('-').map(Number)
    const label = new Date(year, month - 1, day).toLocaleString('en', { month: 'short' })
    if (spans.length === 0 || spans[spans.length - 1].name !== label) {
      spans.push({ name: label, weeks: 1 })
    } else {
      spans[spans.length - 1].weeks++
    }
  }
  return spans
}

const LEGEND = ['bg-gray-100 dark:bg-neutral-800', 'bg-green-200', 'bg-green-400', 'bg-green-500', 'bg-green-700']

// ── Component ──────────────────────────────────────────────────
const GithubActivity = () => {
  const [data, setData] = useState<ContributionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/github-activity')
      .then((r) => r.json())
      .then((json) => {
        if (json.error) setError(json.error)
        else setData(json)
      })
      .catch(() => setError('Failed to load activity'))
      .finally(() => setLoading(false))
  }, [])

  const year = new Date().getFullYear()

  return (
    <section className="flex flex-col gap-3 py-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">GitHub Activity</h2>

      {loading && (
        <p className="text-sm text-gray-400 dark:text-neutral-500">Loading contributions…</p>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {data && (
        <>
          {/* Month labels */}
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex" style={{ gap: 0 }}>
              {getMonthSpans(data.weeks).map(({ name, weeks }, i) => (
                <div
                  key={`${name}-${i}`}
                  className="text-xs text-gray-400 dark:text-neutral-500 shrink-0 truncate"
                  style={{ width: weeks * CELL_STEP }}
                >
                  {name}
                </div>
              ))}
            </div>

            {/* Contribution grid */}
            <div className="flex gap-0.75 mt-4">
              {data.weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.75">
                  {week.contributionDays.map((day) => (
                    <div
                      key={day.date}
                      className="relative group w-3 h-3"
                    >
                      <div className={`w-3 h-3 rounded-sm ${getColor(day.contributionCount)}`} />
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          <span className="font-semibold">{day.contributionCount}</span>
                          {' '}contribution{day.contributionCount !== 1 ? 's' : ''} on{' '}
                          {new Date(day.date + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Footer: total + legend */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {data.totalContributions.toLocaleString()}
              </span>{' '}
              contributions in {year} on{' '}
              <a
                href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'krischal07'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                GitHub
              </a>
              .
            </p>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-neutral-500">
              <span>Less</span>
              {LEGEND.map((cls) => (
                <div key={cls} className={`w-3 h-3 rounded-sm ${cls}`} />
              ))}
              <span>More</span>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default GithubActivity
