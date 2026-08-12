import type { Metadata } from 'next'
import { ChamberExperiment } from '../chamber-experiment'

export const metadata: Metadata = {
  title: 'The Black Glass | Chamber Experiment',
  description:
    'A live field of software logos rising from a super-reflective black tile floor.',
  robots: { index: false, follow: false }
}

export default function BlackGlassPage() {
  return <ChamberExperiment variant="black-glass" />
}
