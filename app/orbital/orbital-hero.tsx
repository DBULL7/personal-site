'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ORBITAL_ARRIVAL_DURATION,
  SpaceScene,
  type OrbitalArrivalPhase,
  type OrbitalView
} from '@/components/space/space-scene'
import styles from '../space-experiences.module.css'

const traffic = [
  {
    name: 'An Interesting Definition of Urgent',
    class: 'GCU',
    status: 'Inbound · Rim port 04'
  },
  {
    name: 'Perfectly Reasonable From Here',
    class: 'GSV',
    status: 'Holding · off-spin'
  },
  {
    name: 'Please Hold That Thought',
    class: 'VFP',
    status: 'Departing · stellar north'
  },
  {
    name: 'The Scenic Route Was Intentional',
    class: 'Passenger',
    status: 'Docking · rim 31'
  },
  {
    name: 'Some Assembly Preferred',
    class: 'Module',
    status: 'Inbound · plate 08'
  }
] as const

const arrivalTelemetry: Record<
  OrbitalArrivalPhase,
  { eyebrow: string; title: string; status: string; velocity: string }
> = {
  grid: {
    eyebrow: 'External camera · field fin 02',
    title: 'Traction on the Energy Grid',
    status: 'Infraspace transit',
    velocity: 'FTL'
  },
  translation: {
    eyebrow: 'Engine field translation',
    title: 'Induced singularity collapsing',
    status: 'Realspace acquisition',
    velocity: 'Translating'
  },
  approach: {
    eyebrow: 'Realspace · Orbital acquisition locked',
    title: 'An impossible horizon, rapidly resolving',
    status: 'Closing on overview vector',
    velocity: 'Braking from high sublight'
  },
  complete: {
    eyebrow: 'Observation vector · acquired',
    title: 'The Orbital',
    status: 'Overview established',
    velocity: 'Relative hold'
  }
}

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

function useOrbitalAudio(enabled: boolean, phase: OrbitalArrivalPhase, view: OrbitalView) {
  const flightStateRef = useRef({ phase, view })

  useEffect(() => {
    flightStateRef.current = { phase, view }
  }, [phase, view])

  useEffect(() => {
    if (!enabled) return

    const AudioContextClass = window.AudioContext ?? (window as AudioWindow).webkitAudioContext
    if (!AudioContextClass) return

    const context = new AudioContextClass()
    const master = context.createGain()
    master.gain.setValueAtTime(0.0001, context.currentTime)
    master.gain.exponentialRampToValueAtTime(0.024, context.currentTime + 1.8)
    master.connect(context.destination)

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let index = 0; index < noiseData.length; index += 1) {
      noiseData[index] = Math.random() * 2 - 1
    }
    const fieldNoise = context.createBufferSource()
    const fieldFilter = context.createBiquadFilter()
    const fieldLevel = context.createGain()
    fieldNoise.buffer = noiseBuffer
    fieldNoise.loop = true
    fieldFilter.type = 'lowpass'
    fieldFilter.frequency.value = 740
    fieldFilter.Q.value = 1.8
    fieldLevel.gain.value = 0.02
    fieldNoise.connect(fieldFilter).connect(fieldLevel).connect(master)
    fieldNoise.start()

    const drone = [
      { frequency: 37, type: 'sine' as OscillatorType, gain: 0.5 },
      { frequency: 55.5, type: 'triangle' as OscillatorType, gain: 0.16 }
    ].map(({ frequency, type, gain }) => {
      const oscillator = context.createOscillator()
      const level = context.createGain()
      oscillator.frequency.value = frequency
      oscillator.type = type
      level.gain.value = gain
      oscillator.connect(level).connect(master)
      oscillator.start()
      return oscillator
    })

    const sendPing = () => {
      const oscillator = context.createOscillator()
      const level = context.createGain()
      const now = context.currentTime
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(620, now)
      oscillator.frequency.exponentialRampToValueAtTime(390, now + 1.8)
      level.gain.setValueAtTime(0.0001, now)
      level.gain.exponentialRampToValueAtTime(0.035, now + 0.08)
      level.gain.exponentialRampToValueAtTime(0.0001, now + 1.8)
      oscillator.connect(level).connect(master)
      oscillator.start(now)
      oscillator.stop(now + 1.85)
    }

    void context.resume()
    const pingTimer = window.setInterval(sendPing, 14000)
    const firstPing = window.setTimeout(sendPing, 2100)
    const fieldTimer = window.setInterval(() => {
      const current = flightStateRef.current
      const inArrival = current.view === 'arrival'
      const targetLevel = !inArrival
        ? 0.012
        : current.phase === 'grid'
          ? 0.44
          : current.phase === 'translation'
            ? 0.22
            : current.phase === 'approach'
              ? 0.045
              : 0.018
      const targetFrequency = current.phase === 'grid' ? 980 : current.phase === 'translation' ? 560 : 240
      fieldLevel.gain.setTargetAtTime(targetLevel, context.currentTime, 0.16)
      fieldFilter.frequency.setTargetAtTime(targetFrequency, context.currentTime, 0.24)
    }, 180)

    return () => {
      window.clearInterval(pingTimer)
      window.clearTimeout(firstPing)
      window.clearInterval(fieldTimer)
      const now = context.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now)
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
      drone.forEach((oscillator) => oscillator.stop(now + 0.2))
      fieldNoise.stop(now + 0.2)
      window.setTimeout(() => void context.close(), 240)
    }
  }, [enabled])
}

export function OrbitalHero() {
  const [view, setView] = useState<OrbitalView>('arrival')
  const [skipIntro, setSkipIntro] = useState(false)
  const [introVisible, setIntroVisible] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [trafficIndex, setTrafficIndex] = useState(0)
  const [arrivalRun, setArrivalRun] = useState(0)
  const [arrivalPhase, setArrivalPhase] = useState<OrbitalArrivalPhase>('grid')
  const [arrivalElapsed, setArrivalElapsed] = useState(0)

  useOrbitalAudio(soundEnabled, arrivalPhase, view)

  useEffect(() => {
    if (window.sessionStorage.getItem('orbital-arrival-v6') === 'complete') {
      setView('overview')
      setSkipIntro(true)
      setIntroVisible(false)
    }
    const trafficTimer = window.setInterval(() => setTrafficIndex((current) => (current + 1) % traffic.length), 3600)
    return () => {
      window.clearInterval(trafficTimer)
    }
  }, [])

  useEffect(() => {
    if (view !== 'arrival' || arrivalPhase !== 'complete') return
    window.sessionStorage.setItem('orbital-arrival-v6', 'complete')
    setView('overview')
    setSkipIntro(true)
    setIntroVisible(false)
  }, [arrivalPhase, view])

  useEffect(() => {
    if (view !== 'arrival') return
    const startedAt = window.performance.now()
    setArrivalElapsed(0)
    const elapsedTimer = window.setInterval(() => {
      setArrivalElapsed(Math.min(ORBITAL_ARRIVAL_DURATION, (window.performance.now() - startedAt) / 1000))
    }, 200)
    return () => window.clearInterval(elapsedTimer)
  }, [arrivalRun, view])

  const handleArrivalPhase = useCallback((phase: OrbitalArrivalPhase) => {
    setArrivalPhase(phase)
    if (phase === 'complete') setArrivalElapsed(ORBITAL_ARRIVAL_DURATION)
  }, [])

  const selectView = (nextView: OrbitalView) => {
    setView(nextView)
    if (nextView === 'arrival') {
      setArrivalRun((run) => run + 1)
      setArrivalPhase('grid')
      setArrivalElapsed(0)
      setSkipIntro(false)
      setIntroVisible(true)
    } else {
      setSkipIntro(true)
      setIntroVisible(false)
    }
  }

  const skipApproach = () => {
    window.sessionStorage.setItem('orbital-arrival-v6', 'complete')
    setView('overview')
    setSkipIntro(true)
    setIntroVisible(false)
  }

  const currentTraffic = traffic[trafficIndex]
  const currentArrival = arrivalTelemetry[arrivalPhase]
  const arrivalActive = view === 'arrival'
  const arrivalProgress = Math.min(100, (arrivalElapsed / ORBITAL_ARRIVAL_DURATION) * 100)
  const remainingSeconds = Math.max(0, Math.ceil(ORBITAL_ARRIVAL_DURATION - arrivalElapsed))
  const arrivalEta = `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, '0')}`

  return (
    <section
      className={`${styles.hero} ${view === 'rim' ? styles.heroRim : ''} ${arrivalActive ? styles.heroArrival : ''}`}
      data-arrival-phase={arrivalActive ? arrivalPhase : undefined}
    >
      <SpaceScene
        mode="orbital"
        orbitalView={view}
        skipIntro={skipIntro}
        arrivalRun={arrivalRun}
        onArrivalPhaseChange={handleArrivalPhase}
      />
      {arrivalActive && <div className={styles.arrivalVeil} aria-hidden="true" />}
      {arrivalActive && (
        <div className={styles.arrivalIdentity}>
          <strong>Devon Bull</strong>
          <span>Senior software engineer · impossible systems enthusiast</span>
        </div>
      )}
      <div className={styles.heroContent}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Orbital approach · 001</p>
          <h1 className={styles.title}>
            Systems at <span className={styles.titleAccent}>impossible</span> scale.
          </h1>
          <p className={styles.lede}>
            I&apos;m Devon Bull, a senior software engineer drawn to ambitious systems, clear thinking, and the kind of
            technology that first feels like science fiction.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/career">
              Enter career map <span className={styles.actionArrow}>↗</span>
            </Link>
            <Link className={styles.secondaryAction} href="/systems">
              Inspect systems
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.orbitalControls} role="group" aria-label="Orbital view controls">
        <button
          className={`${styles.controlButton} ${view === 'arrival' ? styles.controlButtonActive : ''}`}
          type="button"
          aria-pressed={view === 'arrival'}
          onClick={() => selectView('arrival')}
        >
          Arrival
        </button>
        <button
          className={`${styles.controlButton} ${view === 'overview' ? styles.controlButtonActive : ''}`}
          type="button"
          aria-pressed={view === 'overview'}
          onClick={() => selectView('overview')}
        >
          Overview
        </button>
        <button
          className={`${styles.controlButton} ${view === 'rim' ? styles.controlButtonActive : ''}`}
          type="button"
          aria-pressed={view === 'rim'}
          onClick={() => selectView('rim')}
        >
          Rim flyby
        </button>
        <button
          className={`${styles.controlButton} ${soundEnabled ? styles.controlButtonActive : ''}`}
          type="button"
          aria-pressed={soundEnabled}
          onClick={() => setSoundEnabled((enabled) => !enabled)}
        >
          Sound {soundEnabled ? 'on' : 'off'}
        </button>
      </div>

      {introVisible && arrivalActive && (
        <button className={styles.skipApproach} type="button" onClick={skipApproach}>
          Skip arrival <span aria-hidden="true">→</span>
        </button>
      )}

      {arrivalActive && (
        <div className={styles.arrivalHud} aria-live="polite">
          <p className={styles.arrivalEyebrow}>{currentArrival.eyebrow}</p>
          <h2 className={styles.arrivalTitle}>{currentArrival.title}</h2>
          <div className={styles.arrivalReadout}>
            <div>
              <span>Status</span>
              <strong>{currentArrival.status}</strong>
            </div>
            <div>
              <span>Relative velocity</span>
              <strong>{currentArrival.velocity}</strong>
            </div>
            <div>
              <span>Overview in</span>
              <strong>{arrivalEta}</strong>
            </div>
          </div>
          <div
            className={styles.arrivalProgress}
            style={{ '--arrival-progress': `${arrivalProgress}%` } as React.CSSProperties}
            aria-hidden="true"
          >
            <span />
          </div>
        </div>
      )}

      {view === 'rim' && (
        <div className={styles.rimHud}>
          <p className={styles.rimIdentity}>Devon Bull · Senior software engineer</p>
          <p className={styles.rimEyebrow}>Rim transit · interior weather nominal</p>
          <h2 className={styles.rimTitle}>Look up. The ground continues.</h2>
          <div className={styles.trafficPanel} aria-live="polite">
            <span className={styles.trafficSignal} aria-hidden="true" />
            <div>
              <span className={styles.trafficClass}>{currentTraffic.class}</span>
              <strong className={styles.trafficName}>{currentTraffic.name}</strong>
              <span className={styles.trafficStatus}>{currentTraffic.status}</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.telemetry} aria-label="Orbital telemetry">
        <div className={styles.telemetryItem}>
          <span className={styles.telemetryValue}>3.0M km</span>
          <span className={styles.telemetryLabel}>Diameter</span>
        </div>
        <div className={styles.telemetryItem}>
          <span className={styles.telemetryValue}>~1 gravity</span>
          <span className={styles.telemetryLabel}>Spin habitat</span>
        </div>
        <div className={styles.telemetryItem}>
          <span className={styles.telemetryValue}>Open</span>
          <span className={styles.telemetryLabel}>To new signals</span>
        </div>
      </div>
    </section>
  )
}
