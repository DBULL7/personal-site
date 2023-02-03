import Image from 'next/image'
import { Inter } from '@next/font/google'
import profilePic from '../public/profile_pic.jpg'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
        <div className="container mx-auto flex justify-center">
            <div className="pt-24">
                <div>
                    <Image
                        src={profilePic}
                        alt={"Picture of Devon"}
                        className="rounded-full"
                        height={200}
                        width={200}
                    />
                </div>
                <div className="flex justify-center py-4">
                    <h1 className="dark:text-blue-500 text-4xl font-bold ">
                        Devon Bull
                    </h1>
                </div>
                <div className="flex justify-center pt-1 flex flex-row justify-around">
                    <a href="https://twitter.com/Devon_Bull" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faTwitter} className="dark:text-blue-500"/>
                    </a>
                    <a href="https://github.com/DBULL7" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faGithub} className="dark:text-white"/>
                    </a>
                    <a href="https://www.linkedin.com/in/bulldevon" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} className="dark:text-yellow-500"/>
                    </a>
                </div>
            </div>
        </div>
        {/*<div className="border border-yellow-500 dark:text-white flex flex-row justify-around items-center">*/}
        {/*    <div className="w-1/3 text-center border border-green-500">*/}
        {/*        <h3 className="text-lg font-medium">Frontend</h3>*/}
        {/*    </div>*/}
        {/*    <div className="w-1/3 text-center border border-indigo-500">*/}
        {/*        <h3 className="text-lg font-medium">Backend</h3>*/}
        {/*    </div>*/}
        {/*    <div className="w-1/3 text-center border border-r-blue-700">*/}
        {/*        <h3 className="text-lg font-medium">Technical Lead</h3>*/}
        {/*    </div>*/}
        {/*</div>*/}
    </main>
  )
}
