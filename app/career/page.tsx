import type { Metadata } from 'next'
import { CareerExperience } from './career-experience'

export const metadata: Metadata = {
  title: 'Career | Devon Bull',
  description:
    'Devon Bull’s experience across embedded client work, full-stack platforms, consulting, and engineering leadership.',
  alternates: { canonical: '/career' }
}

export default function CareerPage() {
  return <CareerExperience />
}
