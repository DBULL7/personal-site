import type { Metadata } from 'next'
import { ChamberExperiment } from '../chamber-experiment'

export const metadata: Metadata = {
  title: 'The Sword Court | Chamber Experiment',
  description:
    'A realistic castle courtyard where a rising field of software logos surrounds a sword in stone.',
  robots: { index: false, follow: false }
}

export default function SwordCourtPage() {
  return <ChamberExperiment variant="castle" />
}
