import type { Metadata } from 'next'
import { signal } from '@/content/signal'
import { CareerRecords } from '@/components/career-records'
import styles from '../signal.module.css'

const title = `Resume | ${signal.person.name}`

export const metadata: Metadata = {
  title: 'Resume',
  description: signal.person.introduction,
  alternates: { canonical: '/resume' },
  openGraph: {
    title,
    description: signal.person.introduction,
    url: '/resume',
    images: ['/signal-social.png']
  }
}

export default function ResumePage() {
  return (
    <main className={`${styles.page} ${styles.resume}`}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <h1>{signal.person.name}</h1>
          <p className={styles.role}>{signal.person.title}</p>
          <p>{signal.person.introduction}</p>
          <nav
            className={styles.resumeContact}
            aria-label="Resume contact details"
          >
            <a href={signal.person.site}>{signal.person.site}</a>
            <a href={signal.person.contact}>{signal.person.contact}</a>
          </nav>
          <p className={styles.screenOnly}>
            This page is formatted for printing.{' '}
            <a href="/resume.pdf">Download the resume PDF</a>
          </p>
        </header>
        <CareerRecords />
      </div>
    </main>
  )
}
