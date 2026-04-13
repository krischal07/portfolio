import type { Metadata } from "next";
import Experience from '@/components/Experience'
import GithubActivity from '@/components/GithubActivity'
import Header from '@/components/Header'
import SocialMediaHandles from '@/components/SocialMediaHandles'
import SubInfo from '@/components/SubInfo'

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

const Home = () => {
  return (
    <div className='mx-auto md:max-w-3xl *:[[id]]:scroll-mt-22 min-h-screen w-full px-4 '>
      <Header />
      <SubInfo />
      <SocialMediaHandles/>
      <GithubActivity/>
      <Experience/>
    </div>
  )
}

export default Home
