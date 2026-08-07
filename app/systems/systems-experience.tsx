'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { DecodeText } from '@/components/signal/decode-text'
import { SignalFieldMount } from '@/components/signal/signal-field-mount'
import { createSignalState } from '@/components/signal/signal-types'
import type { SignalMask, SignalNode } from '@/components/signal/signal-types'

import styles from './systems.module.css'

type Capability = {
  id: string
  index: string
  short: string
  name: string
  tools: string
  claim: string
  tradeoff: string
  /** position in the field, 0..1 */
  x: number
  y: number
}

const capabilities: Capability[] = [
  {
    id: 'product-ui',
    index: '01',
    short: 'PRODUCT UI',
    name: 'Product interface',
    tools: 'React · TypeScript · design partnership',
    claim: 'The component library is not the architecture. The state model is.',
    tradeoff:
      'I spent two years as the only engineer on an Apple product, which is the fastest way to learn that the first day of a UI belongs to enumerating which states are genuinely possible and making the impossible ones unrepresentable. It costs a day. It buys back the fortnight otherwise spent on defects that are really two booleans which should have been one union.',
    x: 0.18,
    y: 0.2
  },
  {
    id: 'platform',
    index: '02',
    short: 'DEV PLATFORM',
    name: 'Developer platform',
    tools: 'Internal tooling · cloud management · developer portal',
    claim: 'When your users are engineers, every rough edge gets multiplied.',
    tradeoff:
      'I build Apple’s internal cloud website, where engineers manage resources across Apple-internal infrastructure and third-party providers, and it is now growing into a full developer portal. Platform work rewards the unglamorous choice: one obvious path, named the same thing everywhere, that does not require reading the source to trust.',
    x: 0.45,
    y: 0.12
  },
  {
    id: 'scale',
    index: '03',
    short: 'SCALE',
    name: 'Traffic & scale',
    tools: 'Node · Express · high-volume consumer platforms',
    claim: 'At fifteen million users, every interesting failure is in a seam.',
    tradeoff:
      'Apple’s chatbot grew from one million users to fifteen million while I was backend lead on it, at 100% uptime. None of that was clever. It was refusing to ship anything I could not roll back, instrumenting before theorising, and treating every dependency as a thing that will eventually be down.',
    x: 0.74,
    y: 0.2
  },
  {
    id: 'integrations',
    index: '04',
    short: 'INTEGRATIONS',
    name: 'Third-party integrations',
    tools: 'DoorDash · UberEats · Grubhub · Apple Card',
    claim:
      'An integration is a contract with someone who will change it without telling you.',
    tradeoff:
      'Three delivery platforms arrive with three different opinions about what an order is. The work is one internal model they all translate into, so no partner’s shape leaks into the domain — plus alerting specific enough to name which of them broke at 11:58 on a Friday.',
    x: 0.87,
    y: 0.5
  },
  {
    id: 'modernization',
    index: '05',
    short: 'MODERNIZATION',
    name: 'Legacy modernization',
    tools: 'Angular 1 → Vue · ES5 → ES6 · Node 5 → 12 · 60s → 2s',
    claim:
      'You move a live system the way you defuse one: a wire at a time, verified.',
    tradeoff:
      'All of those migrations happened under production traffic, on a product people were using that afternoon, and the page load came down from sixty seconds to two along the way. That is never one fix; it is thirty, ranked by what the profile says instead of what the room suspects. A big-bang rewrite is a schedule risk wearing an engineering plan as a disguise.',
    x: 0.76,
    y: 0.78
  },
  {
    id: 'state',
    index: '06',
    short: 'STATE',
    name: 'Data & state',
    tools: 'MongoDB · DynamoDB · Postgres',
    claim: 'Pick the database from the access pattern, not from the résumé.',
    tradeoff:
      'Postgres until something proves it cannot cope. DynamoDB when the access pattern is genuinely known and the scale is genuinely real — it is a superb key-value store and a punishing query engine. The first thing I look for is a document store chosen because nobody wanted to write a migration.',
    x: 0.5,
    y: 0.86
  },
  {
    id: 'runtime',
    index: '07',
    short: 'RUNTIME',
    name: 'Cloud & delivery',
    tools: 'AWS · CloudFormation · Docker · Kubernetes · GitHub Actions',
    claim: 'Infrastructure you cannot recreate from a file is a rumour.',
    tradeoff:
      'That is why I oversaw the move of the Chick-fil-A delivery project onto AWS CloudFormation. Most teams need a boring deployment target and a rollback they trust more than they need a scheduler; when Kubernetes is the right answer, it is right for a reason somebody can say out loud.',
    x: 0.22,
    y: 0.78
  },
  {
    id: 'observability',
    index: '08',
    short: 'OBSERVABILITY',
    name: 'Observability & on-call',
    tools: 'Datadog · Splunk · OpsGenie',
    claim: 'An alert nobody acts on is a lie you tell yourself every night.',
    tradeoff:
      'At $5M a day the question is never “is something broken”, it is “whose”. Four alarms that always mean something beat forty that mean maybe, and enough logging to answer that question inside a minute is worth more than a quarter of features.',
    x: 0.12,
    y: 0.5
  },
  {
    id: 'ai',
    index: '09',
    short: 'APPLIED AI',
    name: 'Applied AI',
    tools: 'Agents · voice interfaces · developer tooling',
    claim:
      'A model is a third-party integration with worse error bars. Treat it like one.',
    tradeoff:
      'The interesting engineering is never the prompt, it is the containment: what happens when the output is confidently wrong, how a person sees that, and what the thing is allowed to touch. I write the fallback path first — the habit came from integrations, not from hype.',
    x: 0.5,
    y: 0.49
  }
]

const links: [number, number][] = [
  [0, 1],
  [0, 8],
  [1, 2],
  [1, 8],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 0],
  [8, 5],
  [8, 3],
  [6, 4]
]

const pushbacks = [
  {
    quote: '“Let’s just rewrite it.”',
    answer:
      'Nine times in ten that sentence means “I have not finished reading it.” Strangle the old system at one seam, ship, repeat. The business keeps running and you learn what the old code actually knew.'
  },
  {
    quote: '“We will add observability later.”',
    answer:
      'Later is after the incident. A service that cannot tell you what it just did is a service you will argue about instead of fix, at an hour nobody enjoys.'
  },
  {
    quote: '“The client team would not understand it.”',
    answer:
      'A consultant is temporary by design. If the team I leave behind cannot explain their own system without me, I did not finish the job — I just made myself load-bearing.'
  }
]

const IDLE_WEIGHT = 0.3

export function SystemsExperience() {
  const stateRef = useRef(createSignalState())
  const rootRef = useRef<HTMLElement | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const activeId = hovered ?? pinned
  const activeRef = useRef<string | null>(null)
  activeRef.current = activeId

  const mask = useMemo<SignalMask>(() => {
    const nodes: SignalNode[] = capabilities.map((item) => ({
      x: item.x,
      y: item.y,
      weight: item.id === activeId ? 1 : IDLE_WEIGHT
    }))
    const active = capabilities.find((item) => item.id === activeId)
    return {
      nodes,
      links,
      text: active?.short,
      caption: active ? active.tools.split(' · ')[0] : undefined,
      scale: 0.62,
      oy: 0.3
    }
  }, [activeId])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let raf = 0
    const measure = () => {
      raf = 0
      const scrolled = Math.min(
        1,
        window.scrollY / Math.max(window.innerHeight * 0.9, 1)
      )
      const engaged = activeRef.current ? 1 : 0
      stateRef.current.reveal = Math.max(
        0.62 + scrolled * 0.22,
        engaged ? 1 : 0
      )
      stateRef.current.energy = engaged ? 0.9 : 0.12
      stateRef.current.attractors = capabilities.map((item) => ({
        x: item.x,
        y: item.y,
        strength:
          item.id === activeRef.current ? 0.85 : IDLE_WEIGHT * 0.35 + 0.04,
        spin: 1
      }))
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const applyField = useCallback((id: string | null) => {
    activeRef.current = id
    const engaged = Boolean(id)
    stateRef.current.reveal = engaged ? 1 : 0.7
    stateRef.current.energy = engaged ? 0.9 : 0.12
    stateRef.current.attractors = capabilities.map((item) => ({
      x: item.x,
      y: item.y,
      strength: item.id === id ? 0.85 : IDLE_WEIGHT * 0.35 + 0.04,
      spin: 1
    }))
  }, [])

  const perturb = useCallback(
    (id: string | null) => {
      setHovered(id)
      applyField(id ?? pinned)
    },
    [applyField, pinned]
  )

  const togglePin = useCallback(
    (id: string) => {
      setPinned((current) => {
        const next = current === id ? null : id
        applyField(next)
        return next
      })
    },
    [applyField]
  )

  return (
    <main ref={rootRef} data-signal="" className={styles.page}>
      <div className={styles.fieldLayer}>
        <SignalFieldMount
          stateRef={stateRef}
          mask={mask}
          gain={activeId ? 1 : 0.9}
        />
      </div>
      <div className={styles.veil} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.content}>
        <section className={styles.hero} aria-labelledby="systems-title">
          <p className={styles.eyebrow}>
            <span>Signal</span>
            <span aria-hidden="true">·</span>
            <span>02 — field map</span>
            <span aria-hidden="true">·</span>
            <span>Nine attractors</span>
          </p>
          <h1 id="systems-title" className={styles.heroTitle}>
            <DecodeText text="The stack is not a ladder." duration={0.9} />{' '}
            <em>
              <DecodeText
                text="It is a field of forces."
                duration={1.1}
                delay={0.2}
              />
            </em>
          </h1>
          <p className={styles.heroLede}>
            Nine things I actually reach for, each with the tradeoff I make when
            I reach for it — drawn from seven years inside Apple and two inside
            Chick-fil-A’s delivery integrations. Touch one and the field
            reorganises around it. The words do not move.
          </p>
          <dl className={styles.readoutStrip}>
            {[
              { k: 'Attractors', v: 'Nine' },
              { k: 'Proven at', v: '15M users · $5M/day' },
              { k: 'Firm', v: 'Stellar Elements · since 2018' },
              { k: 'Bias', v: 'Boring until proven otherwise' }
            ].map((item) => (
              <div key={item.k}>
                <dt>{item.k}</dt>
                <dd>{item.v}</dd>
              </div>
            ))}
          </dl>
          <a className={styles.primaryAction} href="#field">
            Perturb the field <span aria-hidden="true">↓</span>
          </a>
        </section>

        <section
          id="field"
          className={styles.field}
          aria-labelledby="field-heading"
        >
          <header className={styles.sectionHead}>
            <span className={styles.sectionKicker}>The field</span>
            <h2 id="field-heading">Nine attractors, and what each one costs</h2>
            <p>
              Each card is an attractor in the simulation running behind this
              page. Hover one, or tab to its title and press it to hold the
              attractor open, and the flow reorganises around it. Every one of
              these is a position I have had to defend on somebody else’s
              deadline — none of the writing depends on the field running.
            </p>
          </header>

          <ul className={styles.cards}>
            {capabilities.map((item) => (
              <li key={item.id}>
                <article
                  className={styles.card}
                  data-active={item.id === activeId ? 'true' : undefined}
                  data-pinned={item.id === pinned ? 'true' : undefined}
                  aria-labelledby={`cap-${item.id}`}
                  onMouseEnter={() => perturb(item.id)}
                  onMouseLeave={() => perturb(null)}
                >
                  <p className={styles.cardTop}>
                    <span>{item.index}</span>
                    <span>{item.short}</span>
                  </p>
                  <h3 id={`cap-${item.id}`} className={styles.cardName}>
                    <button
                      type="button"
                      className={styles.cardButton}
                      aria-pressed={item.id === pinned}
                      onClick={() => togglePin(item.id)}
                      onFocus={() => perturb(item.id)}
                      onBlur={() => perturb(null)}
                    >
                      {item.name}
                      <span className={styles.cardHint}>
                        {item.id === pinned ? 'held' : 'hold attractor'}
                      </span>
                    </button>
                  </h3>
                  <p className={styles.cardTools}>{item.tools}</p>
                  <p className={styles.cardClaim}>{item.claim}</p>
                  <p className={styles.cardTradeoff}>{item.tradeoff}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.pushback} aria-labelledby="pushback-heading">
          <header className={styles.sectionHead}>
            <span className={styles.sectionKicker}>Where I push back</span>
            <h2 id="pushback-heading">
              Three sentences I have learned to answer slowly
            </h2>
          </header>
          <ol className={styles.pushbackList}>
            {pushbacks.map((item, i) => (
              <li key={item.quote}>
                <span className={styles.pushbackIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <blockquote>{item.quote}</blockquote>
                <p>{item.answer}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.outro} aria-labelledby="outro-heading">
          <h2 id="outro-heading" className={styles.outroTitle}>
            <DecodeText text="Same engineer. Other frequency." duration={1} />
          </h2>
          <p>
            The career that produced these opinions — one firm since 2018, seven
            years inside Apple across three eras, a hypergrowth delivery
            integration in the middle of it, and a founder’s habit of counting
            the cost of ownership — is one page over.
          </p>
          <div className={styles.outroLinks}>
            <Link href="/career">
              Read the career signal <span aria-hidden="true">→</span>
            </Link>
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
          </div>
        </section>
      </div>
    </main>
  )
}
