import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './editorial-direction.module.css'

export const metadata: Metadata = {
  title: 'The Working File | Design Direction',
  description: 'A code-native editorial direction for Devon Bull’s portfolio.',
  robots: { index: false, follow: false }
}

const evidence = [
  ['Client work', 'Apple + Chick-fil-A', 'Embedded engineering'],
  ['Range', 'Device → cloud → interface', 'Systems thinking'],
  ['Mode', 'Calm inside ambiguity', 'Engineering leadership']
] as const

const routes = [
  {
    number: '01',
    title: 'Career file',
    copy: 'Client context, technical range, and how I operate when the answer is not obvious.',
    href: '/career',
    color: 'blue'
  },
  {
    number: '02',
    title: 'Systems map',
    copy: 'How interfaces, services, data, runtime, and feedback connect into dependable products.',
    href: '/systems',
    color: 'orange'
  },
  {
    number: '03',
    title: 'Field notes',
    copy: 'Hardware, software, experiments, and the lessons that only appear once something is being built.',
    href: '/blog',
    color: 'dark'
  }
] as const

export default function EditorialDirectionPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.mark} href="/">
          DB
        </Link>
        <p>Direction 01 · no WebGL</p>
        <nav aria-label="Design direction navigation">
          <Link href="/directions">All directions</Link>
          <Link href="/directions/matrix">View 02 ↗</Link>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="editorial-title">
        <div className={styles.heroRail}>
          <span>Senior software engineer</span>
          <span>Raleigh, North Carolina</span>
          <span>Available to explore</span>
        </div>
        <div className={styles.nameBlock}>
          <p>Working file / 001</p>
          <h1 id="editorial-title">
            <span>Devon</span>
            <span>
              Bull<span className={styles.period}>.</span>
            </span>
          </h1>
        </div>
        <div className={styles.heroStatement}>
          <span className={styles.statementIndex}>A—01</span>
          <p>
            I turn ambitious product ideas into dependable systems—from embedded
            constraints and production services to the interface a person
            actually touches.
          </p>
          <div className={styles.heroActions}>
            <Link href="/career">
              Open career file <span aria-hidden="true">↗</span>
            </Link>
            <a
              href="https://www.linkedin.com/in/bulldevon"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <span className="sr-only">(opens in a new tab)</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className={styles.heroStamp} aria-hidden="true">
          <span>BUILD</span>
          <span>LEARN</span>
          <span>CONNECT</span>
        </div>
      </section>

      <section className={styles.evidence} aria-label="Profile evidence">
        <div className={styles.evidenceIntro}>
          <span>Proof, not posture</span>
          <p>
            Three signals that explain the work faster than a wall of biography.
          </p>
        </div>
        {evidence.map(([label, value, detail], index) => (
          <article key={label}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{label}</p>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </section>

      <section className={styles.routes} aria-labelledby="routes-title">
        <div className={styles.routesHeading}>
          <p>Open the part you need.</p>
          <h2 id="routes-title">
            A portfolio that works like a file, not a theme park.
          </h2>
        </div>
        <div className={styles.routeGrid}>
          {routes.map((route) => (
            <Link
              key={route.number}
              href={route.href}
              className={`${styles.route} ${styles[route.color]}`}
            >
              <span>{route.number}</span>
              <div>
                <h3>{route.title}</h3>
                <p>{route.copy}</p>
              </div>
              <span className={styles.routeArrow} aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Devon Bull · engineer / former founder / systems generalist</p>
        <Link href="/directions/matrix">
          Next direction: The Data Chamber <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </main>
  )
}
