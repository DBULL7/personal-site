import Link from 'next/link'
import { signal } from '@/content/signal'
import styles from '@/app/signal.module.css'

export function SiteHeader() {
  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerInner}>
        <Link className={styles.wordmark} href="/">
          {signal.person.name}
        </Link>
        <nav className={styles.links} aria-label="Main navigation">
          <Link href="/career">Career</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/lab">Lab</Link>
          <Link href="/resume">Resume</Link>
          <a href={signal.person.contact}>LinkedIn</a>
        </nav>
      </div>
    </header>
  )
}
