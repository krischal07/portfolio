import Image from 'next/image'
import { getHeaderInformationSafe } from '@/lib/header-information-db'
import CopyEmailButton from './CopyEmailButton'

export default async function Header() {
  const info = await getHeaderInformationSafe()

  return (
    <header className="flex flex-col gap-4 py-6">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
          <Image
            src={info.avatarLight}
            alt={`${info.name} profile`}
            width={80}
            height={80}
            className="block h-full w-full object-cover dark:hidden"
          />
          <Image
            src={info.avatarDark}
            alt={`${info.name} profile`}
            width={80}
            height={80}
            className="hidden h-full w-full object-cover dark:block"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-gray-100">{info.name}</h1>
          <p className="text-sm italic text-gray-500 dark:text-neutral-400">{info.tagline}</p>
          <div className="pt-0.5">
            <CopyEmailButton email={info.email} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-neutral-400">
        <div
          className="space-y-3 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-80 [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: info.bioHtml }}
        />
      </div>
    </header>
  )
}
