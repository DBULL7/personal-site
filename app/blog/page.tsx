import type { Metadata } from 'next'
import { compareDesc } from 'date-fns'
import { allPosts } from 'contentlayer2/generated'
import PostCard from '@/components/post-card'
import TagsSidebar from '@/components/tags-sidebar'
import styles from '../editorial.module.css'

export const metadata: Metadata = {
  title: 'Field Notes | Devon Bull',
  description:
    'Field notes from Devon Bull about software, hardware, experiments, and learning by making.',
  alternates: { canonical: '/blog' }
}

export default function BlogPage() {
  const posts = [...allPosts]
    .filter((post) => post.draft !== true)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Field notes</p>
            <h1>Learning in public.</h1>
          </div>
          <p>
            Experiments, hardware, software, and the practical lessons that only
            show up once something is being built.
          </p>
        </header>
        <div className={styles.content}>
          <TagsSidebar />
          <section className={styles.posts} aria-label="Published field notes">
            {posts.length ? (
              <ul className={styles.postList}>
                {posts.map((post) => (
                  <PostCard key={post.path} {...post} />
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>No published notes yet.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
