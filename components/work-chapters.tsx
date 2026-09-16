import Image from 'next/image'

import { profile, type Engagement } from '@/config/profile'

function ClientMark({ engagement }: { engagement: Engagement }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      {engagement.logoSrc ? (
        <Image
          src={engagement.logoSrc}
          alt=""
          width={28}
          height={28}
          className="h-7 w-auto"
        />
      ) : null}
      <p className="text-[12px] font-semibold tracking-[0.08em] uppercase opacity-70">
        {engagement.client}
      </p>
    </div>
  )
}

export function WorkChapters() {
  return (
    <div id="work" className="scroll-mt-[44px]">
      {profile.engagements.map((engagement, index) => {
        const inverted = index % 2 === 1
        return (
          <section
            key={engagement.id}
            className={inverted ? 'bg-black text-white' : 'bg-canvas text-ink'}
          >
            <div className="mx-auto max-w-[980px] px-6 py-24 sm:py-32">
              <ClientMark engagement={engagement} />
              <p className="text-[12px] text-current opacity-70">
                {engagement.period}
              </p>
              <h2 className="mt-3 text-[40px] leading-[1.07] font-semibold tracking-[-0.022em] sm:text-[64px]">
                {engagement.product}
              </h2>
              <p className="mt-5 max-w-[640px] text-[19px] leading-[1.47] opacity-80">
                {engagement.embeddedLine}
              </p>
              <p className="mt-3 text-[15px] opacity-70">
                {engagement.role} · {engagement.employer}
              </p>
              <p className="mt-8 max-w-[640px] text-[17px] leading-[1.47] opacity-90">
                {engagement.summary}
              </p>
              <ul className="mt-8 max-w-[640px] list-disc space-y-2 pl-5 text-[17px] leading-[1.47] opacity-90">
                {engagement.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        )
      })}
    </div>
  )
}
