import type { Metadata } from 'next'
import { signal } from '@/content/signal'
import { CareerRecords } from '@/components/career-records'
import styles from '../signal.module.css'

const title = `Career | ${signal.person.name}`

export const metadata: Metadata = {
  title: 'Career',
  description: signal.person.introduction,
  alternates: { canonical: '/career' },
  openGraph: {
    title,
    description: signal.person.introduction,
    url: '/career',
    images: ['/signal-social.png']
  }
}

export default function CareerPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{signal.person.name}</p>
          <h1>Career</h1>
          <p className={styles.introduction}>{signal.person.introduction}</p>
          <nav className={styles.links} aria-label="Career resources">
            <a href="/resume.pdf">Resume PDF</a>
            <a href={signal.person.contact}>Contact on LinkedIn</a>
          </nav>
        </header>
        <CareerRecords />
      </div>
    </main>
  )
}
