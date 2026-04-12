# GitHub Activity — Setup Guide

This document explains how to wire up the GitHub contribution heatmap on your portfolio.

---

## How it works

```
Browser → GET /api/github-activity
              ↓
         route.ts reads GITHUB_TOKEN (server-only, never sent to browser)
              ↓
         POST https://api.github.com/graphql
              ↓
         Returns { totalContributions, weeks[] }
              ↓
         GithubActivity.tsx renders the heatmap
```

The token never leaves the server. The browser only calls your own `/api/github-activity` endpoint.

---

## Step 1 — Create a GitHub Personal Access Token (PAT)

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens**
   - Direct link: https://github.com/settings/tokens?type=beta

2. Click **"Generate new token"**

3. Fill in the form:
   | Field | Value |
   |---|---|
   | Token name | `portfolio-contributions` |
   | Expiration | 1 year (or No expiration) |
   | Resource owner | Your account |
   | Repository access | Public repositories only |

4. Under **"Account permissions"** set:
   - **Contributions** → `Read-only`
   *(If using a classic token instead, check only the `read:user` scope)*

5. Click **"Generate token"** and **copy the token immediately** — GitHub only shows it once.

> **Classic token alternative:**
> Settings → Developer settings → Personal access tokens → Tokens (classic)
> → Generate new token → check `read:user` → Generate

---

## Step 2 — Add env variables

Create `.env.local` in the project root (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Then fill in your values:

```env
GITHUB_USERNAME=krischal07
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GITHUB_USERNAME=krischal07
```

> `.env.local` is already in `.gitignore` by default in Next.js projects — your token will NOT be committed.

---

## Step 3 — Restart the dev server

Environment variables are loaded at startup:

```bash
pnpm dev
```

---

## Step 4 — Test the API route

With the server running, open:

```
http://localhost:3000/api/github-activity
```

You should see a JSON response like:

```json
{
  "totalContributions": 4318,
  "weeks": [
    {
      "contributionDays": [
        { "date": "2025-04-13", "contributionCount": 3 },
        ...
      ]
    },
    ...
  ]
}
```

If you see `{ "error": "..." }`, check the troubleshooting section below.

---

## Step 5 — Deploy (Vercel)

In the Vercel dashboard, go to your project → **Settings → Environment Variables** and add:

| Name | Value |
|---|---|
| `GITHUB_USERNAME` | `krischal07` |
| `GITHUB_TOKEN` | `ghp_xxx...` |
| `NEXT_PUBLIC_GITHUB_USERNAME` | `krischal07` |

Redeploy after saving.

---

## API reference

### `GET /api/github-activity`

Fetches your GitHub contribution calendar for the current year.

**Response (success `200`):**
```ts
{
  totalContributions: number   // e.g. 4318
  weeks: Array<{
    contributionDays: Array<{
      date: string             // "YYYY-MM-DD"
      contributionCount: number
    }>
  }>
}
```

**Response (error):**
```ts
{ error: string }
```

**Caching:** The route caches the response for **1 hour** (`next: { revalidate: 3600 }`). Change this value in `app/api/github-activity/route.ts` to suit your needs.

---

## Color levels

| Contributions | Color class |
|---|---|
| 0 | `bg-gray-100` |
| 1–3 | `bg-gray-300` |
| 4–6 | `bg-gray-400` |
| 7–9 | `bg-gray-500` |
| 10+ | `bg-gray-700` |

To change the palette, edit `getColor()` in `components/GithubActivity.tsx`.

---

## Troubleshooting

| Error | Fix |
|---|---|
| `GITHUB_USERNAME and GITHUB_TOKEN env vars are required` | `.env.local` is missing or the server wasn't restarted after adding it |
| `GitHub API responded with 401` | Token is invalid or expired — generate a new one |
| `GitHub API responded with 403` | Token doesn't have the `read:user` / Contributions scope |
| `No contribution data found` | Username is wrong — double-check `GITHUB_USERNAME` |
| Graph shows no data | You may have no public contributions; make sure your contribution graph is public in GitHub settings |
