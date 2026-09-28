import type { Metadata } from 'next'
import { publicPosts } from '@/lib/public-posts'
import PostCard from '@/components/post-card'
import TagsSidebar from '@/components/tags-sidebar'

export const metadata: Metadata = {
  title: 'Writing',
  alternates: { canonical: '/blog' }
}

export default function Home() {
  return (
    <section className="mx-auto max-w-[980px] px-6 py-16">
      <h1 className="text-ink text-[40px] font-semibold tracking-[-0.022em]">
        Writing
      </h1>
      <div className="mt-12 flex flex-col gap-12 sm:flex-row sm:gap-16">
        <TagsSidebar />
        <ul className="min-w-0 flex-1">
          {publicPosts.map((post) => {
            return <PostCard key={post.path} {...post} />
          })}
        </ul>
      </div>
    </section>
  )
}
