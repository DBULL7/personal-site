import { Post } from "contentlayer/generated"
import { format, parseISO } from "date-fns"
import Link from "next/link"
import Tag from "@/components/tag"

function PostCard(post: Post) {
    const { path, date, title, description, tags } = post
    return (
        <li key={path} className="py-5">
            <article className="space-y-2 flex flex-col xl:space-y-0">
                <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{format(parseISO(post.date), 'LLLL d, yyyy')}</time>
                    </dd>
                </dl>
                <div className="space-y-3">
                    <div>
                        <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link href={path} className="text-gray-900 hover:text-indigo-500 dark:text-gray-100 dark:hover:text-sky-500">
                                {title}
                            </Link>
                        </h2>
                        <div className="flex flex-wrap">
                            {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                        </div>
                    </div>
                    <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {description}
                    </div>
                </div>
            </article>
        </li>
    )
}

export default PostCard