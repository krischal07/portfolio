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
    "Krischal Shrestha is a design-minded software engineer and co-founder of Markish, building social media tools alongside Samparka, Upasthit, and Rocket Space.",
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
    <div className='mx-auto min-h-screen w-full min-w-0 max-w-3xl px-4 *:[[id]]:scroll-mt-22'>
      <Header />
      <SubInfo tzOffset={subInfo.tzOffset} info={subInfo.items} />
      <SocialMediaHandles/>
      <GithubActivity/>
      <Experience items={experience.items} />
    </div>
  )
}

export default Home
