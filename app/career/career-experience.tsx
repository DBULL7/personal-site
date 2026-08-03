'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import styles from './career.module.css'

const SpaceScene = dynamic(
  () =>
    import('@/components/space/space-scene').then(
      (module) => module.SpaceScene
    ),
  {
    ssr: false,
    loading: () => <div className={styles.sceneFallback} aria-hidden="true" />
  }
)

const chapters = {
  origin: {
    number: '00',
    nav: 'Profile',
    eyebrow: 'Current trajectory',
    title: 'Devon Bull',
    meta: 'Senior software engineer · Raleigh, NC',
    text: 'Former tech entrepreneur turned engineer. I build dependable software, learn new domains quickly, and translate between product ambition and technical reality.'
  },
  consulting: {
    number: '01',
    nav: 'Consulting',
    eyebrow: 'Primary arc',
    title: 'Consulting engineer',
    meta: 'One firm · many problem spaces',
    text: 'Consulting taught me to arrive curious, earn context quickly, and create momentum inside established teams. The craft is making strong engineering fit the client and the operating environment.'
  },
  apple: {
    number: '02',
    nav: 'Apple',
    eyebrow: 'Client system / 01',
    title: 'Apple',
    meta: 'Embedded engineering engagement',
    text: 'Contributed to embedded work where hardware and software had to behave as a single, reliable product. The constraints rewarded precision, disciplined collaboration, and an eye for performance.'
  },
  chickfila: {
    number: '03',
    nav: 'Chick-fil-A',
    eyebrow: 'Client system / 02',
    title: 'Chick-fil-A',
    meta: 'Embedded operational systems',
    text: 'Worked on embedded solutions in an operational environment—connecting physical systems, production software, and the people who rely on both every day.'
  },
  platforms: {
    number: '04',
    nav: 'Range',
    eyebrow: 'Extended range',
    title: 'Full-stack platforms',
    meta: 'Web · cloud · data · delivery',
    text: 'Beyond embedded systems, I work across TypeScript, React, Node, Go, cloud services, databases, CI/CD, and observability. I like understanding the whole path from interface to infrastructure.'
  },
  leadership: {
    number: '05',
    nav: 'Leadership',
    eyebrow: 'How I operate',
    title: 'Calm, curious leadership',
    meta: 'Teams · clients · systems',
    text: 'I do my best work where the problem is ambiguous and the stakes are real: asking useful questions, bringing structure to uncertainty, and helping a team move without unnecessary drama.'
  },
  future: {
    number: '06',
    nav: 'Next',
    eyebrow: 'Unresolved signal',
    title: 'The next hard thing',
    meta: 'Status · open to contact',
    text: 'I am most interested in ambitious products, thoughtful teams, and work that expands what people believe software can do. If that sounds familiar, I would love to compare notes.'
  }
} as const

type ChapterId = keyof typeof chapters

const principles = [
  {
    number: '01',
    title: 'Earn context',
    text: 'Arrive curious, learn the operating environment, and understand the constraints before prescribing a solution.'
  },
  {
    number: '02',
    title: 'Connect the system',
    text: 'Treat product goals, hardware, software, delivery, and the people using the system as one engineering problem.'
  },
  {
    number: '03',
    title: 'Create calm momentum',
    text: 'Bring useful questions and enough structure to move an ambiguous problem forward without adding drama.'
  }
] as const

export function CareerExperience() {
  const [active, setActive] = useState<ChapterId>('origin')
  const select = useCallback((id: string) => {
    if (id in chapters) setActive(id as ChapterId)
  }, [])
  const chapter = chapters[active]

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="career-title">
        <SpaceScene mode="career" onNodeSelect={select} />
        <div className={styles.heroShade} aria-hidden="true" />

        <div className={styles.heroHeading}>
          <p className={styles.eyebrow}>Career constellation · 002</p>
          <h1 id="career-title">One career. Many systems.</h1>
          <p>
            A former tech entrepreneur turned senior software engineer, working
            from embedded systems to cloud platforms—and translating between
            ambitious products and the realities that make them dependable.
          </p>
          <a className={styles.readLink} href="#career-narrative">
            Read the complete narrative <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className={styles.explorer}>
          <nav className={styles.chapterNav} aria-label="Career chapters">
            {Object.entries(chapters).map(([id, item]) => (
              <button
                key={id}
                type="button"
                className={
                  active === id
                    ? styles.chapterButtonActive
                    : styles.chapterButton
                }
                onClick={() => setActive(id as ChapterId)}
                aria-pressed={active === id}
              >
                <span>{item.number}</span>
                {item.nav}
              </button>
            ))}
          </nav>

          <article
            className={styles.activeChapter}
            aria-live="polite"
            aria-atomic="true"
          >
            <p className={styles.panelEyebrow}>{chapter.eyebrow}</p>
            <div className={styles.chapterTitleRow}>
              <span>{chapter.number}</span>
              <h2>{chapter.title}</h2>
            </div>
            <p className={styles.chapterMeta}>{chapter.meta}</p>
            <p className={styles.chapterText}>{chapter.text}</p>
          </article>
        </div>

        <p className={styles.visualNote}>
          Spatial map is optional. Every chapter appears in plain text below.
        </p>
      </section>

      <section
        id="career-narrative"
        className={styles.narrative}
        aria-labelledby="narrative-title"
      >
        <div className={styles.sectionIntro}>
          <div>
            <p className={styles.eyebrow}>Career · in plain text</p>
            <h2 id="narrative-title">The legible version.</h2>
          </div>
          <p>
            I have worked for one contracting firm across different client and
            technical contexts. That path built range without losing the
            through-line: understand the whole system, then make it more
            dependable.
          </p>
        </div>

        <div className={styles.evidenceGrid}>
          <article
            className={`${styles.evidenceCard} ${styles.evidenceCardPrimary}`}
          >
            <div className={styles.cardTopline}>
              <span>Foundation</span>
              <span>Former tech entrepreneur</span>
            </div>
            <div>
              <h3>Product ambition with engineering discipline.</h3>
              <p>
                Entrepreneurship shaped how I frame problems and weigh
                tradeoffs. Engineering became the way I turn that product
                perspective into reliable systems a team can operate and
                improve.
              </p>
            </div>
          </article>

          <article className={styles.evidenceCard}>
            <div className={styles.cardTopline}>
              <span>Client engagement</span>
              <span>Embedded</span>
            </div>
            <div>
              <h3>Apple</h3>
              <p>{chapters.apple.text}</p>
            </div>
          </article>

          <article className={styles.evidenceCard}>
            <div className={styles.cardTopline}>
              <span>Client engagement</span>
              <span>Embedded operations</span>
            </div>
            <div>
              <h3>Chick-fil-A</h3>
              <p>{chapters.chickfila.text}</p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.range} aria-labelledby="range-title">
        <div className={styles.rangeHeading}>
          <div>
            <p className={styles.eyebrow}>Engineering range</p>
            <h2 id="range-title">
              From device constraints to delivery systems.
            </h2>
          </div>
          <p>
            Embedded work is a defining part of the story, not the boundary. I
            also work across application, platform, cloud, data, delivery, and
            observability concerns.
          </p>
        </div>
        <div
          className={styles.rangeBands}
          aria-label="Areas of engineering experience"
        >
          <div>
            <span>01</span>
            <strong>Embedded systems</strong>
            <small>Hardware + software</small>
          </div>
          <div>
            <span>02</span>
            <strong>Product applications</strong>
            <small>TypeScript + React + Node</small>
          </div>
          <div>
            <span>03</span>
            <strong>Services & data</strong>
            <small>Go + databases</small>
          </div>
          <div>
            <span>04</span>
            <strong>Platforms</strong>
            <small>Cloud + CI/CD + observability</small>
          </div>
        </div>
      </section>

      <section className={styles.principles} aria-labelledby="principles-title">
        <div className={styles.principlesHeading}>
          <p className={styles.eyebrow}>Operating principles</p>
          <h2 id="principles-title">
            How I work when the answer is not obvious.
          </h2>
        </div>
        <div className={styles.principleGrid}>
          {principles.map((principle) => (
            <article key={principle.number}>
              <span>{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.nextSignal} aria-labelledby="next-title">
        <div>
          <p className={styles.eyebrow}>Next signal</p>
          <h2 id="next-title">
            Ambitious products. Thoughtful teams. Hard systems.
          </h2>
        </div>
        <div className={styles.nextCopy}>
          <p>{chapters.future.text}</p>
          <div className={styles.nextLinks}>
            <Link href="/systems">
              Explore technical range <span aria-hidden="true">→</span>
            </Link>
            <a
              href="https://www.linkedin.com/in/bulldevon"
              target="_blank"
              rel="noreferrer"
            >
              Connect on LinkedIn{' '}
              <span className="sr-only">(opens in a new tab)</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
