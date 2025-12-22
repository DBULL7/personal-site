import { format, parseISO } from 'date-fns'
import { allPosts } from 'contentlayer2/generated'
import { notFound } from 'next/navigation'
import { MDXContent } from '@/components/mdx-content'
import '@/css/prism.css'

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }))

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const post = allPosts.find((post) => post._raw.flattenedPath === slug)
  if (!post) throw new Error(`Post not found for slug: ${slug}`)
  return { title: post.title }
}

const PostLayout = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const post = allPosts.find((post) => post._raw.flattenedPath === slug)
  // 404 if the post does not exist.
  if (!post) notFound()

  return (
    <article className="prose mx-auto max-w-xl py-8 dark:prose-invert">
      <MDXContent code={post.body.code} postDate={format(parseISO(post.date), 'LLLL d, yyyy')} />
    </article>
  )
}

export default PostLayout
