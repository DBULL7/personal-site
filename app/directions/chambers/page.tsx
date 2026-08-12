import type { Metadata } from 'next'
import Link from 'next/link'
import { chamberConfigs, type ChamberVariant } from './chamber-config'
import styles from './chambers.module.css'

export const metadata: Metadata = {
  title: 'Environment Experiments | Devon Bull',
  description:
    'Two immersive environments built around a rising field of software logos.',
  robots: { index: false, follow: false }
}

const variants: ChamberVariant[] = ['cyber', 'castle']

export default function ChamberExperimentsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/">DB://</Link>
        <span>ENVIRONMENT STUDY · 2026</span>
        <Link href="/directions">EXIT_STUDY</Link>
      </header>

      <section className={styles.intro}>
        <p>Two complete worlds</p>
        <h1>Same power. Different mythology.</h1>
        <span>
          The logo field and identity stay constant. What changes is the world
          they inhabit: machine intelligence or ancient legend.
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
              <div className={styles.scenery} aria-hidden="true">
                <div className={styles.sceneDepth}>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <span>{config.setting}</span>
              </div>
              <div className={styles.cardCopy}>
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
