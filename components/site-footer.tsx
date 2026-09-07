import Link from 'next/link'
import { signal } from '@/content/signal'
import styles from '@/app/signal.module.css'

export function SiteFooter() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerInner}>
        <p>
          {signal.person.name} · {signal.person.title}
        </p>
        <nav className={styles.links} aria-label="Footer navigation">
          <a href={signal.person.contact}>Contact on LinkedIn</a>
          <a href="/resume.pdf">Resume PDF</a>
          <Link href="/resume">Printable resume</Link>
          <a href={signal.person.github}>GitHub</a>
        </nav>
      </div>
    </footer>
  )
}
