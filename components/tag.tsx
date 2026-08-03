import Link from 'next/link'
import { slug } from 'github-slugger'
import styles from '@/app/editorial.module.css'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => (
  <Link href={`/tags/${slug(text)}`} className={styles.tagChip}>
    {text.split(' ').join('-')}
  </Link>
)

export default Tag
