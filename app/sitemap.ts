import type { MetadataRoute } from 'next'
import { slug } from 'github-slugger'
import { siteConfig } from '@/config/site'
import { publicPosts } from '@/lib/public-posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const tags = [
    ...new Set(
      publicPosts.flatMap((post) => post.tags ?? []).map((tag) => slug(tag))
    )
  ]
  return [
    ...[
      '/',
      '/work',
      '/blog',
      '/tags',
      ...tags.map((tag) => `/tags/${tag}`)
    ].map((path) => ({
      url: new URL(path, siteConfig.url).href
    })),
    ...publicPosts.map((post) => ({
      url: new URL(post.path, siteConfig.url).href
    }))
  ]
}
