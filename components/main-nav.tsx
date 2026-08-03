'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavItem } from '@/types/nav'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import styles from './site-header.module.css'

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname() ?? ''
  const isActive = (href: string) =>
    pathname === href ||
    (href !== '/' && pathname.startsWith(`${href}/`)) ||
    (href === '/blog' && pathname.startsWith('/tags'))

  return (
    <div className={styles.mainNav}>
      <Link href="/" className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true" />
        <span className={styles.brandText}>{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className={styles.links} aria-label="Primary navigation">
          {items?.map(
            (item) =>
              item.href && (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    styles.link,
                    isActive(item.href) && styles.linkActive,
                    item.disabled && 'cursor-not-allowed opacity-80'
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
