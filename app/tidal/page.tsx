import type { Metadata } from 'next'
import Preview from './preview'

export const metadata: Metadata = {
  title: 'Tidal — Devon Bull',
  description:
    'An ocean of individual points, moving as one. An interactive portfolio preview by Devon Bull.',
  robots: { index: false, follow: false }
}

export default function Page() {
  return <Preview />
}
