import type { Metadata } from 'next'
import { SystemsExperience } from './systems-experience'

export const metadata: Metadata = {
  title: 'Systems Atlas | Devon Bull',
  description: 'An interactive Three.js atlas of Devon Bull’s engineering tools and capabilities.'
}

export default function SystemsPage() {
  return <SystemsExperience />
}
