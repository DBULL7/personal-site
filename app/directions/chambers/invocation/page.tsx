import type { Metadata } from 'next'
import { ChamberExperiment } from '../chamber-experiment'

export const metadata: Metadata = {
  title: 'The Invocation Sigil | Chamber Experiment',
  description:
    'A luminous floor sigil that invokes a rising field of software logos.',
  robots: { index: false, follow: false }
}

export default function InvocationSigilPage() {
  return <ChamberExperiment variant="invocation" />
}
