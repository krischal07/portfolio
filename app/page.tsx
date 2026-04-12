import Experience from '@/components/Experience'
import GithubActivity from '@/components/GithubActivity'
import Header from '@/components/Header'
import SocialMediaHandles from '@/components/SocialMediaHandles'
import SubInfo from '@/components/SubInfo'

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
