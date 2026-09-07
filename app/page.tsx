import type { Metadata } from 'next'
import Link from 'next/link'
import { signal } from '@/content/signal'
import styles from './fieldwork.module.css'

const title = `${signal.person.name} | ${signal.person.title}`

export const metadata: Metadata = {
  title: { absolute: title },
  description: signal.person.introduction,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description: signal.person.introduction,
    url: '/',
    images: ['/signal-social.png']
  }
}

export default function Home() {
  const selectedWork = signal.work.filter(
    (work) => work.id === 'cloud-console' || work.id === 'delivery-integrations'
  )
  const currentWork = signal.work.find((work) => work.id === 'cloud-portal')

  return (
    <main className={styles.index}>
      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <div className={styles.topline}>
            <p className={styles.label}>Signal index</p>
            <a href="#selected-work">
              Selected work <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className={styles.field} aria-hidden="true" />
          <div className={styles.intro}>
            <h1>{signal.person.name}</h1>
            <p className={styles.role}>
              {signal.person.title} at {signal.person.employer}
            </p>
            <p className={styles.introduction}>{signal.person.introduction}</p>
            <nav className={styles.links} aria-label="Get in touch">
              <a href={signal.person.contact}>Contact on LinkedIn</a>
              <a href="/resume.pdf">Resume PDF</a>
            </nav>
          </div>
        </div>
      </header>

      <div className={styles.paper}>
        <section aria-labelledby="selected-work">
          <div className={styles.sectionHeading}>
            <p className={styles.label}>Project records</p>
            <h2 id="selected-work">Selected work</h2>
          </div>
          <ol className={styles.entries} role="list">
            {selectedWork.map((work) => (
              <li key={work.id}>
                <article className={styles.entry}>
                  <div className={styles.margin}>
                    <p className={styles.client}>{work.client}</p>
                    <p>{work.period}</p>
                    <p className={styles.projectRole}>{work.role}</p>
                    <p>{signal.person.employer}</p>
                  </div>
                  <div className={styles.entryContent}>
                    <h3>
                      <Link
                        href={
                          work.id === 'cloud-console'
                            ? '/work/cloud-console'
                            : '/career#delivery-integrations'
                        }
                      >
                        {work.title}
                        <span className={styles.arrow} aria-hidden="true">
                          ↗
                        </span>
                      </Link>
                    </h3>
                    <p className={styles.contribution}>{work.contribution}</p>
                    <ul className={styles.evidence} role="list">
                      {work.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ol>
          <div className={styles.careerLink}>
            <Link href="/career">
              Read the full career record <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        {currentWork ? (
          <section className={styles.current} aria-labelledby="current-work">
            <div className={styles.margin}>
              <h2 id="current-work" className={styles.label}>
                Current work
              </h2>
              <p className={styles.client}>{currentWork.client}</p>
              <p>{currentWork.period}</p>
            </div>
            <div className={styles.entryContent}>
              <h3>{currentWork.title}</h3>
              <p className={styles.contribution}>{currentWork.contribution}</p>
            </div>
          </section>
        ) : null}

        <nav className={styles.more} aria-label="More from Devon">
          <p className={styles.label}>Elsewhere in the index</p>
          <div className={styles.links}>
            <Link href="/career">Career</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/lab">Lab experiments</Link>
          </div>
        </nav>
      </div>
    </main>
  )
}
