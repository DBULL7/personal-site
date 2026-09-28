import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="text-link text-[12px] font-medium tracking-[0.04em] hover:underline"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
