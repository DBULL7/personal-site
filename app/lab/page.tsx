import type { Metadata } from 'next'
import Link from 'next/link'
import { signal } from '@/content/signal'
import { MatrixExperiment } from './matrix-experiment'
import styles from '../signal.module.css'

const description =
  'Optional visual experiments, separate from the career record.'

export const metadata: Metadata = {
  title: 'Lab',
  description,
  alternates: { canonical: '/lab' },
  openGraph: {
    title: `Lab | ${signal.person.name}`,
    description,
    url: '/lab',
    images: ['/signal-social.png']
  }
}

export default function LabPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{signal.person.name}</p>
          <h1>Lab</h1>
          <p className={styles.introduction}>{description}</p>
          <Link href="/career">Read the career record</Link>
        </header>
        <section className={styles.section} aria-labelledby="matrix-rain">
          <h2 id="matrix-rain">Matrix rain</h2>
          <p>
            A canvas animation from the original site. It stays off until you
            start it.
          </p>
          <MatrixExperiment />
          <noscript>
            The animation needs JavaScript. The rest of this site does not.
          </noscript>
        </section>
      </div>
    </main>
  )
}
