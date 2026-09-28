import Link from 'next/link'

import { NavItem } from '@/types/nav'
import { cn } from '@/lib/utils'

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  if (!items?.length) {
    return null
  }

  return (
    <nav className="site-nav" aria-label="Primary">
      {items.map(
        (item) =>
          item.href && (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'site-nav-link',
                item.disabled && 'pointer-events-none opacity-50'
              )}
            >
              {item.title}
            </Link>
          )
      )}
    </nav>
  )
}
