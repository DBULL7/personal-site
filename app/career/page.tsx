import type { Metadata } from 'next'
import { CareerExperience } from './career-experience'

export const metadata: Metadata = {
  title: 'Career | Devon Bull',
  description:
    'Devon Bull — Solutions Architect at Big Nerd Ranch. Backend lead on Apple’s chatbot (1M → 15M users), engineering lead on Chick-fil-A third-party delivery (<$1M → $5M per day).',
  alternates: { canonical: '/career' }
}

export default function CareerPage() {
  return <CareerExperience />
}
