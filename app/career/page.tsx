import type { Metadata } from 'next'
import { CareerExperience } from './career-experience'

export const metadata: Metadata = {
  title: 'Career Constellation | Devon Bull',
  description: 'Explore Devon Bull’s engineering career as an interactive Three.js constellation.'
}

export default function CareerPage() {
  return <CareerExperience />
}
