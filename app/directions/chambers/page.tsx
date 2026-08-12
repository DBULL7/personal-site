import type { Metadata } from 'next'
import Link from 'next/link'
import { chamberConfigs, type ChamberVariant } from './chamber-config'
import styles from './chambers.module.css'

export const metadata: Metadata = {
  title: 'Power Chamber Experiments | Devon Bull',
  description:
    'Three spatial experiments built around a rising field of software logos.',
  robots: { index: false, follow: false }
}

const variants: ChamberVariant[] = ['relic', 'reactor', 'invocation']

export default function ChamberExperimentsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/">DB://</Link>
        <span>POWER CHAMBER STUDY · 2026</span>
        <Link href="/directions">EXIT_STUDY</Link>
      </header>

      <section className={styles.intro}>
        <p>Three powered rooms</p>
        <h1>One field. Three sources of power.</h1>
        <span>
          The logos always rise. What changes is the artifact that commands
          them.
        </span>
      </section>

      <div className={styles.grid}>
        {variants.map((variant) => {
          const config = chamberConfigs[variant]
          return (
            <Link
              href={`/directions/chambers/${variant}`}
              className={styles.card}
              data-variant={variant}
              key={variant}
            >
              <div className={styles.cardTopline}>
                <span>{config.index}</span>
                <span>{config.artifact}</span>
              </div>
              <div className={styles.artifact} aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <div>
                <h2>{config.name}</h2>
                <p>{config.description}</p>
              </div>
              <span className={styles.open}>Enter chamber ↗</span>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
