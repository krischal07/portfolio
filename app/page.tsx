import type { Metadata } from "next";
import Experience from '@/components/Experience'
import GithubActivity from '@/components/GithubActivity'
import Header from '@/components/Header'
import SocialMediaHandles from '@/components/SocialMediaHandles'
import SubInfo from '@/components/SubInfo'
import { getExperienceSafe } from '@/lib/experience-db'
import { getSubInfoSafe } from '@/lib/sub-info-db'

export const metadata: Metadata = {
  title: {
    absolute: "Krischal Shrestha — Software Engineer",
  },
  description:
    "Krischal Shrestha is a design-minded software engineer building scalable systems. Founder of Rocket Space, building Samparka and Upasthit.",
  alternates: {
    canonical: "https://krischal.space",
  },
  openGraph: {
    url: "https://krischal.space",
  },
};

const Home = async () => {
  const experience = await getExperienceSafe()
  const subInfo = await getSubInfoSafe()

  return (
    <div className='mx-auto md:max-w-3xl *:[[id]]:scroll-mt-22 min-h-screen w-full px-4 '>
      <Header />
      <SubInfo tzOffset={subInfo.tzOffset} info={subInfo.items} />
      <SocialMediaHandles/>
      <GithubActivity/>
      <Experience items={experience.items} />
    </div>
  )
}

export default Home
