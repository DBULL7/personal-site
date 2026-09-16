'use client'

import { usePathname } from 'next/navigation'
import tagData from '@/app/tag-data.json'
import Link from 'next/link'
import { slug } from 'github-slugger'

function TagsSidebar() {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <aside className="w-full shrink-0 sm:w-[200px]">
      <Link
        href="/blog"
        className="text-ink text-[12px] font-semibold tracking-[0.08em] uppercase"
      >
        All posts
      </Link>
      <ul className="mt-4">
        {sortedTags.map((t) => {
          const active = pathname?.split('/tags/')[1] === slug(t)
          return (
            <li key={t} className="py-1.5">
              {active ? (
                <span className="text-ink text-[14px]">
                  {`${t} (${tagCounts[t]})`}
                </span>
              ) : (
                <Link
                  href={`/tags/${slug(t)}`}
                  className="text-mute hover:text-ink text-[14px]"
                  aria-label={`View posts tagged ${t}`}
                >
                  {`${t} (${tagCounts[t]})`}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default TagsSidebar
