'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MatrixChamber } from '@/components/space/matrix-chamber'
import {
  blackGlassStudies,
  blackGlassStudyConfigs,
  chamberConfigs,
  type BlackGlassStudy,
  type ChamberVariant
} from './chamber-config'
import styles from './chamber-experiment.module.css'

const details = [
  ['ROLE', 'SENIOR SOFTWARE ENGINEER'],
  ['LOCATION', 'RALEIGH, NORTH CAROLINA'],
  ['SYSTEMS', 'EMBEDDED / PLATFORM / WEB'],
  ['CLIENTS', 'APPLE / CHICK-FIL-A']
] as const

const chamberOrder: ChamberVariant[] = ['black-glass']

export function ChamberExperiment({
  variant,
  blackGlassStudy = 'baseline'
}: {
  variant: ChamberVariant
  blackGlassStudy?: BlackGlassStudy
}) {
  const [paused, setPaused] = useState(false)
  const [hazardStrikesPerMinute, setHazardStrikesPerMinute] = useState(20)
  const config =
    variant === 'black-glass'
      ? blackGlassStudyConfigs[blackGlassStudy]
      : chamberConfigs[variant]

  return (
    <main
      className={styles.page}
      data-variant={variant}
      data-black-glass-study={blackGlassStudy}
    >
      <MatrixChamber
        key={`${variant}-${blackGlassStudy}`}
        paused={paused}
        glyphSet="toolkit"
        environment={variant}
        blackGlassBackWall={blackGlassStudy}
        hazardStrikesPerMinute={hazardStrikesPerMinute}
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

      {variant === 'black-glass' ? (
        <nav className={styles.studyNav} aria-label="Black Glass wall studies">
          <span>WALL_STUDY</span>
          <div>
            {blackGlassStudies.map((study, index) => (
              <Link
                key={study}
                href={
                  study === 'baseline'
                    ? '/directions/chambers/black-glass'
                    : `/directions/chambers/black-glass/${study}`
                }
                aria-current={study === blackGlassStudy ? 'page' : undefined}
                title={blackGlassStudyConfigs[study].name}
              >
                {String(index).padStart(2, '0')}_
                {blackGlassStudyConfigs[study].shortLabel}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}

      <div className={styles.controls}>
        {blackGlassStudy === 'wall-lightning' ? (
          <label className={styles.strikeRate}>
            <span>STRIKES/MIN</span>
            <select
              aria-label="Automatic lightning strikes per minute"
              value={hazardStrikesPerMinute}
              onChange={(event) =>
                setHazardStrikesPerMinute(Number(event.target.value))
              }
            >
              {[0, 6, 12, 20, 30].map((rate) => (
                <option key={rate} value={rate}>
                  {rate === 0 ? 'OFF' : rate}
                </option>
              ))}
            </select>
          </label>
        ) : null}
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
