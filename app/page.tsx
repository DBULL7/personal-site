import Image from 'next/image'
import profilePic from '../public/profile_pic.jpg'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
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
    faDatabase, faGear, faServer,
    faShieldDog
} from "@fortawesome/free-solid-svg-icons";
import styles from './page.module.css'


const programmingLanguagesAndFrameworks: tileProps[] = [
    // TODO - add Typescript and Express.js icons but Font Awesome doesn't have it
    { icon: faJs, text: 'JavaScript', link: 'https://www.javascript.com'  },
    { icon: faCode, text: 'TypeScript', link: 'https://www.typescriptlang.org' },
    { icon: faGolang, text: 'Golang', link: 'https://go.dev' },
    { icon: faNodeJs, text: 'Node.js', link: 'https://nodejs.org/en/' },
    { icon: faServer, text: 'Express.js', link: 'https://expressjs.com' },
    { icon: faReact, text: 'React', link: 'https://reactjs.org' },
    { icon: faVuejs, text: 'Vue.js', link: 'https://vuejs.org' },
    { icon: faHtml5, text: 'HTML', link: 'https://developer.mozilla.org/en-US/docs/Glossary/HTML5' },
    { icon: faCss3, text: 'CSS', link: 'https://developer.mozilla.org/en-US/docs/Web/CSS' }
]

const tooling: tileProps[] = [
    { icon: faDatabase, text: 'DynamoDB', link: 'https://aws.amazon.com/dynamodb/' },
    { icon: faDatabase, text: 'MongoDB', link: 'https://www.mongodb.com' },
    { icon: faDatabase, text: 'Postgress', link: 'https://www.postgresql.org' },
    { icon: faAws, text: 'AWS', link: 'https://aws.amazon.com' },
    { icon: faCloud, text: 'Google Cloud', link: 'https://cloud.google.com' },
    { icon: faGithub, text: 'Github Actions', link: 'https://github.com/features/actions' },
    { icon: faGear, text: 'Kubernetes', link: 'https://kubernetes.io' },
    { icon: faShieldDog, text: 'DataDog', link: 'https://www.datadoghq.com' },
    { icon: faGitAlt, text: 'Git', link: 'https://git-scm.com' }
]

interface tileProps {
    icon?: IconDefinition
    text?: string
    link: string
}

const Tile = ({ icon, text, link }: tileProps) => {
    return (
        <a href={link} target="_blank" rel="noreferrer">
            <div className="flex flex-col justify-center py-4 rounded-lg border border-gray-700 hover:border-blue-600 hover:text-blue-600">
                {icon && <FontAwesomeIcon
                    icon={icon}
                    className=""
                    size="2xl"
                />}
                {text && <p className="pt-2 text-center">{text}</p>}
            </div>
        </a>
    )
}

export default function Home() {
    const programmingLanguagesTiles = programmingLanguagesAndFrameworks.map(({ text, icon, link }) => <Tile text={text} icon={icon} link={link} key={text} />)
    const toolingTiles = tooling.map(({ text, icon, link }) => <Tile text={text} icon={icon} link={link} key={text}/>)

  return (
    <main>
        <div className="container mx-auto flex justify-center">
            <div className="pt-24">
                <div className="flex justify-center">
                    <Image
                        src={profilePic}
                        alt={"Picture of Devon"}
                        className="rounded-full"
                        height={125}
                        width={125}
                    />
                </div>
                <div className="flex justify-center py-4">
                    <h1 className="dark:text-blue-500 text-4xl font-bold ">
                        Devon Bull
                    </h1>
                </div>
                {/*<div className="flex justify-center pt-1 flex flex-row justify-around">*/}
                {/*    <a href="https://twitter.com/Devon_Bull" target="_blank" rel="noreferrer">*/}
                {/*        <FontAwesomeIcon*/}
                {/*            icon={faTwitter}*/}
                {/*            size="lg"*/}
                {/*        />*/}
                {/*    </a>*/}
                {/*    <a href="https://github.com/DBULL7" target="_blank" rel="noreferrer">*/}
                {/*        <FontAwesomeIcon*/}
                {/*            icon={faGithub}*/}
                {/*            size="lg"*/}
                {/*        />*/}
                {/*    </a>*/}
                {/*    <a href="https://www.linkedin.com/in/bulldevon" target="_blank" rel="noreferrer">*/}
                {/*        <FontAwesomeIcon*/}
                {/*            icon={faLinkedin}*/}
                {/*            size="lg"*/}
                {/*        />*/}
                {/*    </a>*/}
                {/*</div>*/}
            </div>
        </div>
        <div className="container mt-16 mb-4 mx-auto md:px-64 py-4">
            <p className="text-2xl text-center">Hi there I&apos;m Dev 👋</p>
            <p className="pt-2 text-center">I&apos;m a Software Engineer</p>
        </div>
        <h3 className="text-2xl text-center mt-8">Programming Languages & Frameworks</h3>
        <div className="container max-w-screen-lg mx-auto px-16 md:px-32 lg:px-64 grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
            { programmingLanguagesTiles }
        </div>
        <h3 className="text-2xl text-center mt-8">Tooling</h3>
        <div className="container max-w-screen-lg mx-auto px-16 md:px-32 lg:px-64 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 pb-16">
            { toolingTiles }
        </div>
    </main>
  )
}


