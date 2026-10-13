'use client'

import { useEffect, useState } from 'react'

// ── Types ──────────────────────────────────────────────────────
type ContributionLevel = 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE'

type ContributionDay = {
  date: string
  contributionCount: number
  contributionLevel: ContributionLevel
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
const CONTRIBUTION_COLORS: Record<ContributionLevel, string> = {
  NONE: 'bg-[#ebedf0] dark:bg-[#161b22]',
  FIRST_QUARTILE: 'bg-[#9be9a8] dark:bg-[#0e4429]',
  SECOND_QUARTILE: 'bg-[#40c463] dark:bg-[#006d32]',
  THIRD_QUARTILE: 'bg-[#30a14e] dark:bg-[#26a641]',
  FOURTH_QUARTILE: 'bg-[#216e39] dark:bg-[#39d353]',
}
const LEGEND_LEVELS: ContributionLevel[] = [
  'NONE',
  'FIRST_QUARTILE',
  'SECOND_QUARTILE',
  'THIRD_QUARTILE',
  'FOURTH_QUARTILE',
]

function getColor(level: ContributionLevel): string {
  return CONTRIBUTION_COLORS[level]
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

const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

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
          <div className="w-full min-w-0 max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex w-max gap-2">
              <div className="flex flex-col gap-0.75 pt-8 text-[10px] leading-3 text-gray-400 dark:text-neutral-500">
                {WEEKDAY_LABELS.map((label, i) => (
                  <span key={i} className="h-3 w-6">{label}</span>
                ))}
              </div>
              <div>
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
                          <div className={`w-3 h-3 rounded-sm ${getColor(day.contributionLevel)}`} />
                          <div className={`pointer-events-none absolute bottom-full mb-1.5 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
                            wi < 7
                              ? 'left-0'
                              : wi >= data.weeks.length - 7
                                ? 'right-0'
                                : 'left-1/2 -translate-x-1/2'
                          }`}>
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
            </div>
          </div>

          {/* Footer: total + legend */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {data.totalContributions.toLocaleString()}
              </span>{' '}
              contributions in the last year on{' '}
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
              {LEGEND_LEVELS.map((level) => (
                <div key={level} className={`w-3 h-3 rounded-sm ${getColor(level)}`} />
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
