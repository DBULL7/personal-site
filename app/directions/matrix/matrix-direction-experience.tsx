'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MatrixChamber } from '@/components/space/matrix-chamber'
import styles from './matrix-direction.module.css'

const details = [
  ['ROLE', 'SENIOR SOFTWARE ENGINEER'],
  ['LOCATION', 'RALEIGH, NORTH CAROLINA'],
  ['SYSTEMS', 'EMBEDDED / PLATFORM / WEB'],
  ['CLIENTS', 'APPLE / CHICK-FIL-A']
] as const

type MatrixDirectionExperienceProps = {
  variant?: 'matrix' | 'toolkit'
}

export function MatrixDirectionExperience({
  variant = 'matrix'
}: MatrixDirectionExperienceProps) {
  const [paused, setPaused] = useState(false)
  const isToolkit = variant === 'toolkit'

  return (
    <main className={styles.page}>
      <MatrixChamber paused={paused} glyphSet={variant} />
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          DB://
        </Link>
        <span>DIRECTION_{isToolkit ? '03' : '02'} / THREE.JS</span>
        <nav aria-label="Design direction navigation">
          {isToolkit ? (
            <Link href="/directions/matrix">02_MATRIX</Link>
          ) : (
            <Link href="/directions/editorial">01_NO_WEBGL</Link>
          )}
          <Link href="/directions">EXIT_STUDY</Link>
        </nav>
      </header>

      <section className={styles.identity} aria-labelledby="matrix-title">
        <div className={styles.lockTop}>
          <span>IDENTITY::VERIFIED</span>
          <span>NODE_7A</span>
        </div>
        <div className={styles.identityTitle}>
          <span className={styles.cursor} aria-hidden="true">
            ›
          </span>
          <div>
            <p>SUBJECT / ACTIVE</p>
            <h1 id="matrix-title">DEVON_BULL</h1>
          </div>
        </div>
        <p className={styles.statement}>
          Building dependable software across the boundary between ambitious
          products and the physical systems, platforms, and people that make
          them real.
        </p>
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

      <aside className={styles.depthReadout} aria-label="Scene depth telemetry">
        <span>ROOM_DEPTH</span>
        <strong>30.0 FT</strong>
        <div>
          <span>NEAR</span>
          <i />
          <span>FAR</span>
        </div>
        <small>
          {isToolkit ? '90+ LANG / CLOUD / TOOLS' : 'ASCII / KANA / NUMERIC'}
        </small>
      </aside>

      <div className={styles.controls}>
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((current) => !current)}
        >
          {paused
            ? isToolkit
              ? 'RESUME_FLOW'
              : 'RESUME_RAIN'
            : isToolkit
              ? 'PAUSE_FLOW'
              : 'PAUSE_RAIN'}
        </button>
        <span>MOVE_CURSOR_TO_SHIFT_VIEW</span>
      </div>

      <div className={styles.floorLegend} aria-hidden="true">
        <span>00</span>
        <span>05</span>
        <span>10</span>
        <span>15</span>
        <span>20</span>
        <span>25</span>
        <span>30 FT</span>
      </div>
    </main>
  )
}
