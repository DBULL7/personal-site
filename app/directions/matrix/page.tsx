import type { Metadata } from 'next'
import { MatrixDirectionExperience } from './matrix-direction-experience'

export const metadata: Metadata = {
  title: 'The Data Chamber | Design Direction',
  description:
    'A Three.js matrix data chamber direction for Devon Bull’s portfolio.',
  robots: { index: false, follow: false }
}

export default function MatrixDirectionPage() {
  return <MatrixDirectionExperience />
}
