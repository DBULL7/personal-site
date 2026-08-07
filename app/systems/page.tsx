import type { Metadata } from 'next'
import { SystemsExperience } from './systems-experience'

export const metadata: Metadata = {
  title: 'Systems | Devon Bull',
  description:
    'A playable cutaway of a third-party delivery order crossing a platform: edge, service, data, runtime, feedback — with fault injection and the decisions behind each stage.',
  alternates: { canonical: '/systems' }
}

export default function SystemsPage() {
  return <SystemsExperience />
}
