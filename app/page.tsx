import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero } from '@/components/hero'
import { SelectedWork } from '@/components/selected-work'
import PostCard from '@/components/post-card'
import { publicPosts } from '@/lib/public-posts'
import { profileJsonLd } from '@/lib/public-profile'

export const metadata: Metadata = {
  alternates: { canonical: '/' }
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profileJsonLd).replace(/</g, '\\u003c')
        }}
      />
      <Hero />
      <SelectedWork />
      {publicPosts.length > 0 ? (
        <section
          aria-labelledby="latest-writing"
          className="mx-auto max-w-[980px] px-6 py-16 sm:py-20"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2
              id="latest-writing"
              className="text-[36px] font-semibold tracking-[-0.03em] sm:text-[48px]"
            >
              Beyond the day job.
            </h2>
            <Link
              className="text-link inline-flex min-h-11 items-center text-sm hover:underline"
              href="/blog"
            >
              All writing{' '}
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          </div>
          <ul className="mt-4 max-w-[680px]">
            {publicPosts.slice(0, 2).map((post) => (
              <PostCard key={post.path} {...post} />
            ))}
          </ul>
        </section>
      ) : null}
    </>
  )
}
