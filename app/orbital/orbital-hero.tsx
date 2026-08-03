'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SpaceScene, type OrbitalView } from '@/components/space/space-scene'
import styles from '../space-experiences.module.css'

const traffic = [
  {
    name: 'An Interesting Definition of Urgent',
    class: 'GCU',
    status: 'Inbound · Hub vector 04'
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

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

function useOrbitalAudio(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const AudioContextClass = window.AudioContext ?? (window as AudioWindow).webkitAudioContext
    if (!AudioContextClass) return

    const context = new AudioContextClass()
    const master = context.createGain()
    master.gain.setValueAtTime(0.0001, context.currentTime)
    master.gain.exponentialRampToValueAtTime(0.024, context.currentTime + 1.8)
    master.connect(context.destination)

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
    const pingTimer = window.setInterval(sendPing, 5200)
    const firstPing = window.setTimeout(sendPing, 1300)

    return () => {
      window.clearInterval(pingTimer)
      window.clearTimeout(firstPing)
      const now = context.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now)
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
      drone.forEach((oscillator) => oscillator.stop(now + 0.2))
      window.setTimeout(() => void context.close(), 240)
    }
  }, [enabled])
}

export function OrbitalHero() {
  const [view, setView] = useState<OrbitalView>('overview')
  const [skipIntro, setSkipIntro] = useState(false)
  const [introVisible, setIntroVisible] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [trafficIndex, setTrafficIndex] = useState(0)

  useOrbitalAudio(soundEnabled)

  useEffect(() => {
    const introTimer = window.setTimeout(() => setIntroVisible(false), 7800)
    const trafficTimer = window.setInterval(() => setTrafficIndex((current) => (current + 1) % traffic.length), 3600)
    return () => {
      window.clearTimeout(introTimer)
      window.clearInterval(trafficTimer)
    }
  }, [])

  const selectView = (nextView: OrbitalView) => {
    setView(nextView)
    setSkipIntro(true)
    setIntroVisible(false)
  }

  const skipApproach = () => {
    setSkipIntro(true)
    setIntroVisible(false)
  }

  const currentTraffic = traffic[trafficIndex]

  return (
    <section className={`${styles.hero} ${view === 'rim' ? styles.heroRim : ''}`}>
      <SpaceScene mode="orbital" orbitalView={view} skipIntro={skipIntro} />
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

      {introVisible && (
        <button className={styles.skipApproach} type="button" onClick={skipApproach}>
          Skip approach <span aria-hidden="true">→</span>
        </button>
      )}

      {view === 'rim' && (
        <div className={styles.rimHud}>
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
