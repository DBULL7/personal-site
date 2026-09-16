import { Post } from 'contentlayer2/generated'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import Tag from '@/components/tag'

function PostCard(post: Post) {
  const { path, date, title, description, tags } = post
  return (
    <li
      key={path}
      className="border-b border-black/10 py-8 last:border-b-0 dark:border-white/15"
    >
      <article>
        <time
          dateTime={date}
          className="text-mute text-[12px] tracking-[0.04em]"
        >
          {format(parseISO(post.date), 'LLLL d, yyyy')}
        </time>
        <h2 className="mt-2 text-[28px] leading-[1.15] font-semibold tracking-[-0.02em]">
          <Link href={path} className="text-ink hover:text-mute">
            {title}
          </Link>
        </h2>
        {tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        ) : null}
        {description ? (
          <p className="text-mute mt-3 text-[17px] leading-[1.47]">
            {description}
          </p>
        ) : null}
      </article>
    </li>
  )
}

export default PostCard
