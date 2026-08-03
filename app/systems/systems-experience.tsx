'use client'

import { useCallback, useState } from 'react'
import { SpaceScene } from '@/components/space/space-scene'
import styles from '../space-experiences.module.css'

const systems = {
  typescript: { title: 'TypeScript', meta: 'Product systems', text: 'Strongly typed application architecture across frontend, backend, and shared platform code.' },
  react: { title: 'React', meta: 'Interfaces', text: 'Accessible, responsive interfaces with a bias for simple interaction models and maintainable components.' },
  node: { title: 'Node.js', meta: 'Services', text: 'APIs, integrations, background work, and production services designed for observability and change.' },
  go: { title: 'Go', meta: 'Systems', text: 'Small, legible services and tools where performance, concurrency, and operational clarity matter.' },
  cloud: { title: 'Cloud', meta: 'AWS · Google Cloud · Kubernetes', text: 'Infrastructure and delivery systems that help teams ship safely without hiding how production works.' },
  data: { title: 'Data', meta: 'Postgres · DynamoDB · MongoDB', text: 'Pragmatic data modelling across relational, document, and key-value systems.' },
  platform: { title: 'Platform engineering', meta: 'CI/CD · GitHub Actions · Datadog', text: 'The paved roads, feedback loops, and operational context that let engineering teams move with confidence.' },
  ai: { title: 'AI systems', meta: 'Exploration · applied tooling', text: 'A continuing fascination with useful AI interfaces, voice, agents, and tools that expand creative leverage.' }
} as const

type SystemId = keyof typeof systems

export function SystemsExperience() {
  const [active, setActive] = useState<SystemId>('typescript')
  const select = useCallback((id: string) => {
    if (id in systems) setActive(id as SystemId)
  }, [])
  const item = systems[active]

  return (
    <main className={styles.page}>
      <section className={styles.systemsHero}>
        <SpaceScene mode="systems" onNodeSelect={select} />
        <div className={styles.sceneHeading}>
          <p className={styles.eyebrow}>Systems atlas · 003</p>
          <h1 className={styles.sceneTitle}>Tools in orbit.</h1>
          <p className={styles.sceneInstructions}>A technical toolkit organised as a system, not a wall of logos.</p>
        </div>
        <article className={styles.infoPanel} aria-live="polite">
          <p className={styles.panelEyebrow}>Active capability</p>
          <h2 className={styles.panelTitle}>{item.title}</h2>
          <p className={styles.panelMeta}>{item.meta}</p>
          <p className={styles.panelText}>{item.text}</p>
        </article>
        <nav className={styles.nodeNav} aria-label="Technical capabilities">
          {Object.entries(systems).map(([id, system]) => (
            <button
              key={id}
              type="button"
              className={`${styles.nodeButton} ${active === id ? styles.nodeButtonActive : ''}`}
              onClick={() => setActive(id as SystemId)}
              aria-pressed={active === id}
            >
              {system.title}
            </button>
          ))}
        </nav>
      </section>
    </main>
  )
}
