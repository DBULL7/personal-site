import type { MetadataRoute } from 'next'
import { allPosts } from 'contentlayer2/generated'
import { slug } from 'github-slugger'
import tagData from '@/app/tag-data.json'

const baseUrl = 'https://devonbull.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/career', '/systems', '/orbital', '/blog', '/tags'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date('2026-08-03'),
      changeFrequency:
        route === '' ? ('monthly' as const) : ('yearly' as const),
      priority: route === '' ? 1 : route === '/blog' ? 0.7 : 0.8
    })
  )

  const posts = allPosts
    .filter((post) => post.draft !== true)
    .map((post) => ({
      url: `${baseUrl}${post.path}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6
    }))

  const tags = Object.keys(tagData).map((tag) => ({
    url: `${baseUrl}/tags/${slug(tag)}`,
    lastModified: new Date('2026-08-03'),
    changeFrequency: 'yearly' as const,
    priority: 0.4
  }))

  return [...routes, ...posts, ...tags]
}
