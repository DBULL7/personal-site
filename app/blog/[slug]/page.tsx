import { format, parseISO } from 'date-fns'
import { allPosts } from 'contentlayer2/generated'
import { notFound } from 'next/navigation'
import { MDXContent } from '@/components/mdx-content'
import Link from 'next/link'
import type { Metadata } from 'next'
import styles from '@/app/editorial.module.css'
import '@/css/prism.css'

export const generateStaticParams = async () =>
  allPosts
    .filter((post) => post.draft !== true)
    .map((post) => ({ slug: post._raw.flattenedPath }))

export const generateMetadata = async ({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> => {
  const { slug } = await params
  const post = allPosts.find((post) => post._raw.flattenedPath === slug)
  if (!post || post.draft === true) notFound()
  return {
    title: `${post.title} | Devon Bull`,
    description: post.description,
    alternates: { canonical: post.path },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags
    }
  }
}

const PostLayout = async ({
  params
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params
  const post = allPosts.find((post) => post._raw.flattenedPath === slug)
  // 404 if the post does not exist.
  if (!post || post.draft === true) notFound()

  return (
    <main className={styles.articlePage}>
      <article className={styles.articleShell}>
        <div className={styles.articleTopline}>
          <Link href="/blog">
            <span aria-hidden="true">←</span> All field notes
          </Link>
          <span>{post.readingTime} min read</span>
        </div>
        <div className={styles.prose}>
          <MDXContent
            code={post.body.code}
            postDate={format(parseISO(post.date), 'LLLL d, yyyy')}
          />
        </div>
        <footer className={styles.articleFooter}>
          <Link href="/blog">
            <span aria-hidden="true">←</span> More field notes
          </Link>
          <Link href="/systems">
            Explore systems <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </article>
    </main>
  )
}

export default PostLayout
