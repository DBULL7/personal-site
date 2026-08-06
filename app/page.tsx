import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './home.module.css'

export const metadata: Metadata = {
  title: 'Devon Bull | Senior Software Engineer',
  description:
    'Devon Bull is a senior software engineer in Raleigh working on high-traffic consumer platforms, third-party integrations, and legacy modernisation.',
  alternates: { canonical: '/' }
}

const routes = [
  {
    index: '01',
    label: 'Start here',
    title: 'Career',
    text: 'The work record: Apple, Chick-fil-A, the numbers behind each engagement, and how I got here.',
    detail: 'Experience & approach',
    href: '/career'
  },
  {
    index: '02',
    label: 'Technical range',
    title: 'Systems',
    text: 'Trace how interfaces, services, data, infrastructure, and delivery practices connect into dependable products.',
    detail: 'Capabilities & workflows',
    href: '/systems'
  },
  {
    index: '03',
    label: 'Flagship experience',
    title: 'The Orbital',
    text: 'Enter a Culture-inspired spatial experiment about ambitious systems and technology at impossible scale.',
    detail: 'Interactive WebGL world',
    href: '/orbital'
  }
] as const

const signals = [
  ['Work', 'Consumer platforms · integrations · web'],
  ['Client context', 'Apple · Chick-fil-A'],
  ['Perspective', 'Former founder · consultant · engineering leader'],
  ['Location', 'Raleigh, North Carolina']
] as const

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="gateway-title">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.identity}>
            <p className={styles.eyebrow}>
              Devon Bull · Senior software engineer
            </p>
            <h1 id="gateway-title" className={styles.title}>
              I build dependable software where{' '}
              <em>products meet the real world.</em>
            </h1>
            <p className={styles.lede}>
              I work on high-traffic consumer platforms, third-party
              integrations, and the kind of legacy modernisation that has to
              happen without ever taking the product down.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/career">
                See my experience <span aria-hidden="true">↗</span>
              </Link>
              <Link className={styles.secondaryAction} href="/systems">
                Explore technical range
              </Link>
            </div>
          </div>

          <aside
            className={styles.signalPanel}
            aria-label="Profile at a glance"
          >
            <div className={styles.signalHeader}>
              <span>Profile signal</span>
              <span className={styles.liveStatus}>Available to explore</span>
            </div>
            <dl className={styles.signalList}>
              {signals.map(([term, description]) => (
                <div className={styles.signalRow} key={term}>
                  <dt>{term}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className={styles.routes} aria-labelledby="routes-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Three views · one practice</p>
            <h2 id="routes-title">Choose what you need to know.</h2>
          </div>
          <p>
            Career is the fastest introduction. Systems shows the technical
            breadth. The Orbital is the full-screen experiment.
          </p>
        </div>

        <div className={styles.routeGrid}>
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={styles.routeCard}
            >
              <div className={styles.routeTopline}>
                <span>{route.index}</span>
                <span>{route.label}</span>
              </div>
              <div className={styles.routeCopy}>
                <h3>{route.title}</h3>
                <p>{route.text}</p>
              </div>
              <div className={styles.routeFooter}>
                <span>{route.detail}</span>
                <span className={styles.routeArrow} aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.fieldNotes} aria-labelledby="notes-title">
        <div>
          <p className={styles.eyebrow}>Field notes</p>
          <h2 id="notes-title">
            Experiments, hardware, and things learned by making.
          </h2>
        </div>
        <Link className={styles.textLink} href="/blog">
          Read the notes <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  )
}
