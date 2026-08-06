'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { DecodeText } from '@/components/signal/decode-text'
import { SignalFieldMount } from '@/components/signal/signal-field-mount'
import { createSignalState } from '@/components/signal/signal-types'
import type { SignalMask } from '@/components/signal/signal-types'

import styles from './career.module.css'

type Transmission = {
  id: string
  index: string
  word: string
  caption: string
  kicker: string
  title: string
  body: string[]
  readout: { k: string; v: string }[]
}

const transmissions: Transmission[] = [
  {
    id: 'founder',
    index: '00',
    word: 'FOUNDER',
    caption: 'transmission 00',
    kicker: 'Origin',
    title: 'Founder first. Engineer second. In that order, on purpose.',
    body: [
      'I started a tech company before anyone paid me to write software. I wrote the code, sold the thing, and did the arithmetic that decides whether a company still exists in ninety days. That is the part of engineering no tutorial covers: every technical decision is a bet with a due date attached.',
      'It left me with a habit I have never dropped. Before I ask what a system costs to build, I ask what it costs to own — on a Tuesday, eighteen months from now, when the person maintaining it has never met me.'
    ],
    readout: [
      { k: 'Role', v: 'Founder' },
      { k: 'Scope', v: 'Product · sales · code' },
      { k: 'Residue', v: 'Architecture is a budget' }
    ]
  },
  {
    id: 'consulting',
    index: '01',
    word: 'ONE FIRM',
    caption: 'transmission 01',
    kicker: 'The arc',
    title: 'One consulting firm. A long run of other people’s hardest rooms.',
    body: [
      'My whole engineering career has been with a single contracting and consulting firm, which means I have had an unusual number of first days. You land inside a codebase you did not write, beside a team that already made its decisions, against a deadline that predates you.',
      'The work is to be useful in week one and trusted by week four. Read the system before rewriting it. Find the load-bearing assumptions nobody documented. Ship something small and correct that proves you actually understood the thing — then earn the bigger swing.'
    ],
    readout: [
      { k: 'Employer', v: 'One firm, whole career' },
      { k: 'Mode', v: 'Embedded consultant' },
      { k: 'Cadence', v: 'New domain · new team · repeat' },
      { k: 'Core skill', v: 'Acquiring context fast' }
    ]
  },
  {
    id: 'apple',
    index: '02',
    word: 'APPLE',
    caption: 'transmission 02',
    kicker: 'Client engagement',
    title: 'Embedded engineering at Apple, where there is no hotfix on Friday.',
    body: [
      'An embedded engagement inside Apple: the seam where hardware and software have to behave as one product. What ships is what lives in somebody’s hand, and the review standard matches that.',
      'It rewires your defaults. You instrument before you theorise. You respect the timing budget as a hard wall, not a target. You write the failure path first, because the failure path is the product for everyone unlucky enough to find it.'
    ],
    readout: [
      { k: 'Client', v: 'Apple' },
      { k: 'Domain', v: 'Embedded engineering' },
      { k: 'Constraint', v: 'Ship-once semantics' },
      { k: 'Discipline', v: 'Measure, then assert' }
    ]
  },
  {
    id: 'chickfila',
    index: '03',
    word: 'CHICK-FIL-A',
    caption: 'transmission 03',
    kicker: 'Client engagement',
    title: 'Embedded systems for a working kitchen, at national scale.',
    body: [
      'A second embedded engagement, for Chick-fil-A, in an environment that is nothing like a lab: heat, noise, grease, staff turnover, thousands of locations, and no engineer within a hundred miles of almost any of them.',
      'Software here is graded on what it does at 12:15 on a Saturday. Recover without being asked. Fail loudly, to the one person who can act. Never require somebody mid-rush to understand your architecture in order to sell a sandwich.'
    ],
    readout: [
      { k: 'Client', v: 'Chick-fil-A' },
      { k: 'Domain', v: 'Embedded · operations' },
      { k: 'Constraint', v: 'Unattended, at scale' },
      { k: 'Discipline', v: 'Design for the worst hour' }
    ]
  },
  {
    id: 'range',
    index: '04',
    word: 'RANGE',
    caption: 'transmission 04',
    kicker: 'Beyond the device',
    title: 'Deep on devices. Not confined to them.',
    body: [
      'Embedded is where I go deep; it is not the edge of the map. I build product interfaces in TypeScript and React, services in Node and Go, and state in Postgres, DynamoDB or MongoDB — chosen from the access pattern, not from habit.',
      'Those run on AWS and Google Cloud, usually through Kubernetes, behind a CI/CD path I would be comfortable handing to someone on their second week. Datadog closes the loop. And I spend real hours on applied AI: agents, voice, and tooling treated as components with error bars rather than as magic.'
    ],
    readout: [
      { k: 'Interface', v: 'TypeScript · React' },
      { k: 'Services', v: 'Node.js · Go' },
      { k: 'State', v: 'Postgres · DynamoDB · MongoDB' },
      { k: 'Runtime', v: 'AWS · Google Cloud · Kubernetes' },
      { k: 'Feedback', v: 'CI/CD · Datadog' },
      { k: 'Exploring', v: 'Applied AI · agents · voice' }
    ]
  }
]

const HERO_MASK: SignalMask = {
  text: 'DEVON BULL',
  caption: 'senior engineer',
  oy: 0.27,
  ox: 0.15
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.2)

export function CareerExperience() {
  const stateRef = useRef(createSignalState())
  const rootRef = useRef<HTMLElement | null>(null)
  const snrRef = useRef<HTMLSpanElement | null>(null)
  const barRef = useRef<HTMLSpanElement | null>(null)
  const stationRef = useRef<HTMLSpanElement | null>(null)
  const [activeId, setActiveId] = useState('hero')
  const [locked, setLocked] = useState(false)
  const lockedRef = useRef(false)

  lockedRef.current = locked

  const mask = useMemo<SignalMask>(() => {
    if (activeId === 'hero') return HERO_MASK
    if (activeId === 'contact')
      return { text: 'OPEN', caption: 'signal outbound', ox: 0.16, oy: 0.08 }
    const t = transmissions.find((item) => item.id === activeId)
    return t
      ? { text: t.word, caption: t.caption, ox: 0.17, oy: -0.16 }
      : HERO_MASK
  }, [activeId])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>('[data-signal-section]')
    )
    if (!sections.length) return

    let raf = 0
    let current = ''

    const measure = () => {
      raf = 0
      const mid = window.innerHeight * 0.46
      let best: HTMLElement | null = null
      let bestDistance = Infinity
      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const distance = Math.abs(center - mid)
        if (distance < bestDistance) {
          bestDistance = distance
          best = section
        }
      }
      if (!best) return
      const span = Math.max(window.innerHeight * 0.52, 260)
      const proximity = easeOut(
        Math.max(0, Math.min(1, 1 - bestDistance / span))
      )
      const reveal = lockedRef.current ? 1 : proximity
      stateRef.current.reveal = reveal
      stateRef.current.energy = lockedRef.current ? 0.1 : (1 - proximity) * 0.7

      const id = best.dataset.signalSection ?? ''
      if (id !== current) {
        current = id
        setActiveId(id)
        if (stationRef.current) {
          stationRef.current.textContent = (
            best.dataset.signalLabel ?? id
          ).toUpperCase()
        }
      }
      if (snrRef.current) snrRef.current.textContent = reveal.toFixed(2)
      if (barRef.current) {
        const filled = Math.round(reveal * 10)
        barRef.current.textContent = `${'\u2588'.repeat(filled)}${'\u2591'.repeat(
          10 - filled
        )}`
      }
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const toggleLock = useCallback(() => {
    setLocked((value) => {
      const next = !value
      lockedRef.current = next
      if (next) {
        stateRef.current.reveal = 1
        stateRef.current.energy = 0.1
      }
      return next
    })
  }, [])

  return (
    <main
      ref={rootRef}
      data-signal=""
      data-locked={locked ? 'true' : undefined}
      className={styles.page}
    >
      <div className={styles.fieldLayer}>
        <SignalFieldMount
          stateRef={stateRef}
          mask={mask}
          gain={activeId === 'hero' ? 1 : 0.86}
        />
      </div>
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <aside className={styles.hud} aria-hidden="true">
        <span className={styles.hudLabel}>Carrier</span>
        <span ref={stationRef} className={styles.hudStation}>
          DEVON BULL
        </span>
        <span ref={barRef} className={styles.hudBar}>
          ░░░░░░░░░░
        </span>
        <span className={styles.hudSnr}>
          lock <span ref={snrRef}>0.00</span>
        </span>
      </aside>

      <div className={styles.content}>
        <section
          className={styles.hero}
          data-signal-section="hero"
          data-signal-label="Devon Bull"
          aria-labelledby="career-title"
        >
          <p className={styles.eyebrow}>
            <span>Signal</span>
            <span aria-hidden="true">·</span>
            <span>35.7796° N, 78.6382° W</span>
            <span aria-hidden="true">·</span>
            <span>Raleigh, North Carolina</span>
          </p>
          <h1 id="career-title" className={styles.heroTitle}>
            <DecodeText text="A résumé is a" duration={0.7} />{' '}
            <em>
              <DecodeText text="compressed" duration={1.1} delay={0.12} />
            </em>{' '}
            <DecodeText text="signal." duration={0.8} delay={0.25} />
          </h1>
          <p className={styles.heroLede}>
            I am Devon Bull — a senior software engineer in Raleigh, North
            Carolina. I ran a tech company before I ran a build pipeline. Now I
            work for one consulting firm and land inside other people’s systems:
            embedded engineering for <strong>Apple</strong> and{' '}
            <strong>Chick-fil-A</strong>, plus the full-stack and cloud work
            that surrounds a device once it starts talking.
          </p>
          <p className={styles.heroNote}>
            Scroll and each section resolves out of the noise. Or don’t — every
            word below is ordinary text, in order, whether or not the field is
            running.
          </p>

          <dl className={styles.readoutStrip}>
            {[
              { k: 'Firms', v: 'One' },
              { k: 'Clients', v: 'Apple · Chick-fil-A' },
              { k: 'Depth', v: 'Firmware → Kubernetes' },
              { k: 'Base', v: 'Raleigh, NC' }
            ].map((item) => (
              <div key={item.k}>
                <dt>{item.k}</dt>
                <dd>{item.v}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#transmission-founder">
              Begin decoding <span aria-hidden="true">↓</span>
            </a>
            <button
              type="button"
              className={styles.ghostAction}
              onClick={toggleLock}
              aria-pressed={locked}
            >
              {locked ? 'Field: locked' : 'Field: free-running'}
            </button>
          </div>
        </section>

        {transmissions.map((item) => (
          <section
            key={item.id}
            id={`transmission-${item.id}`}
            className={styles.transmission}
            data-signal-section={item.id}
            data-signal-label={item.word}
            aria-labelledby={`heading-${item.id}`}
          >
            <div className={styles.rail}>
              <span className={styles.railIndex} aria-hidden="true">
                {item.index}
              </span>
              <span className={styles.railKicker}>{item.kicker}</span>
              <dl className={styles.railReadout}>
                {item.readout.map((row) => (
                  <div key={row.k}>
                    <dt>{row.k}</dt>
                    <dd>{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={styles.body}>
              <h2 id={`heading-${item.id}`} className={styles.bodyTitle}>
                <DecodeText text={item.title} duration={1.15} />
              </h2>
              {item.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

        <section
          id="transmission-contact"
          className={styles.contact}
          data-signal-section="contact"
          data-signal-label="Open"
          aria-labelledby="contact-heading"
        >
          <p className={styles.railKicker}>Signal outbound</p>
          <h2 id="contact-heading" className={styles.contactTitle}>
            <DecodeText text="Currently listening." duration={1} />
          </h2>
          <p className={styles.contactBody}>
            The work I want has hardware, software and operations all holding a
            vote, and a team that would rather be correct than comfortable. If
            that is the room you are standing in, say something.
          </p>
          <div className={styles.contactLinks}>
            <a
              href="https://www.linkedin.com/in/bulldevon"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://github.com/DBULL7"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <Link href="/systems">
              The stack as a field <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
