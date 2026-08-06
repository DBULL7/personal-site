'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SPEEDS, stages, stagesById } from './systems-data'
import type { MachineEvent } from '@/components/machine/cutaway-scene'
import {
  useMachineTheme,
  usePrefersReducedMotion,
  useWebglSupported
} from '@/components/machine/machine-core'
import styles from './systems.module.css'

const CutawayScene = dynamic(
  () =>
    import('@/components/machine/cutaway-scene').then(
      (mod) => mod.CutawayScene
    ),
  {
    ssr: false,
    loading: () => <div className={styles.sceneLoading} aria-hidden="true" />
  }
)

type LogLine = {
  id: number
  kind: string
  stage: string
  text: string
  at: number
}

const EVENT_COPY: Record<
  MachineEvent,
  { kind: string; text: (stage: string) => string }
> = {
  enter: { kind: 'ok', text: (stage) => `${stage} accepted the request` },
  fault: { kind: 'err', text: (stage) => `${stage} fault injected` },
  breaker: {
    kind: 'warn',
    text: () => 'retries exhausted · circuit breaker OPEN'
  },
  bypass: {
    kind: 'info',
    text: () =>
      'degraded path engaged · order buffered, customer told the truth'
  },
  rejoin: { kind: 'ok', text: () => 'rejoined the primary path' },
  complete: { kind: 'done', text: () => 'order acknowledged end to end' }
}

/* ------------------------------------------------------- static cross-section */

const PLAN_W = 1200
const PLAN_H = 460

function CrossSection({
  activeId,
  faults,
  onSelect
}: {
  activeId: string
  faults: Record<string, boolean>
  onSelect: (id: string) => void
}) {
  const boxW = 190
  const gap = (PLAN_W - 80 - boxW * stages.length) / (stages.length - 1)
  return (
    <div className={styles.planWrap}>
      <svg
        className={styles.plan}
        viewBox={`0 0 ${PLAN_W} ${PLAN_H}`}
        role="img"
        aria-label="Cross-section of the request path: edge, service, data, runtime, feedback."
      >
        <line
          x1="10"
          y1={PLAN_H / 2}
          x2={PLAN_W - 10}
          y2={PLAN_H / 2}
          className={styles.planBus}
        />
        {stages.map((stage, index) => {
          const x = 40 + index * (boxW + gap)
          const faulted = faults[stage.id]
          const active = stage.id === activeId
          return (
            <g
              key={stage.id}
              className={
                faulted
                  ? styles.planStageFault
                  : active
                    ? styles.planStageActive
                    : styles.planStage
              }
              onClick={() => onSelect(stage.id)}
            >
              <rect
                x={x}
                y={PLAN_H / 2 - 110}
                width={boxW}
                height="220"
                rx="6"
              />
              <text x={x + 18} y={PLAN_H / 2 - 66} className={styles.planCode}>
                {stage.code}
              </text>
              <text x={x + 18} y={PLAN_H / 2 - 22}>
                {stage.name.toUpperCase()}
              </text>
              <text x={x + 18} y={PLAN_H / 2 + 22} className={styles.planTool}>
                {stage.tools[0].toUpperCase()}
              </text>
              <text x={x + 18} y={PLAN_H / 2 + 52} className={styles.planTool}>
                {(stage.tools[1] ?? '').toUpperCase()}
              </text>
              {faulted && (
                <text
                  x={x + 18}
                  y={PLAN_H / 2 + 92}
                  className={styles.planFaultTag}
                >
                  FAULT ARMED
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* -------------------------------------------------------------------- page */

export function SystemsExperience() {
  const theme = useMachineTheme()
  const reduced = usePrefersReducedMotion()
  const webgl = useWebglSupported()
  const live = webgl === true && !reduced

  const [running, setRunning] = useState(true)
  const [speedIndex, setSpeedIndex] = useState(1)
  const [explode, setExplode] = useState(0)
  const [faults, setFaults] = useState<Record<string, boolean>>({})
  const [activeId, setActiveId] = useState('service')
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [stepToken, setStepToken] = useState(0)
  const [log, setLog] = useState<LogLine[]>([])
  const logId = useRef(0)

  const stage = stagesById[activeId]
  const faultCount = Object.values(faults).filter(Boolean).length

  const pushEvent = useCallback(
    (event: MachineEvent, stageId: string, at: number) => {
      const copy = EVENT_COPY[event]
      const name = stagesById[stageId]?.name.toUpperCase() ?? 'BUS'
      const text =
        event === 'fault'
          ? `${name} · ${stagesById[stageId]?.faultLine ?? 'fault'}`
          : copy.text(name)
      logId.current += 1
      const line: LogLine = {
        id: logId.current,
        kind: copy.kind,
        stage: name,
        text,
        at: Math.round(at)
      }
      setLog((current) => [line, ...current].slice(0, 12))
    },
    []
  )

  const toggleFault = useCallback((id: string) => {
    setFaults((current) => ({ ...current, [id]: !current[id] }))
    setActiveId(id)
  }, [])

  useEffect(() => {
    if (live) return
    setLog([])
  }, [live])

  return (
    <main className={styles.page}>
      <section className={styles.bench} aria-labelledby="systems-title">
        <header className={styles.benchHead}>
          <div>
            <p className={styles.eyebrow}>SYS-1 · order path · cutaway</p>
            <h1 id="systems-title">Break it on purpose.</h1>
            <p className={styles.lede}>
              This is the shape of the system I spent two years inside: a
              third-party delivery order entering Chick-fil-A’s platform from
              DoorDash, UberEats or Grubhub and coming back out acknowledged.
              Run it, slow it down, pull it apart, or kill a stage and watch
              what the rest of the machine does about it.
            </p>
          </div>
          <ul className={styles.statusStack} aria-label="Machine status">
            <li>
              <i
                className={running && live ? styles.ledOk : styles.ledAmber}
                aria-hidden="true"
              />
              {!live ? 'STATIC' : running ? 'RUNNING' : 'HELD'}
            </li>
            <li>
              <i className={styles.ledSignal} aria-hidden="true" />
              {live ? `${SPEEDS[speedIndex]}× RATE` : 'REDUCED MOTION'}
            </li>
            <li>
              <i
                className={faultCount ? styles.ledFault : styles.ledOk}
                aria-hidden="true"
              />
              {faultCount} FAULT{faultCount === 1 ? '' : 'S'} ARMED
            </li>
          </ul>
        </header>

        <div className={styles.instrument}>
          <div className={styles.column}>
            <div className={styles.viewport}>
              <div className={styles.viewportInner}>
                {live ? (
                  <CutawayScene
                    theme={theme}
                    running={running}
                    speed={SPEEDS[speedIndex]}
                    explode={explode}
                    faults={faults}
                    activeId={activeId}
                    stepToken={stepToken}
                    onSelect={setActiveId}
                    onHover={setHoverId}
                    onEvent={pushEvent}
                  />
                ) : (
                  <CrossSection
                    activeId={activeId}
                    faults={faults}
                    onSelect={setActiveId}
                  />
                )}
              </div>
              <div className={styles.viewportRail}>
                <span className={styles.railTag}>
                  {live
                    ? 'DRAG TO TILT · CLICK A MODULE'
                    : 'STATIC CROSS-SECTION'}
                </span>
                <span className={styles.railTag}>
                  {hoverId
                    ? `HOVER ${stagesById[hoverId].code} · ${stagesById[hoverId].name}`
                    : `SELECTED ${stage.code} · ${stage.name}`}
                </span>
              </div>
            </div>

            <div className={styles.transport}>
              <div className={styles.transportRow}>
                <button
                  type="button"
                  className={
                    running ? styles.runButtonActive : styles.runButton
                  }
                  onClick={() => setRunning((value) => !value)}
                  aria-pressed={running}
                  disabled={!live}
                >
                  <i aria-hidden="true" />
                  {running ? 'Pause' : 'Run'}
                </button>
                <button
                  type="button"
                  className={styles.stepButton}
                  onClick={() => {
                    setRunning(false)
                    setStepToken((token) => token + 1)
                  }}
                  disabled={!live}
                >
                  Step ▸
                </button>

                <div
                  className={styles.speedGroup}
                  role="group"
                  aria-label="Playback rate"
                >
                  {SPEEDS.map((value, index) => (
                    <button
                      key={value}
                      type="button"
                      className={
                        index === speedIndex ? styles.speedActive : styles.speed
                      }
                      aria-pressed={index === speedIndex}
                      onClick={() => setSpeedIndex(index)}
                      disabled={!live}
                    >
                      {value}×
                    </button>
                  ))}
                </div>

                <label className={styles.slider}>
                  <span>Cutaway</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(explode * 100)}
                    onChange={(event) =>
                      setExplode(Number(event.target.value) / 100)
                    }
                    disabled={!live}
                  />
                </label>
              </div>

              <div className={styles.faultRow}>
                <p className={styles.transportLabel}>Fault injection</p>
                <div
                  className={styles.faultGrid}
                  role="group"
                  aria-label="Inject a fault"
                >
                  {stages.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={
                        faults[item.id] ? styles.faultOn : styles.fault
                      }
                      aria-pressed={Boolean(faults[item.id])}
                      onClick={() => toggleFault(item.id)}
                      onMouseEnter={() => setHoverId(item.id)}
                      onMouseLeave={() => setHoverId(null)}
                    >
                      <i aria-hidden="true" />
                      {item.code} {item.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={styles.clearButton}
                    onClick={() => setFaults({})}
                    disabled={faultCount === 0}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.logColumn}>
            <div className={styles.scope}>
              <div className={styles.scopeHead}>
                <span className={styles.scopeChannel}>
                  <i className={styles.ledSignal} aria-hidden="true" />
                  EVENT LOG
                </span>
                <span className={styles.scopeHeadRight}>
                  {live ? 'STREAMING' : 'STATIC'}
                </span>
              </div>
              <ol className={styles.log} aria-live="polite">
                {log.length === 0 && (
                  <li className={styles.logIdle}>
                    {live
                      ? 'waiting for the first request…'
                      : 'live trace disabled — the written incident walkthrough is below.'}
                  </li>
                )}
                {log.map((line) => (
                  <li key={line.id} className={styles[`log_${line.kind}`]}>
                    <span className={styles.logTime}>t+{line.at}ms</span>
                    <span className={styles.logKind}>
                      {line.kind.toUpperCase()}
                    </span>
                    <span>{line.text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.scope}>
              <div className={styles.scopeHead}>
                <span className={styles.scopeChannel}>
                  <i className={styles.ledSignal} aria-hidden="true" />
                  STAGE {stage.code}
                </span>
                <span className={styles.scopeHeadRight}>
                  {faults[stage.id] ? 'FAULT ARMED' : 'HEALTHY'}
                </span>
              </div>
              <div className={styles.readout}>
                <p className={styles.readoutRole}>{stage.strap}</p>
                <h2 className={styles.readoutTitle}>{stage.name}</h2>
                <p className={styles.readoutBody}>{stage.what}</p>
                <p className={styles.blockLabel}>The decision that shaped it</p>
                <p className={styles.readoutBody}>{stage.decision}</p>
                <div className={styles.faultBlock}>
                  <p className={styles.faultTitle}>If this fails</p>
                  <p className={styles.faultLine}>{stage.faultLine}</p>
                  <p className={styles.readoutBody}>{stage.faultDetail}</p>
                </div>
                <dl className={styles.measured}>
                  {stage.evidence.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <ul className={styles.chips} aria-label={`${stage.name} tools`}>
                  {stage.tools.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.bom} aria-labelledby="path-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Written walkthrough</p>
          <h2 id="path-title">The same path, in plain text.</h2>
          <p>
            Every stage of the machine, the decision that shaped it, and what
            happens when it breaks — readable without a canvas, a mouse or a
            GPU.
          </p>
        </div>

        <ol className={styles.bomList}>
          {stages.map((item) => (
            <li key={item.id} id={`stage-${item.id}`}>
              <article className={styles.bomRow}>
                <div className={styles.bomIdent}>
                  <span className={styles.bomDesignator}>
                    STAGE {item.code}
                  </span>
                  <h3>{item.name}</h3>
                  <p className={styles.bomRole}>{item.strap}</p>
                </div>
                <div className={styles.bomText}>
                  <p className={styles.bomHead}>{item.what}</p>
                  <p>{item.decision}</p>
                  <p className={styles.bomFault}>
                    <strong>Failure mode — {item.faultLine}.</strong>{' '}
                    {item.faultDetail}
                  </p>
                  <dl className={styles.bomMetrics}>
                    {item.evidence.map((row) => (
                      <div key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <ul className={styles.chips}>
                    {item.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.spec} aria-labelledby="close-title">
        <div className={styles.specInner}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Operator</p>
            <h2 id="close-title">Built by the person on call for it.</h2>
          </div>
          <p className={styles.closing}>
            Project engineering lead on Chick-fil-A’s third-party delivery
            integrations from 2020 to 2022, through the Covid demand curve that
            took daily delivery revenue from under $1M to $5M. Before that,
            backend lead on Apple’s chatbot while it went from 1M to 15M users
            with 100% uptime. Since then, two years as the sole engineer on
            Apple’s cloud-resource UI and now Apple’s internal cloud site as it
            grows into a full developer portal. Seven years, one firm: Stellar
            Elements, formerly Big Nerd Ranch, an Amdocs company.
          </p>
          <div className={styles.specActions}>
            <Link className={styles.primaryAction} href="/career">
              See the rack <span aria-hidden="true">→</span>
            </Link>
            <Link
              className={styles.secondaryAction}
              href="mailto:devjbull@gmail.com"
            >
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
          </div>
        </div>
      </section>
    </main>
  )
}
