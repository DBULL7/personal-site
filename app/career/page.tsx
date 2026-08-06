import type { Metadata } from 'next'
import { CareerExperience } from './career-experience'

export const metadata: Metadata = {
  title: 'Career | Devon Bull',
  description:
    'Devon Bull — product engineer in Raleigh, NC. Seven years at one firm (Stellar Elements, formerly Big Nerd Ranch), most of it inside Apple: backend lead on the chatbot at 1M → 15M users, solo owner of a cloud-resource UI, now Apple’s internal cloud site and developer portal. Plus Chick-fil-A delivery integrations at $5M a day.',
  alternates: { canonical: '/career' }
}

export default function CareerPage() {
  return <CareerExperience />
}
