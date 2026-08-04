'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { slug } from 'github-slugger'
import tagData from '@/app/tag-data.json'
import styles from '@/app/editorial.module.css'

function TagsSidebar() {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort(
    (a, b) => tagCounts[b] - tagCounts[a]
  )

  return (
    <nav className={styles.sidebar} aria-label="Filter field notes by tag">
      <Link
        href="/blog"
        className={styles.sidebarTitle}
        aria-current={pathname === '/blog' ? 'page' : undefined}
      >
        All field notes
      </Link>
      <ul className={styles.tagList}>
        {sortedTags.map((tag) => {
          const href = `/tags/${slug(tag)}`
          const isCurrent = pathname === href
          return (
            <li key={tag}>
              <Link
                href={href}
                className={isCurrent ? styles.tagCurrent : undefined}
                aria-current={isCurrent ? 'page' : undefined}
              >
                <span>{tag}</span>
                <span className={styles.tagCount}>{tagCounts[tag]}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default TagsSidebar
