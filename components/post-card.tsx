import type { Post } from 'contentlayer2/generated'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import Tag from '@/components/tag'
import styles from '@/app/editorial.module.css'

function PostCard(post: Post) {
  const { path, date, title, description, tags, readingTime } = post

  return (
    <li className={styles.postCard}>
      <article>
        <div className={styles.postMeta}>
          <time dateTime={date}>{format(parseISO(date), 'LLLL d, yyyy')}</time>
          <span>{readingTime} min read</span>
        </div>
        <h2>
          <Link href={path}>{title}</Link>
        </h2>
        <p className={styles.postDescription}>{description}</p>
        <div className={styles.postFooter}>
          <div className={styles.tagChips} aria-label="Tags">
            {tags?.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
          <Link
            className={styles.readMore}
            href={path}
            aria-label={`Read ${title}`}
          >
            Read note <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    </li>
  )
}

export default PostCard
