"use client"

import {usePathname} from "next/navigation";
import tagData from "@/app/tag-data.json";
import Link from "next/link";
import {slug} from "github-slugger";

function TagsSidebar() {
    const pathname = usePathname()
    const tagCounts = tagData as Record<string, number>
    const tagKeys = Object.keys(tagCounts)
    const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

    return (
        <div className="hidden max-h-screen h-full sm:flex flex-wrap bg-gray-50 dark:bg-gray-900/70 shadow-md pt-5 dark:shadow-gray-800/40 rounded min-w-[280px] max-w-[280px] overflow-auto">
            <div className="py-4 px-6">
                {pathname?.startsWith('/blog') ? (
                    <h3 className="text-primary-500 font-bold uppercase">All Posts</h3>
                ) : (
                    <Link
                        href={`/blog`}
                        className="font-bold uppercase text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-500"
                    >
                        All Posts
                    </Link>
                )}
                <ul>
                    {sortedTags.map((t) => {
                        return (
                            <li key={t} className="my-3">
                                {pathname?.split('/tags/')[1] === slug(t) ? (
                                    <h3 className="inline py-2 px-3 uppercase text-sm font-bold text-primary-500">
                                        {`${t} (${tagCounts[t]})`}
                                    </h3>
                                ) : (
                                    <Link
                                        href={`/tags/${slug(t)}`}
                                        className="py-2 px-3 uppercase text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-500"
                                        aria-label={`View posts tagged ${t}`}
                                    >
                                        {`${t} (${tagCounts[t]})`}
                                    </Link>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default TagsSidebar
