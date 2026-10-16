import type { Metadata } from 'next'
import Preview from './preview'

export const metadata: Metadata = {
  title: 'Afterlight — Devon Bull',
  description:
    'A lightscape drawn from points, flowing through perspective. An interactive portfolio preview by Devon Bull.',
  robots: { index: false, follow: false }
}

export default function Page() {
  return <Preview />
}
