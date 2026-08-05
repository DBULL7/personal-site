import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './directions.module.css'

export const metadata: Metadata = {
  title: 'Design Directions | Devon Bull',
  description: 'Three alternate design directions for Devon Bull’s portfolio.',
  robots: { index: false, follow: false }
}

const directions = [
  {
    id: '01',
    type: 'No WebGL',
    name: 'The Working File',
    description:
      'Bright, direct, and editorial. A living engineering dossier built from typography, evidence, and sharp spatial rhythm.',
    href: '/directions/editorial',
    className: styles.editorialCard
  },
  {
    id: '02',
    type: 'Three.js',
    name: 'The Data Chamber',
    description:
      'A thirty-foot digital room where identity floats at the center and changing glyphs rise through layered depth.',
    href: '/directions/matrix',
    className: styles.matrixCard
  },
  {
    id: '03',
    type: 'Three.js',
    name: 'The Toolchain Chamber',
    description:
      'The same thirty-foot room, now filled with the compact marks of a working engineer’s everyday toolkit.',
    href: '/directions/toolkit',
    className: styles.toolkitCard
  }
] as const

export default function DirectionsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/">DB</Link>
        <span>Design study · 2026</span>
      </header>
      <section className={styles.intro}>
        <p>Three new directions</p>
        <h1>Same person. Completely different rooms.</h1>
        <span>Open all three. Pick the instinct, not the compromise.</span>
      </section>
      <div className={styles.grid}>
        {directions.map((direction) => (
          <Link
            key={direction.id}
            href={direction.href}
            className={`${styles.card} ${direction.className}`}
          >
            <div className={styles.cardTopline}>
              <span>{direction.id}</span>
              <span>{direction.type}</span>
            </div>
            <div>
              <h2>{direction.name}</h2>
              <p>{direction.description}</p>
            </div>
            <span className={styles.open}>Open direction ↗</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
