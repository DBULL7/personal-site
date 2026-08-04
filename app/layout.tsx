import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
import { SiteHeader } from '@/components/site-header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import GoogleAnalytics from '@/app/google-analytics'
import type { Metadata, Viewport } from 'next'

config.autoAddCss = false

export const metadata: Metadata = {
  metadataBase: new URL('https://devonbull.com'),
  title: {
    default: 'Devon Bull | Senior Software Engineer',
    template: '%s'
  },
  description:
    'Interactive portfolio of Devon Bull, a senior software engineer working across embedded systems, platforms, and the web.',
  applicationName: 'Devon Bull',
  authors: [{ name: 'Devon Bull', url: 'https://devonbull.com' }],
  creator: 'Devon Bull',
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Devon Bull | Senior Software Engineer',
    description:
      'Embedded systems, platforms, and the web—explored through a series of interactive worlds.',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1731,
        height: 909,
        alt: 'Devon Bull — Systems at impossible scale'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devon Bull | Senior Software Engineer',
    description:
      'Embedded systems, platforms, and the web—explored through a series of interactive worlds.',
    images: ['/og.png']
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#03070a'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <GoogleAnalytics />
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <div id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </div>
        </div>
        <TailwindIndicator />
      </body>
    </html>
  )
}
