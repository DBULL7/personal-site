import Link from 'next/link'
import Tag from '@/components/tag'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <section className="mx-auto max-w-[980px] px-6 py-16">
      <h1 className="text-ink text-[40px] font-semibold tracking-[-0.022em]">
        Tags
      </h1>
      <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
        {tagKeys.length === 0 && <p className="text-mute">No tags found.</p>}
        {sortedTags.map((t) => {
          return (
            <div key={t} className="flex items-baseline gap-1">
              <Tag text={t} />
              <Link
                href={`/tags/${slug(t)}`}
                className="text-mute text-[14px]"
                aria-label={`View posts tagged ${t}`}
              >
                {`(${tagCounts[t]})`}
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
