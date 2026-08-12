import type { Metadata } from 'next'
import { ChamberExperiment } from '../chamber-experiment'

export const metadata: Metadata = {
  title: 'The Invocation Ring | Chamber Experiment',
  description:
    'A luminous floor sigil that invokes a rising field of Matrix glyphs.',
  robots: { index: false, follow: false }
}

export default function InvocationRingPage() {
  return <ChamberExperiment variant="invocation" />
}
