import Link from 'next/link'
import { profile } from '@/config/profile'

const selectedIds = ['cloud-console', 'delivery-integrations']

export function SelectedWork() {
  const engagements = selectedIds.map(
    (id) => profile.engagements.find((entry) => entry.id === id)!
  )
  return (
    <section
      aria-labelledby="selected-work"
      className="border-border border-y bg-white dark:bg-[#111113]"
    >
      <div className="mx-auto max-w-[980px] px-6 py-16 sm:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2
            id="selected-work"
            className="text-[36px] font-semibold tracking-[-0.03em] sm:text-[48px]"
          >
            Selected work.
          </h2>
          <Link
            href="/work"
            className="text-link inline-flex min-h-11 items-center text-sm hover:underline"
          >
            All engagements{' '}
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </Link>
        </div>
        <p className="text-mute mt-3 text-[17px]">
          Client engagements through {profile.employer}.
        </p>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-14">
          {engagements.map((entry) => (
            <article key={entry.id} className="border-border border-t pt-7">
              <p className="text-mute text-sm">
                {entry.client} · {entry.role}
              </p>
              <h3 className="mt-4 text-[28px] leading-tight font-semibold tracking-[-0.02em]">
                {entry.product}
              </h3>
              <p className="text-mute mt-4 text-[17px] leading-relaxed">
                {entry.summary}
              </p>
              <Link
                href={`/work#${entry.id}`}
                aria-label={`Responsibilities and details: ${entry.product}`}
                className="text-link mt-5 inline-flex min-h-11 items-center text-sm hover:underline"
              >
                Responsibilities and details{' '}
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
