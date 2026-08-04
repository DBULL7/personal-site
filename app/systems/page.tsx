import type { Metadata } from 'next'
import { SystemsExperience } from './systems-experience'

export const metadata: Metadata = {
  title: 'Systems | Devon Bull',
  description:
    'Explore how Devon Bull connects interfaces, services, data, cloud infrastructure, delivery feedback, and AI tooling.',
  alternates: { canonical: '/systems' }
}

export default function SystemsPage() {
  return <SystemsExperience />
}
