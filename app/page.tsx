import type { Metadata } from 'next'
import Link from 'next/link'
import { signal } from '@/content/signal'
import styles from './signal.module.css'
import transmission from './transmission.module.css'

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
    <main className={`${styles.page} ${transmission.index}`}>
      <div className={styles.container}>
        <header className={transmission.hero}>
          <div className={transmission.waveField} aria-hidden="true" />
          <p className={transmission.kicker}>Signal index</p>
          <h1 className={transmission.masthead}>{signal.person.name}</h1>
          <div className={transmission.opening}>
            <p className={transmission.role}>
              {signal.person.title} <span>at {signal.person.employer}</span>
            </p>
            <p className={transmission.introduction}>
              {signal.person.introduction}
            </p>
            <nav className={styles.links} aria-label="Get in touch">
              <a href={signal.person.contact}>
                Contact on LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href="/resume.pdf">
                Resume PDF <span aria-hidden="true">↓</span>
              </a>
            </nav>
          </div>
        </header>

        <section aria-labelledby="selected-work">
          <div className={transmission.sectionHeading}>
            <h2 id="selected-work">Selected work</h2>
            <a href="#work-index" aria-label="Explore selected work">
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <ol className={transmission.workIndex} id="work-index" role="list">
            {selectedWork.map((work, index) => (
              <li key={work.id}>
                <article className={transmission.workRow}>
                  <span className={transmission.ordinal} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className={transmission.workBody}>
                    <h3>
                      <Link
                        href={
                          work.id === 'cloud-console'
                            ? '/work/cloud-console'
                            : '/career#delivery-integrations'
                        }
                      >
                        {work.title}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </h3>
                    <p>{work.contribution}</p>
                  </div>
                  <dl className={transmission.projectCredits}>
                    <div>
                      <dt>Client</dt>
                      <dd>{work.client}</dd>
                    </div>
                    <div>
                      <dt>Period</dt>
                      <dd>{work.period}</dd>
                    </div>
                    <div>
                      <dt>Responsibility</dt>
                      <dd>{work.role}</dd>
                      <dd>{signal.person.employer}</dd>
                    </div>
                  </dl>
                </article>
              </li>
            ))}
          </ol>
          <div className={transmission.careerLink}>
            <Link href="/career">
              Read the full career record <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        {currentWork ? (
          <section
            className={transmission.current}
            aria-labelledby="current-work"
          >
            <h2 id="current-work">Current work</h2>
            <div>
              <p className={transmission.currentPeriod}>{currentWork.period}</p>
              <h3>{currentWork.title}</h3>
              <p>{currentWork.contribution}</p>
              <p className={transmission.currentCredit}>
                {currentWork.client} · {currentWork.role} ·{' '}
                {signal.person.employer}
              </p>
            </div>
          </section>
        ) : null}

        <section className={transmission.elsewhere} aria-labelledby="elsewhere">
          <h2 id="elsewhere">Elsewhere</h2>
          <nav className={styles.links} aria-label="More from Devon">
            <Link href="/career">
              Career <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/blog">
              Blog <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/lab">
              Lab experiments <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </section>
      </div>
    </main>
  )
}
