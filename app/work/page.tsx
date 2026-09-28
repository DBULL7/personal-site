import type { Metadata } from 'next'
import { WorkChapters } from '@/components/work-chapters'
import { profile } from '@/config/profile'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Engineering engagements at Apple and Chick-fil-A through Big Nerd Ranch, including cloud platforms, delivery integrations, and conversational software.',
  alternates: { canonical: '/work' }
}

export default function WorkPage() {
  return (
    <>
      <div className="mx-auto max-w-[980px] px-6 pt-16 pb-4 sm:pt-24">
        <p className="text-mute text-sm">
          {profile.name} · {profile.title}
        </p>
        <h1 className="mt-4 text-[48px] leading-tight font-semibold tracking-[-0.03em] sm:text-[72px]">
          The work, in detail.
        </h1>
        <p className="text-mute mt-6 max-w-[640px] text-[19px] leading-relaxed">
          Client engagements through {profile.employer}. My responsibilities,
          the systems involved, and the work behind them.
        </p>
        <nav
          aria-label="Engagements"
          className="mt-6 flex flex-wrap gap-x-6 gap-y-2"
        >
          {profile.engagements.map((entry) => (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              className="text-link inline-flex min-h-11 items-center text-sm hover:underline"
            >
              {entry.product}
            </a>
          ))}
        </nav>
      </div>
      <WorkChapters />
    </>
  )
}
