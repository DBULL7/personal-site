import type { Metadata } from 'next'
import { CareerExperience } from './career-experience'

export const metadata: Metadata = {
  title: 'Career | Devon Bull',
  description:
    'Devon Bull — Solutions Architect at Big Nerd Ranch. Backend lead on Apple’s chatbot (1M → 15M users) and engineering lead on Chick-fil-A’s third-party delivery integrations ($1M → $5M a day).',
  alternates: { canonical: '/career' }
}

export default function CareerPage() {
  return <CareerExperience />
}
