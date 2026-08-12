'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MatrixChamber } from '@/components/space/matrix-chamber'
import { chamberConfigs, type ChamberVariant } from './chamber-config'
import styles from './chamber-experiment.module.css'

const details = [
  ['ROLE', 'SENIOR SOFTWARE ENGINEER'],
  ['LOCATION', 'RALEIGH, NORTH CAROLINA'],
  ['SYSTEMS', 'EMBEDDED / PLATFORM / WEB'],
  ['CLIENTS', 'APPLE / CHICK-FIL-A']
] as const

const chamberOrder: ChamberVariant[] = ['black-glass']

export function ChamberExperiment({ variant }: { variant: ChamberVariant }) {
  const [paused, setPaused] = useState(false)
  const config = chamberConfigs[variant]

  return (
    <main className={styles.page} data-variant={variant}>
      <MatrixChamber
        key={variant}
        paused={paused}
        glyphSet="toolkit"
        environment={variant}
      />
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          DB://
        </Link>
        <span>
          POWER_CHAMBER_{config.index} / {config.code}
        </span>
        <nav aria-label="Power chamber navigation">
          {chamberOrder
            .filter((item) => item !== variant)
            .map((item) => (
              <Link key={item} href={`/directions/chambers/${item}`}>
                {chamberConfigs[item].index}_{chamberConfigs[item].code}
              </Link>
            ))}
          <Link href="/directions/chambers">ALL_CHAMBERS</Link>
        </nav>
      </header>

      <section className={styles.identity} aria-labelledby="chamber-title">
        <div className={styles.lockTop}>
          <span>IDENTITY::VERIFIED</span>
          <span>{config.status}</span>
        </div>
        <div className={styles.identityTitle}>
          <span className={styles.cursor} aria-hidden="true">
            ›
          </span>
          <div>
            <p>SUBJECT / ACTIVE</p>
            <h1 id="chamber-title">DEVON_BULL</h1>
          </div>
        </div>
        <p className={styles.statement}>{config.description}</p>
        <dl className={styles.details}>
          {details.map(([term, detail]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.actions}>
          <Link href="/career">[ OPEN_CAREER ]</Link>
          <Link href="/systems">[ TRACE_SYSTEMS ]</Link>
        </div>
      </section>

      <aside className={styles.telemetry} aria-label="Chamber telemetry">
        <span>ARTIFACT</span>
        <strong>{config.artifact}</strong>
        <dl>
          <div>
            <dt>FIELD</dt>
            <dd>94 TOOLKIT MARKS</dd>
          </div>
          <div>
            <dt>SCENE</dt>
            <dd>{config.setting}</dd>
          </div>
          <div>
            <dt>FLOW</dt>
            <dd>FLOOR → CEILING</dd>
          </div>
        </dl>
      </aside>

      <div className={styles.controls}>
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((current) => !current)}
        >
          {paused ? 'RESUME_FIELD' : 'PAUSE_FIELD'}
        </button>
        <span>{config.instruction}</span>
      </div>
    </main>
  )
}
