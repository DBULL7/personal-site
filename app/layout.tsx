import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
import { ThemeProvider } from '@/components/theme-provider'
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
  description: 'Interactive portfolio of Devon Bull, a senior software engineer working across embedded systems, platforms, and the web.',
  openGraph: {
    title: 'Devon Bull | Senior Software Engineer',
    description: 'Embedded systems, platforms, and the web—explored through a series of interactive worlds.',
    type: 'website',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'Devon Bull — Systems at impossible scale' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devon Bull | Senior Software Engineer',
    description: 'Embedded systems, platforms, and the web—explored through a series of interactive worlds.',
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
    <html lang="en" suppressHydrationWarning>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <GoogleAnalytics />
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
