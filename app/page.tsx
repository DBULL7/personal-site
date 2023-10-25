import Image from 'next/image'
import profilePic from '../public/profile_pic.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MatrixRain from '@/components/matrix-rain'
import {
  faTwitter,
  faGithub,
  faLinkedin,
  faReact,
  faNodeJs,
  faJs,
  IconDefinition,
  faGolang,
  faVuejs,
  faHtml5,
  faCss3,
  faGitAlt,
  faAws
} from '@fortawesome/free-brands-svg-icons'
import {
  faCloud,
  faCode,
  faDatabase,
  faGear,
  faServer,
  faShieldDog
} from '@fortawesome/free-solid-svg-icons'
import { Tile, tileProps } from '@/components/tile'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devon Bull - Senior Software Engineer',
  description:
    'Explore the portfolio and blog of Devon Bull, a Senior Software Engineer and futurist. Discover unique blog posts and technical resources.'
}

const programmingLanguagesAndFrameworks: tileProps[] = [
  // TODO - add Typescript and Express.js icons but Font Awesome doesn't have it
  { icon: faJs, text: 'JavaScript', link: 'https://www.javascript.com' },
  { icon: faCode, text: 'TypeScript', link: 'https://www.typescriptlang.org' },
  { icon: faGolang, text: 'Golang', link: 'https://go.dev' },
  { icon: faNodeJs, text: 'Node.js', link: 'https://nodejs.org/en/' },
  { icon: faServer, text: 'Express.js', link: 'https://expressjs.com' },
  { icon: faReact, text: 'React', link: 'https://reactjs.org' },
  { icon: faVuejs, text: 'Vue.js', link: 'https://vuejs.org' },
  {
    icon: faHtml5,
    text: 'HTML',
    link: 'https://developer.mozilla.org/en-US/docs/Glossary/HTML5'
  },
  {
    icon: faCss3,
    text: 'CSS',
    link: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
  }
]

const tooling: tileProps[] = [
  {
    icon: faDatabase,
    text: 'DynamoDB',
    link: 'https://aws.amazon.com/dynamodb/'
  },
  { icon: faDatabase, text: 'MongoDB', link: 'https://www.mongodb.com' },
  { icon: faDatabase, text: 'Postgress', link: 'https://www.postgresql.org' },
  { icon: faAws, text: 'AWS', link: 'https://aws.amazon.com' },
  { icon: faCloud, text: 'Google Cloud', link: 'https://cloud.google.com' },
  {
    icon: faGithub,
    text: 'Github Actions',
    link: 'https://github.com/features/actions'
  },
  { icon: faGear, text: 'Kubernetes', link: 'https://kubernetes.io' },
  { icon: faShieldDog, text: 'DataDog', link: 'https://www.datadoghq.com' },
  { icon: faGitAlt, text: 'Git', link: 'https://git-scm.com' }
]

export default function Home() {
  const programmingLanguagesTiles = programmingLanguagesAndFrameworks.map(
    ({ text, icon, link }) => (
      <Tile text={text} icon={icon} link={link} key={text} />
    )
  )
  const toolingTiles = tooling.map(({ text, icon, link }) => (
    <Tile text={text} icon={icon} link={link} key={text} />
  ))

  return (
    <main>
      <MatrixRain />
      <div className="container mx-auto flex justify-center">
        <div className="pt-24">
          <div className="flex justify-center">
            <Image
              src={profilePic}
              alt={'Picture of Devon'}
              className="rounded-full"
              height={125}
              width={125}
            />
          </div>
          <div className="flex justify-center py-4">
            <h1 className="text-4xl font-bold dark:text-blue-500 ">
              Devon Bull
            </h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto mb-4 mt-16 py-4 md:px-64">
        <p className="text-center text-2xl">Hi there I&apos;m Dev 👋</p>
        <p className="pt-2 text-center">I&apos;m a Software Engineer</p>
      </div>
      <h3 className="mt-8 text-center text-2xl">
        Programming Languages & Frameworks
      </h3>
      <div className="container mx-auto grid max-w-screen-lg grid-cols-2 gap-4 px-16 py-6 md:grid-cols-4 md:px-32 lg:px-64">
        {programmingLanguagesTiles}
      </div>
      <h3 className="mt-8 text-center text-2xl">Tooling</h3>
      <div className="container mx-auto grid max-w-screen-lg grid-cols-2 gap-4 px-16 pb-16 pt-6 md:grid-cols-4 md:px-32 lg:px-64">
        {toolingTiles}
      </div>
    </main>
  )
}
