import { getHeaderInformationSafe } from '@/lib/header-information-db'
import { getExperienceSafe } from '@/lib/experience-db'
import { getSocialLinksSafe } from '@/lib/social-links-db'
import { getSubInfoSafe } from '@/lib/sub-info-db'
import ExperienceForm from './ExperienceForm'
import HeaderInformationForm from './HeaderInformationForm'
import SocialLinksForm from './SocialLinksForm'
import SubInfoForm from './SubInfoForm'
import TabNavLink from './TabNavLink'

export default async function AdminInformationPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  const activeTab =
    params.tab === 'sub-info' || params.tab === 'socials' || params.tab === 'experience'
      ? params.tab
      : 'header'

  const experience = await getExperienceSafe()
  const info = await getHeaderInformationSafe()
  const subInfo = await getSubInfoSafe()
  const socialLinks = await getSocialLinksSafe()

  return (
    <div className="max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Information</h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">Manage public content sections for your portfolio.</p>
      </div>

      <div className="mb-8 inline-flex rounded-lg border border-gray-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900">
        <TabNavLink href="/admin/information?tab=header" label="Header" active={activeTab === 'header'} />
        <TabNavLink href="/admin/information?tab=sub-info" label="Sub Info" active={activeTab === 'sub-info'} />
        <TabNavLink href="/admin/information?tab=socials" label="Socials" active={activeTab === 'socials'} />
        <TabNavLink href="/admin/information?tab=experience" label="Experience" active={activeTab === 'experience'} />
      </div>

      {activeTab === 'header' ? (
        <HeaderInformationForm
          initialValues={{
            name: info.name,
            tagline: info.tagline,
            bioHtml: info.bioHtml,
            email: info.email,
            avatarLight: info.avatarLight,
            avatarDark: info.avatarDark,
            updatedAt: info.updatedAt.toISOString(),
          }}
        />
      ) : activeTab === 'sub-info' ? (
        <SubInfoForm
          initialValues={{
            tzOffset: subInfo.tzOffset,
            items: subInfo.items,
            updatedAt: subInfo.updatedAt.toISOString(),
          }}
        />
      ) : activeTab === 'socials' ? (
        <SocialLinksForm
          initialValues={{
            items: socialLinks.items,
            updatedAt: socialLinks.updatedAt.toISOString(),
          }}
        />
      ) : (
        <ExperienceForm
          initialValues={{
            items: experience.items,
            updatedAt: experience.updatedAt.toISOString(),
          }}
        />
      )}
    </div>
  )
}
