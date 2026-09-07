import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import GoogleAnalytics from '@/app/google-analytics'
import { signal } from '@/content/signal'
import styles from './signal.module.css'

config.autoAddCss = false

export const metadata: Metadata = {
  metadataBase: new URL(signal.person.site),
  title: {
    default: `${signal.person.name} | ${signal.person.title}`,
    template: `%s | ${signal.person.name}`
  },
  description: signal.person.introduction,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: signal.person.name,
    title: `${signal.person.name} | ${signal.person.title}`,
    description: signal.person.introduction,
    images: [
      {
        url: '/signal-social.png',
        width: 1200,
        height: 630,
        alt: `${signal.person.name}, ${signal.person.title} at ${signal.person.employer}`
      }
    ]
  },
  twitter: { card: 'summary_large_image' }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className={styles.shell}>
            <a className={styles.skipLink} href="#main-content">
              Skip to content
            </a>
            <SiteHeader />
            <div id="main-content" tabIndex={-1} className={styles.mainContent}>
              {children}
            </div>
            <SiteFooter />
          </div>
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  )
}
