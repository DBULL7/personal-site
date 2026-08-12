import type { Metadata } from 'next'
import Link from 'next/link'
import { chamberConfigs, type ChamberVariant } from './chamber-config'
import styles from './chambers.module.css'

export const metadata: Metadata = {
  title: 'Black Glass Experiment | Devon Bull',
  description:
    'A reflective black tile environment built around a rising field of software logos.',
  robots: { index: false, follow: false }
}

const variants: ChamberVariant[] = ['black-glass']

export default function ChamberExperimentsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/">DB://</Link>
        <span>ENVIRONMENT STUDY · 2026</span>
        <Link href="/directions">EXIT_STUDY</Link>
      </header>

      <section className={styles.intro}>
        <p>Material study / 01</p>
        <h1>Power, reflected.</h1>
        <span>
          One black room. One impossibly glossy tile floor. The logo field rises
          through the surface and leaves a second world underneath it.
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
