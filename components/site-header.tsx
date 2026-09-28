import Link from 'next/link'
import { siteConfig } from '@/config/site'
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
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
