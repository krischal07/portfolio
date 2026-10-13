import type { ReactNode } from 'react'

function renderInline(text: string): ReactNode[] {
  const tokens = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g
  const result: ReactNode[] = []
  let cursor = 0

  for (const match of text.matchAll(tokens)) {
    const index = match.index ?? 0
    if (index > cursor) result.push(text.slice(cursor, index))

    if (match[1]) {
      result.push(<strong key={`bold-${index}`}>{match[1]}</strong>)
    } else if (match[2]) {
      result.push(
        <code key={`code-${index}`} className="rounded bg-gray-100 px-1 py-0.5 text-[0.9em] dark:bg-neutral-800">
          {match[2]}
        </code>,
      )
    } else if (match[3] && match[4]) {
      let href: URL | null = null
      try {
        href = new URL(match[4], 'https://krischal.space')
      } catch {
        href = null
      }
      if (href && (href.protocol === 'http:' || href.protocol === 'https:')) {
        const external = href.origin !== 'https://krischal.space'
        result.push(
          <a
            key={`link-${index}`}
            href={href.toString()}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="font-medium underline decoration-gray-400 underline-offset-4 hover:decoration-current"
          >
            {match[3]}
          </a>,
        )
      } else {
        result.push(match[3])
      }
    }
    cursor = index + match[0].length
  }

  if (cursor < text.length) result.push(text.slice(cursor))
  return result
}

function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function BlogMarkdown({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()
    if (!line) {
      index += 1
      continue
    }

    const heading = line.match(/^(##|###)\s+(.+)$/)
    if (heading) {
      const Heading = heading[1] === '##' ? 'h2' : 'h3'
      blocks.push(
        <Heading
          key={`heading-${index}`}
          id={headingId(heading[2])}
          className="mt-10 text-2xl font-semibold tracking-tight text-gray-950 first:mt-0 dark:text-white"
        >
          {renderInline(heading[2])}
        </Heading>,
      )
      index += 1
      continue
    }

    if (line.startsWith('- ')) {
      const items: string[] = []
      while (index < lines.length && lines[index].trim().startsWith('- ')) {
        items.push(lines[index].trim().slice(2))
        index += 1
      }
      blocks.push(
        <ul key={`list-${index}`} className="my-5 list-disc space-y-2 pl-6 text-gray-700 dark:text-neutral-300">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ul>,
      )
      continue
    }

    const paragraph = [line]
    index += 1
    while (index < lines.length && lines[index].trim() && !/^(#{2,3})\s+/.test(lines[index].trim()) && !lines[index].trim().startsWith('- ')) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    blocks.push(
      <p key={`paragraph-${index}`} className="my-5 leading-8 text-gray-700 dark:text-neutral-300">
        {renderInline(paragraph.join(' '))}
      </p>,
    )
  }

  return <div>{blocks}</div>
}
