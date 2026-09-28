import { slug } from 'github-slugger'
import { notFound } from 'next/navigation'
import ListLayout from './ListLayout'
import { publicPosts } from '@/lib/public-posts'

const tags = [...new Set(publicPosts.flatMap((post) => post.tags ?? []))]
export const dynamicParams = false

export const generateStaticParams = async () =>
  [...new Set(tags.map((tag) => slug(tag)))].map((tag) => ({ tag }))

export default async function TagPage({
  params
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const label = tags.find((item) => slug(item) === tag)
  if (!label) notFound()
  const posts = publicPosts.filter((post) =>
    post.tags?.some((item) => slug(item) === tag)
  )
  return (
    <ListLayout
      posts={posts}
      title={label.charAt(0).toUpperCase() + label.slice(1)}
    />
  )
}
