import { Metadata } from 'next'

import { Hero } from '@/components/hero'
import { WorkChapters } from '@/components/work-chapters'

export const metadata: Metadata = {
  title: 'Devon Bull - Solutions Architect',
  description: 'Solutions Architect at Big Nerd Ranch.'
}

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkChapters />
    </main>
  )
}
