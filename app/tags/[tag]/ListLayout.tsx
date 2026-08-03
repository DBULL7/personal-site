import type { Post } from 'contentlayer2/generated'
import PostCard from '@/components/post-card'
import TagsSidebar from '@/components/tags-sidebar'
import styles from '@/app/editorial.module.css'

interface ListLayoutProps {
  posts: Post[]
  title: string
}

export default function ListLayoutWithTags({ posts, title }: ListLayoutProps) {
  const publishedPosts = posts.filter((post) => post.draft !== true)

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.tagHero}>
          <div>
            <p className={styles.eyebrow}>Field notes · topic</p>
            <h1>{title}</h1>
          </div>
          <p>Published notes connected to this topic.</p>
        </header>
        <div className={styles.content}>
          <TagsSidebar />
          <section
            className={styles.posts}
            aria-label={`Field notes tagged ${title}`}
          >
            {publishedPosts.length ? (
              <ul className={styles.postList}>
                {publishedPosts.map((post) => (
                  <PostCard key={post.path} {...post} />
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>No published notes for this topic.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
