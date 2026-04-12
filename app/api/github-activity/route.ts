import { NextResponse } from 'next/server'

const QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`

export async function GET() {
  const username = process.env.GITHUB_USERNAME
  const token = process.env.GITHUB_TOKEN

  if (!username || !token) {
    return NextResponse.json(
      { error: 'GITHUB_USERNAME and GITHUB_TOKEN env vars are required' },
      { status: 500 }
    )
  }

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: QUERY, variables: { username } }),
    next: { revalidate: 3600 }, // revalidate every hour
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: `GitHub API responded with ${res.status}` },
      { status: res.status }
    )
  }

  const json = await res.json()

  if (json.errors) {
    return NextResponse.json({ error: json.errors[0].message }, { status: 400 })
  }

  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar

  if (!calendar) {
    return NextResponse.json({ error: 'No contribution data found' }, { status: 404 })
  }

  return NextResponse.json(calendar)
}
