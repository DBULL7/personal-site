import type { Metadata } from 'next'
import Link from 'next/link'
import { signal } from '@/content/signal'
import styles from './signal.module.css'

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
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Signal index</p>
          <h1>{signal.person.name}</h1>
          <p className={styles.role}>
            {signal.person.title} at {signal.person.employer}
          </p>
          <p className={styles.introduction}>{signal.person.introduction}</p>
          <nav className={styles.links} aria-label="Get in touch">
            <a href={signal.person.contact}>Contact on LinkedIn</a>
            <a href="/resume.pdf">Resume PDF</a>
          </nav>
        </header>

        <section className={styles.section} aria-labelledby="selected-work">
          <h2 id="selected-work">Selected work</h2>
          <ol className={styles.workIndex}>
            {selectedWork.map((work) => (
              <li key={work.id}>
                <article className={styles.workSummary}>
                  <p className={styles.eyebrow}>
                    {work.client} · {work.period}
                  </p>
                  <h3>
                    <Link
                      href={
                        work.id === 'cloud-console'
                          ? '/work/cloud-console'
                          : '/career#delivery-integrations'
                      }
                    >
                      {work.title}
                    </Link>
                  </h3>
                  <p>{work.contribution}</p>
                  <p className={styles.muted}>
                    {work.role} · {signal.person.employer}
                  </p>
                </article>
              </li>
            ))}
          </ol>
          <Link href="/career">Read the full career record</Link>
        </section>

        {currentWork ? (
          <section className={styles.section} aria-labelledby="current-work">
            <h2 id="current-work">Current work</h2>
            <p className={styles.eyebrow}>
              {currentWork.title} · {currentWork.client} · {currentWork.period}
            </p>
            <p>{currentWork.contribution}</p>
          </section>
        ) : null}

        <nav className={styles.links} aria-label="More from Devon">
          <Link href="/career">Career</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/lab">Lab experiments</Link>
        </nav>
      </div>
    </main>
  )
}
