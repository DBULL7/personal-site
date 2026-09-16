import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { Icons } from '@/components/icons'
import { MainNav } from '@/components/main-nav'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-40 w-full">
      <div className="site-header-inner">
        <Link href="/" className="site-wordmark">
          {siteConfig.name}
        </Link>
        <MainNav items={siteConfig.mainNav} />
        <div className="site-header-tools">
          <Link
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="site-tool"
          >
            <Icons.linkedin className="h-4 w-4 fill-current" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="site-tool"
          >
            <Icons.gitHub className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="site-tool"
          >
            <Icons.twitter className="h-4 w-4 fill-current" />
            <span className="sr-only">Twitter</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
