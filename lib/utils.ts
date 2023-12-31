import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import type { Document, MDX } from 'contentlayer/core'
import { Post } from 'contentlayer/generated'

const isProduction = process.env.NODE_ENV === 'production'

export type MDXDocument = Document & { body: MDX }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  [key: string]: any
}

export function genPageMetadata({
  title,
  description,
  image,
  ...rest
}: PageSEOProps): Metadata {
  return {
    title,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: './',
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: 'en_US',
      type: 'website'
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner]
    },
    ...rest
  }
}

export type MDXDocumentDate = MDXDocument & {
  date: string
}
export type MDXBlog = MDXDocumentDate & {
  tags?: string[]
  draft?: boolean
}

export type MDXAuthor = MDXDocument & {
  name: string
}

export function dateSortDesc(a: string, b: string) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

/**
 * Sorts a list of MDX documents by date in descending order
 *
 * @param {MDXDocumentDate[]} allBlogs
 * @param {string} [dateKey='date']
 * @return {*}
 */
export function sortPosts<T extends MDXDocumentDate>(
  allBlogs: T[],
  dateKey: string = 'date'
) {
  return allBlogs.sort((a, b) => dateSortDesc(a[dateKey], b[dateKey]))
}

/**
 * A typesafe omit helper function
 * @example omit(content, ['body', '_raw', '_id'])
 *
 * @param {Obj} obj
 * @param {Keys[]} keys
 * @return {*}  {Omit<Obj, Keys>}
 */
// export const omit = <Obj, Keys extends keyof Obj>(obj: Obj, keys: Keys[]): Omit<Obj, Keys> => {
//   const result = Object.assign({}, obj)
//   keys.forEach((key) => {
//     delete result[key]
//   })
//   return result
// }

// export type CoreContent<T> = Omit<T, 'body' | '_raw' | '_id'>
//
// /**
//  * Omit body, _raw, _id from MDX document and return only the core content
//  *
//  * @param {T} content
//  * @return {*}  {CoreContent<T>}
//  */
// export function coreContent<T extends MDXDocument>(content: T): CoreContent<T> {
//   return omit(content, ['body', '_raw', '_id'])
// }

/**
 * Omit body, _raw, _id from a list of MDX documents and returns only the core content
 * If `NODE_ENV` === "production", it will also filter out any documents with draft: true.
 *
 * @param {T[]} contents
 * @return {*}  {Post[]}
 */
export function allCoreContent<T extends MDXDocument>(
  contents: Post[]
): Post[] {
  if (isProduction)
    return contents
      .map((c) => c)
      .filter((c) => !('draft' in c && c.draft === true))
  return contents.map((c) => c)
}
