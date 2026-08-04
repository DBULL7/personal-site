'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { siteConfig } from '@/config/site'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { MainNav } from '@/components/main-nav'
import styles from './site-header.module.css'

export function SiteHeader() {
  const pathname = usePathname()

  if (pathname?.startsWith('/directions')) return null

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <MainNav items={siteConfig.mainNav} />
        <div className={styles.headerActions}>
          <nav className={styles.actions} aria-label="Social profiles">
            <Link
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
              className={buttonVariants({ size: 'icon', variant: 'ghost' })}
            >
              <Icons.linkedin className="h-5 w-5 fill-current" />
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub (opens in a new tab)"
              className={buttonVariants({ size: 'icon', variant: 'ghost' })}
            >
              <Icons.gitHub className="h-5 w-5" />
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              aria-label="X / Twitter (opens in a new tab)"
              className={buttonVariants({ size: 'icon', variant: 'ghost' })}
            >
              <Icons.twitter className="h-5 w-5 fill-current" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
