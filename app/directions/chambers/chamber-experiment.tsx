'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ChamberEnvironment } from '@/components/space/chamber-artifacts'
import { MatrixChamber } from '@/components/space/matrix-chamber'
import styles from './chamber-experiment.module.css'

export type ChamberVariant = Exclude<ChamberEnvironment, 'standard'>

type ChamberConfig = {
  index: string
  code: string
  name: string
  artifact: string
  status: string
  instruction: string
  description: string
}

export const chamberConfigs: Record<ChamberVariant, ChamberConfig> = {
  relic: {
    index: 'A',
    code: 'RELIC_TERMINAL',
    name: 'The Relic Terminal',
    artifact: 'LEGENDARY_CONSOLE',
    status: 'AWAITING_INPUT',
    instruction: 'PRESS ANY KEY TO CHARGE',
    description:
      'A dormant instrument waits above the floor. Every command feeds the field and turns software into something physical.'
  },
  reactor: {
    index: 'B',
    code: 'GLYPH_REACTOR',
    name: 'The Glyph Reactor',
    artifact: 'SUBFLOOR_CORE',
    status: 'SELF_SUSTAINING',
    instruction: 'CLICK THE FLOOR TO SURGE',
    description:
      'The chamber is powered from below. Symbols rise as visible exhaust from a core that pulses through the architecture.'
  },
  invocation: {
    index: 'C',
    code: 'INVOCATION_RING',
    name: 'The Invocation Ring',
    artifact: 'ACTIVE_SIGIL',
    status: 'FIELD_OPEN',
    instruction: 'CLICK THE FIELD TO INVOKE',
    description:
      'A precise floor language turns identity into ritual. The ring gathers energy, releases it, and keeps the room alive.'
  }
}

const details = [
  ['ROLE', 'SENIOR SOFTWARE ENGINEER'],
  ['LOCATION', 'RALEIGH, NORTH CAROLINA'],
  ['SYSTEMS', 'EMBEDDED / PLATFORM / WEB'],
  ['CLIENTS', 'APPLE / CHICK-FIL-A']
] as const

const chamberOrder: ChamberVariant[] = ['relic', 'reactor', 'invocation']

export function ChamberExperiment({ variant }: { variant: ChamberVariant }) {
  const [paused, setPaused] = useState(false)
  const config = chamberConfigs[variant]

  return (
    <main className={styles.page} data-variant={variant}>
      <MatrixChamber paused={paused} glyphSet="matrix" environment={variant} />
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
            <dt>DEPTH</dt>
            <dd>30.0 FT</dd>
          </div>
          <div>
            <dt>FIELD</dt>
            <dd>ASCII / KANA</dd>
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
