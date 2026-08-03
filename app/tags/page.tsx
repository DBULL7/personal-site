import type { Metadata } from 'next'
import Link from 'next/link'
import { slug } from 'github-slugger'
import tagData from '@/app/tag-data.json'
import styles from '../editorial.module.css'

export const metadata: Metadata = {
  title: 'Topics | Devon Bull',
  description: 'Browse Devon Bull’s field notes by topic.',
  alternates: { canonical: '/tags' }
}

export default function TagsPage() {
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort(
    (a, b) => tagCounts[b] - tagCounts[a]
  )

  return (
    <main className={styles.page}>
      <div className={`${styles.shell} ${styles.allTags}`}>
        <div>
          <p className={styles.eyebrow}>Field note index</p>
          <h1>Browse by topic.</h1>
        </div>
        <div className={styles.tagCloud}>
          {sortedTags.length === 0 && (
            <p className={styles.empty}>No tags found.</p>
          )}
          {sortedTags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${slug(tag)}`}
              aria-label={`View ${tagCounts[tag]} posts tagged ${tag}`}
            >
              {tag}
              <span>{String(tagCounts[tag]).padStart(2, '0')}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
