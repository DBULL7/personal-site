import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './space-experiences.module.css'

export const metadata: Metadata = {
  title: 'Devon Bull | Senior Software Engineer',
  description: 'Interactive portfolio of Devon Bull, a senior software engineer working across embedded systems, platforms, and the web.'
}

const views = [
  {
    index: 'EXPERIENCE / 001',
    title: 'The Orbital',
    text: 'A Culture-inspired arrival: one immense ring habitat, a procession of ships, and a portfolio designed to evoke scale.',
    href: '/orbital',
    featured: true
  },
  {
    index: 'EXPERIENCE / 002',
    title: 'Career constellation',
    text: 'Navigate the client work, engineering range, and leadership principles that form my career arc.',
    href: '/career'
  },
  {
    index: 'EXPERIENCE / 003',
    title: 'Systems atlas',
    text: 'Explore the tools and technical disciplines I use as a connected, orbiting system.',
    href: '/systems'
  }
]

export default function Home() {
  return (
    <main className={styles.gateway}>
      <div className={styles.gatewayInner}>
        <div className={styles.gatewayIntro}>
          <div>
            <p className={styles.eyebrow}>Devon Bull · Engineer / Futurist</p>
            <h1 className={styles.gatewayTitle}>Choose a point of view.</h1>
          </div>
          <p className={styles.gatewayIntroText}>
            Senior software engineer working across embedded systems, cloud platforms, and the web.
            This portfolio is a set of explorable worlds—each one reveals a different part of the work.
          </p>
        </div>

        <div className={styles.gatewayGrid}>
          {views.map((view) => (
            <Link
              key={view.href}
              href={view.href}
              className={`${styles.gatewayCard} ${view.featured ? styles.gatewayCardFeatured : ''}`}
            >
              <span className={styles.cardIndex}>{view.index}</span>
              <div>
                <h2 className={styles.cardTitle}>{view.title}</h2>
                <p className={styles.cardText}>{view.text}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.aboutStrip}>
          <p className={styles.aboutText}>
            Previously a tech entrepreneur; now a consultant and engineering leader. Client work includes
            embedded projects for Apple and Chick-fil-A. Based in Raleigh, North Carolina.
          </p>
          <Link className={styles.secondaryAction} href="/blog">Read the field notes</Link>
        </div>
      </div>
    </main>
  )
}
