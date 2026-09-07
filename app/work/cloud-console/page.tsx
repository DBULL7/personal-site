import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { signal } from '@/content/signal'
import styles from '../../signal.module.css'

const work = signal.work.find((entry) => entry.id === 'cloud-console')

export function generateMetadata(): Metadata {
  if (!work) notFound()

  return {
    title: work.title,
    description: work.contribution,
    alternates: { canonical: '/work/cloud-console' },
    openGraph: {
      title: `${work.title} | ${signal.person.name}`,
      description: work.contribution,
      url: '/work/cloud-console',
      images: ['/signal-social.png']
    }
  }
}

export default function CloudConsolePage() {
  if (!work?.caseStudy) notFound()

  return (
    <main className={styles.page}>
      <article className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Selected work · {work.client}</p>
          <h1>{work.title}</h1>
          <p className={styles.introduction}>{work.contribution}</p>
          <dl className={styles.credits}>
            <div>
              <dt>Employer</dt>
              <dd>{signal.person.employer}</dd>
            </div>
            <div>
              <dt>Client</dt>
              <dd>{work.client}</dd>
            </div>
            <div>
              <dt>Period</dt>
              <dd>{work.period}</dd>
            </div>
            <div>
              <dt>Project role</dt>
              <dd>{work.role}</dd>
            </div>
            <div>
              <dt>Technology</dt>
              <dd>{work.technologies.join(' · ')}</dd>
            </div>
          </dl>
        </header>
        {work.caseStudy.map((section) => (
          <section className={styles.section} key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
        <nav className={styles.links} aria-label="Continue reading">
          <Link href="/career">Full career record</Link>
          <a href={signal.person.contact}>Contact on LinkedIn</a>
        </nav>
      </article>
    </main>
  )
}
