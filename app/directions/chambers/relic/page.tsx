import type { Metadata } from 'next'
import { ChamberExperiment } from '../chamber-experiment'

export const metadata: Metadata = {
  title: 'The Relic Terminal | Chamber Experiment',
  description:
    'A legendary floating keyboard surrounded by a rising field of software logos.',
  robots: { index: false, follow: false }
}

export default function RelicTerminalPage() {
  return <ChamberExperiment variant="relic" />
}
