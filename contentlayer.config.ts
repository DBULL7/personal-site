// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import { writeFileSync } from 'fs'
import BananaSlug from 'github-slugger'

// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrismPlus from 'rehype-prism-plus'
// remark packages
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

const isProduction = process.env.NODE_ENV === 'production'

// Estimated reading speed: 200 words per minute
const readingSpeed = 200

const estimateReadingTime = (text: string): number => {
  const wordCount = text.split(/\s+/).length
  return Math.ceil(wordCount / readingSpeed)
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    draft: { type: 'boolean', required: false },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    tldr: { type: 'string', required: false },
    description: { type: 'string', required: true }
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.flattenedPath}`
    },
    readingTime: {
      type: 'json',
      resolve: (doc) => estimateReadingTime(doc.body.raw)
    },
    path: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.flattenedPath}`
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, '')
    }
  }
}))

/**
 * Count the occurrences of all tags across blog posts and write to json file
 */
function createTagCount(allPosts: any) {
  const bananaSlug = new BananaSlug()
  const tagCount: Record<string, number> = {}
  allPosts.forEach((file: any) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      file.tags.forEach((tag: any) => {
        const formattedTag = bananaSlug.slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  writeFileSync('./app/tag-data.json', JSON.stringify(tagCount))
}

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }]
    ]
  },
  onSuccess: async (importData) => {
    const { allPosts } = await importData()
    createTagCount(allPosts)
  }
})
