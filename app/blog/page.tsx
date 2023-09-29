import { compareDesc } from 'date-fns'
import { allPosts } from 'contentlayer/generated'
import PostCard from '@/components/post-card'
import TagsSidebar from '@/components/tags-sidebar'

export default function Home() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  )
  const filteredPosts = posts.filter((post) => post.draft !== true)

  return (
    <section className="mx-auto max-w-3xl px-4 dark:prose-invert sm:px-6 xl:max-w-5xl xl:px-0">
      <main className="mb-auto">
        <div className="pb-6 pt-6">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Latest and Greatest
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <TagsSidebar />
          <div>
            <ul>
              {filteredPosts.map((post) => {
                return <PostCard key={post.path} {...post} />
              })}
            </ul>
            {/*{pagination && pagination.totalPages > 1 && (*/}
            {/*    <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />*/}
            {/*)}*/}
          </div>
        </div>
      </main>
    </section>
  )
}
