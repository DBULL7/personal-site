import type { Metadata } from 'next'
import { MatrixDirectionExperience } from '../matrix/matrix-direction-experience'

export const metadata: Metadata = {
  title: 'The Toolchain Chamber | Design Direction',
  description:
    'A Three.js data chamber filled with the compact tools and symbols of Devon Bull’s daily engineering work.',
  robots: { index: false, follow: false }
}

export default function ToolkitDirectionPage() {
  return <MatrixDirectionExperience variant="toolkit" />
}
