import { slug } from 'github-slugger'
import ListLayout from './ListLayout'
import { allPosts } from 'contentlayer2/generated'
import tagData from 'app/tag-data.json'
import { allCoreContent, sortPosts } from '@/lib/utils'

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const paths = tagKeys.map((tag) => ({
    tag: encodeURI(tag)
  }))
  return paths
}

export default async function TagPage({
  params
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag: tagParam } = await params
  const tag = decodeURI(tagParam)
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(
      allPosts.filter(
        (post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)
      )
    )
  )
  return <ListLayout posts={filteredPosts} title={title} />
}
