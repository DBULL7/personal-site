import type { Metadata } from 'next'
import { SystemsExperience } from './systems-experience'

export const metadata: Metadata = {
  title: 'Systems | Devon Bull',
  description:
    'Eight capabilities Devon Bull works in — scale, third-party integrations, legacy modernization, performance, data, cloud, observability and applied AI — with the tradeoff behind each one.',
  alternates: { canonical: '/systems' }
}

export default function SystemsPage() {
  return <SystemsExperience />
}
