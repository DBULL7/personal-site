import type { Metadata } from 'next'
import { ChamberExperiment } from '../chamber-experiment'

export const metadata: Metadata = {
  title: 'The Cyber Vault | Chamber Experiment',
  description:
    'A machine-scale corridor threaded by a rising field of software logos.',
  robots: { index: false, follow: false }
}

export default function CyberVaultPage() {
  return <ChamberExperiment variant="cyber" />
}
