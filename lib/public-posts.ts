import { allPosts } from 'contentlayer2/generated'

// Every public surface uses this list, including direct article URLs and feeds.
export const publicPosts = allPosts
  .filter((post) => post.draft !== true)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
