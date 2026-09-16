import { compareDesc } from 'date-fns'
import { allPosts } from 'contentlayer2/generated'
import PostCard from '@/components/post-card'
import TagsSidebar from '@/components/tags-sidebar'

export default function Home() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  )
  const filteredPosts = posts.filter((post) => post.draft !== true)

  return (
    <section className="mx-auto max-w-[980px] px-6 py-16">
      <h1 className="text-ink text-[40px] font-semibold tracking-[-0.022em]">
        Writing
      </h1>
      <div className="mt-12 flex flex-col gap-12 sm:flex-row sm:gap-16">
        <TagsSidebar />
        <ul className="min-w-0 flex-1">
          {filteredPosts.map((post) => {
            return <PostCard key={post.path} {...post} />
          })}
        </ul>
      </div>
    </section>
  )
}
