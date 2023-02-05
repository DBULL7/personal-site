import Image from 'next/image'
import { Inter } from '@next/font/google'
import profilePic from '../public/profile_pic.jpg'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faTwitter,
    faGithub,
    faLinkedin,
    faReact,
    faNodeJs,
    faJs,
    IconDefinition, faGolang, faVuejs, faHtml5, faCss3, faGit, faGitAlt, faAws
} from '@fortawesome/free-brands-svg-icons'
import {faCloud, faCode, faDatabase, faShieldDog} from "@fortawesome/free-solid-svg-icons";


const programmingLanguagesAndFrameworks: tileProps[] = [
    // TODO - add Typescript and Express.js icons but Font Awesome doesn't have it
    { icon: faJs, text: 'JavaScript' },
    { icon: faCode, text: 'TypeScript' },
    { icon: faGolang, text: 'Golang'},
    { icon: faNodeJs, text: 'Node.js' },
    { text: 'Express.js' },
    { icon: faReact, text: 'React' },
    { icon: faVuejs, text: 'Vue.js' },
    { icon: faHtml5, text: 'HTML' },
    { icon: faCss3, text: 'CSS' }
]

const tooling: tileProps[] = [
    { icon: faDatabase, text: 'DynamoDB' },
    { icon: faDatabase, text: 'MongoDB' },
    { icon: faDatabase, text: 'Postgress' },
    { icon: faAws },
    { icon: faCloud, text: 'Google Cloud' },
    { icon: faGithub, text: 'Github Actions' },
    { text: 'Kubernetes' },
    { icon: faShieldDog, text: 'DataDog' },
    { icon: faGitAlt, text: 'Git' }
]

interface tileProps {
    icon?: IconDefinition
    text?: string
}

const Tile = ({ icon, text }: tileProps) => {
    return (
        <div className="flex flex-col justify-center py-4 rounded-lg border border-gray-700">
            {icon && <FontAwesomeIcon
                icon={icon}
                className=""
                size="2xl"
            />}
            {text && <p className="pt-2 text-center">{text}</p>}
        </div>
    )
}

export default function Home() {
    const programmingLanguagesTiles = programmingLanguagesAndFrameworks.map(({ text, icon }) => <Tile text={text} icon={icon} key={text} />)
    const toolingTiles = tooling.map(({ text, icon }) => <Tile text={text} icon={icon} key={text}/>)

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
                <div className="flex justify-center pt-1 flex flex-row justify-around">
                    <a href="https://twitter.com/Devon_Bull" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon
                            icon={faTwitter}
                            size="lg"
                        />
                    </a>
                    <a href="https://github.com/DBULL7" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon
                            icon={faGithub}
                            size="lg"
                        />
                    </a>
                    <a href="https://www.linkedin.com/in/bulldevon" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon
                            icon={faLinkedin}
                            size="lg"
                        />
                    </a>
                </div>
            </div>
        </div>
        <div className="container mt-24 mx-auto md:px-64 py-4">
            <p className="text-2xl text-center">Hi there I'm Dev 👋</p>
            <p className="pt-2 text-center">I'm a Software Engineer</p>
        </div>
        <h3 className="text-2xl text-center mt-16">Programming Languages & Frameworks</h3>
        <div className="container max-w-screen-lg mx-auto px-16 md:px-32 lg:px-64 grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            { programmingLanguagesTiles }
        </div>
        <h3 className="text-2xl text-center mt-16">Tooling</h3>
        <div className="container max-w-screen-lg mx-auto px-16 md:px-32 lg:px-64 grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            { toolingTiles }
        </div>
    </main>
  )
}


