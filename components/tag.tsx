import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
    text: string
}

const Tag = ({ text }: Props) => {
    return (
        <Link
            href={`/tags/${slug(text)}`}
            className="mr-3 text-sm font-medium uppercase text-indigo-500 hover:text-indigo-800 dark:text-sky-500 dark:hover:text-sky-700"
        >
            {text.split(' ').join('-')}
        </Link>
    )
}

export default Tag