'use client'

import { useCallback, useState } from 'react'
import { SpaceScene } from '@/components/space/space-scene'
import styles from '../space-experiences.module.css'

const chapters = {
  origin: {
    eyebrow: 'Current trajectory',
    title: 'Devon Bull',
    meta: 'Senior software engineer · Raleigh, NC',
    text: 'Former tech entrepreneur turned engineer. I build dependable software, learn new domains quickly, and enjoy translating between product ambition and technical reality.'
  },
  consulting: {
    eyebrow: 'Primary arc',
    title: 'Consulting engineer',
    meta: 'One firm · many problem spaces',
    text: 'Consulting taught me to arrive curious, earn context quickly, and create momentum inside established teams. The real craft is making strong engineering fit the client, not the other way around.'
  },
  apple: {
    eyebrow: 'Client system / 01',
    title: 'Apple',
    meta: 'Embedded engineering engagement',
    text: 'Contributed to embedded work where hardware and software had to behave as a single, reliable product. The constraints rewarded precision, disciplined collaboration, and an eye for performance.'
  },
  chickfila: {
    eyebrow: 'Client system / 02',
    title: 'Chick-fil-A',
    meta: 'Embedded operational systems',
    text: 'Worked on embedded solutions in an operational environment—connecting physical systems, production software, and the people who rely on both every day.'
  },
  leadership: {
    eyebrow: 'How I operate',
    title: 'Calm, curious leadership',
    meta: 'Teams · clients · systems',
    text: 'I do my best work where the problem is ambiguous and the stakes are real: asking useful questions, bringing structure to uncertainty, and helping a team move without creating unnecessary drama.'
  },
  platforms: {
    eyebrow: 'Extended range',
    title: 'Full-stack platforms',
    meta: 'Web · cloud · data · delivery',
    text: 'Beyond embedded systems, I work across TypeScript, React, Node, Go, cloud services, databases, CI/CD, and observability. I like understanding the whole path from interface to infrastructure.'
  },
  future: {
    eyebrow: 'Unresolved signal',
    title: 'The next hard thing',
    meta: 'Status · open to contact',
    text: 'I am most interested in ambitious products, thoughtful teams, and work that expands what people believe software can do. If that sounds familiar, I would love to compare notes.'
  }
} as const

type ChapterId = keyof typeof chapters

export function CareerExperience() {
  const [active, setActive] = useState<ChapterId>('origin')
  const select = useCallback((id: string) => {
    if (id in chapters) setActive(id as ChapterId)
  }, [])
  const chapter = chapters[active]

  return (
    <main className={styles.page}>
      <section className={styles.careerHero}>
        <SpaceScene mode="career" onNodeSelect={select} />
        <div className={styles.sceneHeading}>
          <p className={styles.eyebrow}>Career constellation · 002</p>
          <h1 className={styles.sceneTitle}>A map of the work.</h1>
          <p className={styles.sceneInstructions}>Select a signal in the scene or use the chapter index below.</p>
        </div>
        <article className={styles.infoPanel} aria-live="polite">
          <p className={styles.panelEyebrow}>{chapter.eyebrow}</p>
          <h2 className={styles.panelTitle}>{chapter.title}</h2>
          <p className={styles.panelMeta}>{chapter.meta}</p>
          <p className={styles.panelText}>{chapter.text}</p>
        </article>
        <nav className={styles.nodeNav} aria-label="Career chapters">
          {Object.entries(chapters).map(([id, item]) => (
            <button
              key={id}
              type="button"
              className={`${styles.nodeButton} ${active === id ? styles.nodeButtonActive : ''}`}
              onClick={() => setActive(id as ChapterId)}
              aria-pressed={active === id}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </section>
    </main>
  )
}
