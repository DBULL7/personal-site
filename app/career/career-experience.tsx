'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  RACK_HEIGHT,
  RACK_WIDTH,
  formatMeter,
  patches,
  rackUnits,
  unitCenterY,
  unitsById,
  type RackUnit
} from './career-data'
import {
  useMachineTheme,
  usePrefersReducedMotion,
  useWebglSupported
} from '@/components/machine/machine-core'
import styles from './career.module.css'

const RackScene = dynamic(
  () => import('@/components/machine/rack-scene').then((mod) => mod.RackScene),
  { ssr: false, loading: () => <div className={styles.sceneLoading} aria-hidden="true" /> }
)

/* ---------------------------------------------------------------- waveform */

type Seg = [number, number, 0 | 1]
const HI = 8
const LO = 36

function stepPath(segments: Seg[]) {
  return segments
    .flatMap(([start, end, level]): [number, number][] => {
      const y = level ? HI : LO
      return [
        [start, y],
        [end, y]
      ]
    })
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ')
}

function analogPath(sample: (t: number) => number, steps = 120) {
  let path = ''
  for (let index = 0; index <= steps; index += 1) {
    const x = (index / steps) * 100
    path += `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${sample(index / steps).toFixed(2)}`
    path += index === steps ? '' : ' '
  }
  return path
}

function periodPath(wave: RackUnit['wave']) {
  if (wave === 'clock') {
    const segments: Seg[] = []
    for (let index = 0; index < 8; index += 1) {
      segments.push([index * 12.5, index * 12.5 + 6.25, 1])
      segments.push([index * 12.5 + 6.25, (index + 1) * 12.5, 0])
    }
    return stepPath(segments)
  }
  if (wave === 'pwm') {
    const segments: Seg[] = []
    for (let index = 0; index < 8; index += 1) {
      segments.push([index * 12.5, index * 12.5 + 2.9, 1])
      segments.push([index * 12.5 + 2.9, (index + 1) * 12.5, 0])
    }
    return stepPath(segments)
  }
  if (wave === 'burst') {
    const segments: Seg[] = []
    for (let index = 0; index < 9; index += 1) {
      segments.push([index * 5, index * 5 + 2.4, 1])
      segments.push([index * 5 + 2.4, (index + 1) * 5, 0])
    }
    segments.push([45, 100, 1])
    return stepPath(segments)
  }
  if (wave === 'packet') {
    const bits = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0]
    return stepPath(bits.map((bit, index) => [index * 5, (index + 1) * 5, bit as 0 | 1]))
  }
  if (wave === 'handshake') {
    return stepPath([
      [0, 8, 0],
      [8, 13, 1],
      [13, 34, 0],
      [34, 39, 1],
      [39, 46, 0],
      [46, 51, 1],
      [51, 100, 0]
    ])
  }
  if (wave === 'ramp') {
    return analogPath((t) => LO - ((t * 2) % 1) * (LO - HI))
  }
  return analogPath((t) => {
    const ripple = Math.sin(t * Math.PI * 14) * 1.1
    const dip = t > 0.52 && t < 0.62 ? 12 * Math.sin(((t - 0.52) / 0.1) * Math.PI) : 0
    return HI + 2 + ripple + dip
  })
}

function useWaveform(wave: RackUnit['wave']) {
  return useMemo(() => {
    const single = periodPath(wave)
    return [0, 100, 200]
      .map((offset) =>
        single.replace(/([ML])([\d.-]+) /g, (_, cmd, x) => `${cmd}${Number(x) + offset} `)
      )
      .join(' ')
  }, [wave])
}

/* ------------------------------------------------------------ meter readout */

function useCountUp(unit: RackUnit, animate: boolean) {
  const [value, setValue] = useState(unit.meter.to)

  useEffect(() => {
    if (!animate) {
      setValue(unit.meter.to)
      return
    }
    const { from, to } = unit.meter
    const duration = 1200
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(from + (to - from) * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [unit, animate])

  return value
}

/* ------------------------------------------------------- rack elevation svg */

const PLAN_W = 1200
const PLAN_H = 800
const planX = (x: number) => ((x + RACK_WIDTH / 2) / RACK_WIDTH) * PLAN_W
const planY = (y: number) => ((RACK_HEIGHT / 2 - y) / RACK_HEIGHT) * PLAN_H
const unitPlanHeight = (PLAN_H / rackUnits.length) * 0.86

function RackElevation({
  activeId,
  onSelect
}: {
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className={styles.planWrap}>
      <svg
        className={styles.plan}
        viewBox={`0 0 ${PLAN_W} ${PLAN_H}`}
        role="img"
        aria-label="Front elevation of the career rack: seven labelled units with meters."
      >
        <rect x="0" y="0" width={PLAN_W} height={PLAN_H} className={styles.planFrame} />
        {rackUnits.map((unit, index) => {
          const active = unit.id === activeId
          const y = planY(unitCenterY(index)) - unitPlanHeight / 2
          const ratio =
            unit.meter.to === 0 ? 0 : active ? 1 : 0.18
          return (
            <g
              key={unit.id}
              className={active ? styles.planUnitActive : styles.planUnit}
              onClick={() => onSelect(unit.id)}
            >
              <rect x="26" y={y} width={PLAN_W - 52} height={unitPlanHeight} rx="4" />
              <text x="58" y={y + unitPlanHeight / 2 + 9} className={styles.planSlot}>
                {unit.slot}
              </text>
              <text x="120" y={y + unitPlanHeight / 2 + 9}>
                {unit.face[0]}
              </text>
              <text
                x="430"
                y={y + unitPlanHeight / 2 + 8}
                className={styles.planMeta}
              >
                {unit.window.toUpperCase()}
              </text>
              <rect
                x="700"
                y={y + unitPlanHeight * 0.3}
                width="440"
                height={unitPlanHeight * 0.4}
                className={styles.planMeterBg}
              />
              <rect
                x="704"
                y={y + unitPlanHeight * 0.3 + 4}
                width={432 * ratio}
                height={unitPlanHeight * 0.4 - 8}
                className={styles.planMeterFill}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------- scope */

function Scope({
  unit,
  live,
  animate
}: {
  unit: RackUnit
  live: boolean
  animate: boolean
}) {
  const path = useWaveform(unit.wave)
  const value = useCountUp(unit, animate)
  const meter = unit.meter

  return (
    <div className={styles.scope}>
      <div className={styles.scopeHead}>
        <span className={styles.scopeChannel}>
          <i className={styles.ledSignal} aria-hidden="true" />
          SLOT {unit.slot}
        </span>
        <span>{unit.window.toUpperCase()}</span>
        <span className={styles.scopeHeadRight}>{live ? 'LIVE' : 'HELD'}</span>
      </div>

      <div className={styles.screen}>
        <svg
          className={styles.trace}
          viewBox="0 0 100 44"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={path} vectorEffect="non-scaling-stroke" />
        </svg>
        <span className={styles.screenTagLeft}>{unit.org}</span>
        <span className={styles.screenTagRight}>{meter.label}</span>
        <span className={styles.screenScale}>2 V/div · 5 ms/div · TRIG ↑</span>
      </div>

      <div className={styles.meterBlock} aria-live="polite">
        <p className={styles.meterLabel}>{meter.label}</p>
        <p className={styles.meterValue}>
          <span className={styles.meterFrom}>{formatMeter(meter, meter.from)}</span>
          <span aria-hidden="true" className={styles.meterArrow}>
            →
          </span>
          <strong>{formatMeter(meter, value)}</strong>
        </p>
        <p className={styles.meterNote}>{meter.note}</p>
      </div>

      <div className={styles.readout}>
        <p className={styles.readoutRole}>{unit.role}</p>
        <h2 className={styles.readoutTitle}>{unit.org}</h2>
        <p className={styles.readoutHead}>{unit.headline}</p>
        <p className={styles.readoutBody}>{unit.body}</p>

        <dl className={styles.measured}>
          {unit.metrics.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        {unit.stack.length > 0 && (
          <ul className={styles.chips} aria-label={`${unit.org} stack`}>
            {unit.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {unit.links && (
          <div className={styles.readoutLinks}>
            {unit.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.linkButton}
                {...(link.href.startsWith('http')
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------- page */

const specSheet = [
  { label: 'Name', value: 'Devon Bull' },
  { label: 'Title', value: 'Solutions Architect, Big Nerd Ranch' },
  { label: 'Since', value: 'July 2018' },
  { label: 'Location', value: 'Raleigh, North Carolina' },
  { label: 'Client channels', value: 'Apple (2018–2020) · Chick-fil-A (2020–2022)' },
  { label: 'Peak scale touched', value: '15M users · $5M/day in delivery revenue' },
  { label: 'Languages', value: 'JavaScript · TypeScript · Go' },
  { label: 'Frameworks', value: 'Node · Express · Vue · React · Mongoose' },
  { label: 'Data', value: 'MongoDB · DynamoDB · Postgres' },
  { label: 'Tooling', value: 'AWS · Docker · Kubernetes · GitHub Actions · Git' },
  { label: 'Operations', value: 'Datadog · Splunk · OpsGenie · Jira · Confluence' },
  { label: 'Education', value: 'Turing School 2017 · B.A. Economics, Kansas 2015' }
]

export function CareerExperience() {
  const theme = useMachineTheme()
  const reduced = usePrefersReducedMotion()
  const webgl = useWebglSupported()
  const [activeId, setActiveId] = useState('apple')
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const scopeRef = useRef<HTMLDivElement>(null)

  const unit = unitsById[activeId]
  const live = webgl === true && !reduced

  const select = useCallback((id: string) => {
    if (!unitsById[id]) return
    setActiveId(id)
    setTouched(true)
  }, [])

  const selectFromCanvas = useCallback(
    (id: string) => {
      select(id)
      if (window.matchMedia('(max-width: 1080px)').matches) {
        scopeRef.current?.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'start'
        })
      }
    },
    [select, reduced]
  )

  useEffect(() => {
    if (!live) return
    const timer = window.setTimeout(() => setTouched(true), 15000)
    return () => window.clearTimeout(timer)
  }, [live])

  return (
    <main className={styles.page}>
      <section className={styles.bench} aria-labelledby="career-title">
        <header className={styles.benchHead}>
          <div>
            <p className={styles.eyebrow}>Rack 01 · career · devon bull</p>
            <h1 id="career-title">Pull the unit. Read the meter.</h1>
            <p className={styles.lede}>
              Solutions Architect at Big Nerd Ranch since 2018. Backend lead on
              Apple’s chatbot while it went from 1M to 15M users, then
              engineering lead on Chick-fil-A’s third-party delivery integrations
              while daily revenue went from under $1M to $5M. Every unit in this
              rack is a real engagement with a real number on the front panel.
            </p>
          </div>
          <ul className={styles.statusStack} aria-label="Rack status">
            <li>
              <i className={styles.ledOk} aria-hidden="true" />
              PWR OK
            </li>
            <li>
              <i className={styles.ledSignal} aria-hidden="true" />
              {live ? 'RACK LIVE' : 'ELEVATION'}
            </li>
            <li>
              <i className={styles.ledAmber} aria-hidden="true" />
              {rackUnits.length} UNITS
            </li>
          </ul>
        </header>

        <div className={styles.instrument}>
          <div className={styles.viewport}>
            <div className={styles.viewportInner}>
              {live ? (
                <RackScene
                  theme={theme}
                  activeId={activeId}
                  onSelect={selectFromCanvas}
                  onHover={setHoverId}
                />
              ) : (
                <RackElevation activeId={activeId} onSelect={select} />
              )}
            </div>

            <div className={styles.viewportRail}>
              <span className={styles.railTag}>
                {live ? 'DRAG TO TILT · CLICK A UNIT' : 'STATIC RACK ELEVATION'}
              </span>
              <span className={styles.railTag}>
                {hoverId
                  ? `HOVER ${unitsById[hoverId].slot} · ${unitsById[hoverId].org}`
                  : `PULLED ${unit.slot} · ${unit.org}`}
              </span>
            </div>

            {live && !touched && (
              <p className={styles.coach} aria-hidden="true">
                <span>1 · drag to tilt the rack</span>
                <span>2 · click a unit to pull it out</span>
              </p>
            )}
          </div>

          <div className={styles.channels}>
            <p className={styles.channelsLabel}>Rack units</p>
            <div className={styles.channelGrid} role="group" aria-label="Rack units">
              {rackUnits.map((item) => {
                const isActive = item.id === activeId
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={isActive ? styles.channelActive : styles.channel}
                    aria-pressed={isActive}
                    onClick={() => select(item.id)}
                    onMouseEnter={() => setHoverId(item.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onFocus={() => setHoverId(item.id)}
                    onBlur={() => setHoverId(null)}
                  >
                    <span className={styles.channelDesignator}>
                      <i aria-hidden="true" />
                      {item.slot} · {item.window}
                    </span>
                    <span className={styles.channelName}>{item.org}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className={styles.scopeColumn} ref={scopeRef}>
            <Scope unit={unit} live={live} animate={!reduced} />
          </div>
        </div>
      </section>

      <section className={styles.bom} aria-labelledby="log-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Service log</p>
          <h2 id="log-title">The whole rack in plain text.</h2>
          <p>
            No canvas, no drag, no meters — the same seven units written out for
            anyone who would rather read than click, including screen readers,
            printers and hiring managers in a hurry.
          </p>
        </div>

        <ol className={styles.bomList}>
          {rackUnits.map((item) => (
            <li key={item.id} id={`unit-${item.id}`}>
              <article className={styles.bomRow}>
                <div className={styles.bomIdent}>
                  <span className={styles.bomDesignator}>SLOT {item.slot}</span>
                  <h3>{item.org}</h3>
                  <p className={styles.bomRole}>{item.role}</p>
                  <p className={styles.bomNet}>{item.window}</p>
                </div>
                <div className={styles.bomText}>
                  <p className={styles.bomHead}>{item.headline}</p>
                  <p>{item.body}</p>
                  <dl className={styles.bomMetrics}>
                    {item.metrics.map((row) => (
                      <div key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  {item.stack.length > 0 && (
                    <ul className={styles.chips}>
                      {item.stack.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.spec} aria-labelledby="spec-title">
        <div className={styles.specInner}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Datasheet</p>
            <h2 id="spec-title">Absolute maximum ratings.</h2>
          </div>
          <dl className={styles.specGrid}>
            {specSheet.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.specActions}>
            <Link className={styles.primaryAction} href="mailto:devjbull@gmail.com">
              devjbull@gmail.com <span aria-hidden="true">↗</span>
            </Link>
            <Link
              className={styles.secondaryAction}
              href="https://www.linkedin.com/in/bulldevon"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </Link>
            <Link
              className={styles.secondaryAction}
              href="https://github.com/DBULL7"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </Link>
            <Link className={styles.secondaryAction} href="/systems">
              Run the system <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className={styles.patchNote}>
            {patches.length} patch cables · {rackUnits.length} units · one firm
          </p>
        </div>
      </section>
    </main>
  )
}
