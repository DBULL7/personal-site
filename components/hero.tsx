import Link from 'next/link'
import { profile } from '@/config/profile'

export function Hero() {
  return (
    <section className="mx-auto flex min-h-[65svh] w-full max-w-[980px] flex-col justify-center px-6 py-20 sm:py-28">
      <p className="text-mute text-sm font-medium">
        {profile.title} · {profile.employer}
      </p>
      <h1 className="text-ink mt-5 text-[56px] leading-[1.05] font-semibold tracking-[-0.045em] sm:text-[96px]">
        {profile.name}
      </h1>
      <p className="text-ink mt-8 max-w-[620px] text-[24px] leading-[1.35] tracking-[-0.015em] sm:text-[32px]">
        Architecture, delivery, and everything that comes after.
      </p>
      <p className="text-mute mt-5 max-w-[600px] text-[18px] leading-relaxed">
        {profile.introduction}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
        <Link
          href="/work"
          className="bg-link inline-flex min-h-11 items-center rounded-full px-6 text-[15px] text-white hover:opacity-85 dark:text-black"
        >
          Explore my work
        </Link>
        <Link
          href="/blog"
          className="text-link inline-flex min-h-11 items-center text-[15px] hover:underline"
        >
          Read my writing{' '}
          <span aria-hidden="true" className="ml-2">
            ↗
          </span>
        </Link>
      </div>
    </section>
  )
}
