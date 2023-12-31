/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import type { Post } from 'contentlayer/generated'
import Link from 'next/link'
import Tag from '@/components/tag'
// import { siteMetadata } from '@/data/siteMetaData'
import tagData from 'app/tag-data.json'
import TagsSidebar from "@/components/tags-sidebar";
import PostCard from "@/components/post-card";

interface PaginationProps {
    totalPages: number
    currentPage: number
}
interface ListLayoutProps {
    posts: Post[]
    title: string
    initialDisplayPosts?: Post[]
    pagination?: PaginationProps
}

// function Pagination({ totalPages, currentPage }: PaginationProps) {
//     const pathname = usePathname()
//     const basePath = pathname.split('/')[1]
//     const prevPage = currentPage - 1 > 0
//     const nextPage = currentPage + 1 <= totalPages
//
//     return (
//         <div className="space-y-2 pb-8 pt-6 md:space-y-5">
//             <nav className="flex justify-between">
//                 {!prevPage && (
//                     <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
//                         Previous
//                     </button>
//                 )}
//                 {prevPage && (
//                     <Link
//                         href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
//                         rel="prev"
//                     >
//                         Previous
//                     </Link>
//                 )}
//                 <span>
//           {currentPage} of {totalPages}
//         </span>
//                 {!nextPage && (
//                     <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
//                         Next
//                     </button>
//                 )}
//                 {nextPage && (
//                     <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
//                         Next
//                     </Link>
//                 )}
//             </nav>
//         </div>
//     )
// }

export default function ListLayoutWithTags({
                                               posts,
                                               title,
                                               initialDisplayPosts = [],
                                               pagination,
                                           }: ListLayoutProps) {
    const pathname = usePathname()
    const tagCounts = tagData as Record<string, number>
    const tagKeys = Object.keys(tagCounts)
    const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

    const filteredPosts = posts.filter((post) => post.draft !== true)

    return (
        <section className="mx-auto max-w-3xl px-4 dark:prose-invert sm:px-6 xl:max-w-5xl xl:px-0">
            <main className="mb-auto">
                <div className="pb-6 pt-6">
                    <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                        {title}
                    </h1>
                </div>
                <div className="flex sm:space-x-24">
                        <TagsSidebar/>
                        <div>
                            <ul>
                                {filteredPosts.map((post) => {
                                    return <PostCard key={post.path} {...post} />
                                })}
                            </ul>
                            {/*{pagination && pagination.totalPages > 1 && (*/}
                            {/*    <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />*/}
                            {/*)}*/}
                        </div>
                </div>
            </main>
        </section>
    )
}