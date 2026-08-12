import type { Metadata } from 'next'
import { ChamberExperiment } from '../chamber-experiment'

export const metadata: Metadata = {
  title: 'The Glyph Reactor | Chamber Experiment',
  description:
    'A subfloor reactor that powers a rising thirty-foot field of Matrix glyphs.',
  robots: { index: false, follow: false }
}

export default function GlyphReactorPage() {
  return <ChamberExperiment variant="reactor" />
}
