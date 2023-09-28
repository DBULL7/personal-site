import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from "@/components/site-header";
import {TailwindIndicator} from "@/components/tailwind-indicator";
import GoogleAnalytics from "@/app/google-analytics";

config.autoAddCss = false

export default function RootLayout({
  children,
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
