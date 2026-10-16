import type { Metadata } from 'next'
import Preview from './preview'

export const metadata: Metadata = {
  title: 'Windfield — Devon Bull',
  description:
    'A landscape made of points, moved by a gentle breeze. An interactive portfolio preview by Devon Bull.',
  robots: { index: false, follow: false }
}

export default function Page() {
  return <Preview />
}
