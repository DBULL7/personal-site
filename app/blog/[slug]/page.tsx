import { format, parseISO } from 'date-fns'
import { publicPosts } from '@/lib/public-posts'
import { notFound } from 'next/navigation'
import { MDXContent } from '@/components/mdx-content'
import '@/css/prism.css'

export const dynamicParams = false

export const generateStaticParams = async () =>
  publicPosts.map((post) => ({ slug: post._raw.flattenedPath }))

export const generateMetadata = async ({
  params
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params
  const post = publicPosts.find((post) => post._raw.flattenedPath === slug)
  if (!post) notFound()
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: post.path }
  }
}

const PostLayout = async ({
  params
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params
  const post = publicPosts.find((post) => post._raw.flattenedPath === slug)
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-[680px] px-6 py-16">
      <time
        dateTime={post.date}
        className="text-mute text-[12px] tracking-[0.04em]"
      >
        {format(parseISO(post.date), 'LLLL d, yyyy')}
      </time>
      <h1 className="text-ink mt-3 text-[40px] leading-[1.15] font-semibold tracking-[-0.022em]">
        {post.title}
      </h1>
      <div className="prose text-ink prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-ink prose-h2:mt-10 prose-h2:text-[28px] prose-p:text-[17px] prose-p:leading-[1.47] prose-p:text-ink prose-a:text-link prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-code:text-ink prose-li:text-ink mt-10 max-w-none [&>h1:first-child]:hidden [&>h1:first-child+time]:hidden">
        <MDXContent
          code={post.body.code}
          postDate={format(parseISO(post.date), 'LLLL d, yyyy')}
        />
      </div>
    </article>
  )
}

export default PostLayout
