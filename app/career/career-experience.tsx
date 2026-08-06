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

// TODO(devon): the résumé on file ends in 2022. Confirm current title and any
// client work since the Chick-fil-A engagement, then add a sixth transmission.
const transmissions: Transmission[] = [
  {
    id: 'haller',
    index: '00',
    word: 'HALLER',
    caption: 'transmission 00',
    kicker: 'Origin · 2015',
    title: 'I shipped the prototype before I could call myself an engineer.',
    body: [
      'In 2015 I was COO of Haller. I wrote the business plan, got us admitted to a business accelerator, and then — because there was nobody else to hand it to — taught myself Sketch and enough Swift to build the prototype myself. My degree is in economics, not computer science.',
      'That year left me with the instinct I still lead with: every technical decision is a bet with a due date and a burn rate attached. Turing School followed in 2017, deliberately. I had already proven I could learn a stack under pressure; I wanted to learn one properly.'
    ],
    readout: [
      { k: 'Role', v: 'COO, Haller' },
      { k: 'Result', v: 'Accelerator admission' },
      { k: 'Self-taught', v: 'Sketch · Swift prototype' },
      { k: 'Education', v: 'Turing School 2017 · B.A. Economics, Kansas 2015' }
    ]
  },
  {
    id: 'firm',
    index: '01',
    word: 'BIG NERD RANCH',
    caption: 'transmission 01',
    kicker: 'The arc · since 2018',
    title: 'One firm since 2018. Big Nerd Ranch, Solutions Architect.',
    body: [
      'My whole engineering career has been with a single consulting firm, which means an unusual number of first days. You land in a codebase you did not write, beside a team that already made its decisions, against a deadline that predates you. Being useful in week one and trusted by week four is the actual skill — the languages are the easy part.',
      'It also means my work gets scored in somebody else’s numbers: their uptime, their revenue per order, their page load. That turns out to be a very honest way to keep score.'
    ],
    readout: [
      { k: 'Employer', v: 'Big Nerd Ranch' },
      { k: 'Since', v: 'July 2018' },
      { k: 'Title', v: 'Solutions Architect' },
      { k: 'Mode', v: 'Placed inside client engineering teams' }
    ]
  },
  {
    id: 'apple',
    index: '02',
    word: 'APPLE',
    caption: 'transmission 02',
    kicker: 'Client engagement · 2018–2020',
    title:
      'Backend lead on Apple’s chatbot, from one million users to fifteen.',
    body: [
      'Two years as backend lead on Apple’s chatbot platform. I implemented the Apple Card integration and helped coordinate its launch, and helped carry the frontend off Angular 1 and onto Vue while the product stayed live in front of everybody.',
      'The numbers are the argument. Page load from sixty seconds to two. A critical service refactored from ES5 to ES6. Node 5 to Node 12 under production traffic. And 100% uptime while the audience went from one million users to fifteen million. At that volume you stop guessing: instrument first, keep every change reversible, and write the failure path before the feature.'
    ],
    readout: [
      { k: 'Client', v: 'Apple' },
      { k: 'Role', v: 'Backend lead' },
      { k: 'Years', v: '2018 – 2020' },
      { k: 'Shipped', v: 'Apple Card integration' },
      { k: 'Page load', v: '60s → 2s' },
      { k: 'Scale', v: '1M → 15M users · 100% uptime' },
      { k: 'Migrations', v: 'Angular 1 → Vue · Node 5 → 12' }
    ]
  },
  {
    id: 'chickfila',
    index: '03',
    word: 'CHICK-FIL-A',
    caption: 'transmission 03',
    kicker: 'Client engagement · 2020–2022',
    title:
      'Project engineering lead for third-party delivery, straight through the pandemic.',
    body: [
      'Two years leading Chick-fil-A’s third-party delivery integrations. DoorDash, UberEats and Grubhub arrive as three different opinions about what an order is, and have to resolve into one system that a restaurant can actually run on. I held that work through the steepest growth curve any of us had seen: under $1M a day when I started, $5M a day by 2022.',
      'Specifics, because they are the point. Combo meals on UberEats, worth roughly ten percent more average revenue per order. Checkout with DoorDash inside the Chick-fil-A iOS app, coordinated directly with DoorDash’s engineers. A migration of the project’s infrastructure onto AWS CloudFormation. And a long, unglamorous push on logging, monitoring and observability — because at that volume the question is never “is something broken”, it is “whose”.'
    ],
    readout: [
      { k: 'Client', v: 'Chick-fil-A' },
      { k: 'Role', v: 'Project engineering lead' },
      { k: 'Years', v: '2020 – 2022' },
      { k: 'Partners', v: 'DoorDash · UberEats · Grubhub' },
      { k: 'Revenue', v: '<$1M → $5M per day' },
      { k: 'Lift', v: '~10% higher revenue per order' },
      { k: 'Infrastructure', v: 'Migrated to AWS CloudFormation' }
    ]
  },
  {
    id: 'range',
    index: '04',
    word: 'RANGE',
    caption: 'transmission 04',
    kicker: 'The stack behind the numbers',
    title: 'What I actually build with.',
    body: [
      'JavaScript, TypeScript and Go. Node and Express on the server, Vue and React on the surface. State in MongoDB, DynamoDB or Postgres, chosen from the access pattern rather than from habit. AWS, Docker, Kubernetes and GitHub Actions underneath. Datadog, Splunk and OpsGenie for the part of the job that happens at three in the morning.',
      'Before the client work there was a freelance rewrite of a WordPress site onto React, Redux, Express and MongoDB — accounts, tour management, a message board — which is where I first owned an entire system end to end. Lately I spend real hours on applied AI, treated exactly like a delivery partner: a component with wide error bars, wrapped in a fallback path.'
    ],
    readout: [
      { k: 'Languages', v: 'JavaScript · TypeScript · Go' },
      { k: 'Server', v: 'Node · Express' },
      { k: 'Interface', v: 'Vue · React' },
      { k: 'State', v: 'MongoDB · DynamoDB · Postgres' },
      { k: 'Cloud', v: 'AWS · Docker · Kubernetes · GitHub Actions' },
      { k: 'Signal', v: 'Datadog · Splunk · OpsGenie' }
    ]
  }
]

const HERO_MASK: SignalMask = {
  text: 'DEVON BULL',
  caption: 'senior engineer',
  oy: 0.4,
  ox: 0.14,
  scale: 0.86
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
      ? {
          text: t.word,
          caption: t.caption,
          ox: 0.17,
          oy: -0.27,
          scale: 0.88
        }
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
          gain={activeId === 'hero' ? 1 : 0.74}
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
            I am Devon Bull — a software engineer and Solutions Architect in
            Raleigh, North Carolina. Economics degree, a startup I helped run, a
            prototype I taught myself to build, then a bootcamp. Since 2018 I
            have worked for one consulting firm, <strong>Big Nerd Ranch</strong>
            , leading backend and platform work inside two of the largest
            consumer brands in America: <strong>Apple</strong>’s chatbot as it
            went from one million to fifteen million users, and{' '}
            <strong>Chick-fil-A</strong>’s third-party delivery integrations as
            they went from under $1M to $5M a day.
          </p>
          <p className={styles.heroNote}>
            Scroll and each section resolves out of the noise. Or don’t — every
            word below is ordinary text, in order, whether or not the field is
            running.
          </p>

          <dl className={styles.readoutStrip}>
            {[
              { k: 'Firm', v: 'Big Nerd Ranch · since 2018' },
              { k: 'Role', v: 'Solutions Architect' },
              { k: 'Scale', v: '1M → 15M users' },
              { k: 'Throughput', v: '$1M → $5M per day' }
            ].map((item) => (
              <div key={item.k}>
                <dt>{item.k}</dt>
                <dd>{item.v}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#transmission-haller">
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
            The work I want has real traffic on it, integrations that fight
            back, and a team that would rather be correct than comfortable. If
            that is the room you are standing in, say something.
          </p>
          <div className={styles.contactLinks}>
            <a href="mailto:devjbull@gmail.com">
              devjbull@gmail.com <span aria-hidden="true">↗</span>
            </a>
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
