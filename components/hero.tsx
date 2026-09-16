import Link from 'next/link'

import { profile } from '@/config/profile'

export function Hero() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-44px)] w-full max-w-[980px] flex-col justify-center px-6 py-24">
      <p className="text-mute text-[12px] font-semibold tracking-[0.08em] uppercase">
        {profile.title}
      </p>
      <h1 className="text-ink mt-4 text-[40px] leading-[1.07] font-semibold tracking-[-0.022em] sm:text-[80px]">
        {profile.name}
      </h1>
      <p className="text-mute mt-6 max-w-[620px] text-[21px] leading-[1.38]">
        {profile.introduction}
      </p>
      <p className="text-ink mt-5 text-[17px]">{profile.employer}</p>
      <p className="mt-10 flex gap-8 text-[17px]">
        <a href="#work" className="text-link hover:underline">
          Work
        </a>
        <Link href="/blog" className="text-link hover:underline">
          Blog
        </Link>
      </p>
    </section>
  )
}
