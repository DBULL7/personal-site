import type { Metadata } from 'next'
import { SystemsExperience } from './systems-experience'

export const metadata: Metadata = {
  title: 'Systems | Devon Bull',
  description:
    'Nine capabilities Devon Bull works in — product interface, developer platform, scale, third-party integrations, modernization, data, cloud, observability and applied AI — with the tradeoff behind each one.',
  alternates: { canonical: '/systems' }
}

export default function SystemsPage() {
  return <SystemsExperience />
}
