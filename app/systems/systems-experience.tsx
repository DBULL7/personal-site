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
    id: 'embedded',
    index: '01',
    short: 'EMBEDDED',
    name: 'Devices & firmware',
    tools: 'Embedded C/C++ · device software · the hardware boundary',
    claim: 'On a device, “we’ll patch it” is a hope, not a plan.',
    tradeoff:
      'I would rather ship a smaller feature set with a proven recovery path than a rich one that needs a human in the room. Across both embedded engagements — Apple and Chick-fil-A — the expensive defects were never clever algorithms. They were state that survived a reboot it had no business surviving.',
    x: 0.2,
    y: 0.28
  },
  {
    id: 'interface',
    index: '02',
    short: 'INTERFACE',
    name: 'Product interface',
    tools: 'TypeScript · React',
    claim: 'The component library is not the architecture. The state model is.',
    tradeoff:
      'The first day on a UI goes to enumerating which states are genuinely possible and making the impossible ones unrepresentable. It costs a day. It buys back the fortnight otherwise spent on defects that are really two booleans which should have been one union.',
    x: 0.46,
    y: 0.16
  },
  {
    id: 'services',
    index: '03',
    short: 'SERVICES',
    name: 'Application services',
    tools: 'Node.js · Go',
    claim:
      'Go where the concurrency is real. Node where iteration speed is worth more.',
    tradeoff:
      'Choosing a language is a staffing decision wearing a technical costume. I have handed elegant Go services to teams who live in TypeScript and watched ownership quietly evaporate. Now I ask who carries the pager before I ask what benchmarks fastest.',
    x: 0.72,
    y: 0.3
  },
  {
    id: 'state',
    index: '04',
    short: 'STATE',
    name: 'Data & state',
    tools: 'Postgres · DynamoDB · MongoDB',
    claim: 'Pick the database from the access pattern, not from the résumé.',
    tradeoff:
      'Postgres until something proves it cannot cope. DynamoDB when the access pattern is genuinely known and the scale is genuinely real — it is a superb key-value store and a punishing query engine. The failure mode I look for first is a document store chosen because nobody wanted to write a migration.',
    x: 0.83,
    y: 0.62
  },
  {
    id: 'runtime',
    index: '05',
    short: 'RUNTIME',
    name: 'Cloud runtime',
    tools: 'AWS · Google Cloud · Kubernetes',
    claim:
      'Kubernetes is a cost. Take it on when you are buying something specific with it.',
    tradeoff:
      'Most teams need a boring deployment target and a rollback they trust more than they need a scheduler. When Kubernetes is the right answer it is right for a reason somebody can say out loud. When it is not, it becomes a second product the team maintains for free, forever.',
    x: 0.56,
    y: 0.78
  },
  {
    id: 'feedback',
    index: '06',
    short: 'FEEDBACK',
    name: 'Delivery & feedback',
    tools: 'CI/CD · GitHub Actions · Datadog',
    claim: 'An alert nobody acts on is a lie you tell yourself every night.',
    tradeoff:
      'Four alarms that always mean something beat forty that mean maybe. Pipelines the same: a paved road a second-week engineer can follow, checks that fail for exactly one legible reason, and enough production signal to answer “is it us?” inside a minute.',
    x: 0.28,
    y: 0.72
  },
  {
    id: 'ai',
    index: '07',
    short: 'APPLIED AI',
    name: 'Applied AI',
    tools: 'Agents · voice interfaces · developer tooling',
    claim:
      'Models are components with terrible error bars. Design the system around that.',
    tradeoff:
      'The interesting engineering is never the prompt; it is the containment. What happens when the output is confidently wrong, how a person sees that, and what the model is allowed to touch. I write the fallback path first — the same instinct firmware taught me.',
    x: 0.5,
    y: 0.47
  }
]

const links: [number, number][] = [
  [0, 2],
  [1, 2],
  [2, 3],
  [2, 4],
  [4, 5],
  [5, 1],
  [6, 2],
  [6, 1],
  [6, 4],
  [0, 5]
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
            <span>Seven attractors</span>
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
            Seven capabilities I actually reach for, each with the tradeoff I
            make when I reach for it. Touch one and the field reorganises around
            it — the more you perturb it, the more structure shows. The words do
            not move.
          </p>
          <dl className={styles.readoutStrip}>
            {[
              { k: 'Attractors', v: 'Seven' },
              { k: 'Depth', v: 'Firmware → Kubernetes' },
              { k: 'Bias', v: 'Boring until proven otherwise' },
              { k: 'Proof', v: 'Apple · Chick-fil-A' }
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
            <h2 id="field-heading">Seven attractors, and what each one costs</h2>
            <p>
              Hover a card, or tab to its title and press it to hold that
              attractor open. Every one of these is a position I have had to
              defend on somebody else’s deadline.
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
            <li>
              <div className={styles.legend}>
                <p className={styles.legendTitle}>Field key</p>
                <p>
                  Each card is an attractor in the simulation running behind
                  this page. Hold one open and the flow reorganises around it,
                  links brighten, the name burns in. None of the writing depends
                  on that happening.
                </p>
              </div>
            </li>
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
            The career that produced these opinions — one consulting firm,
            embedded work for Apple and Chick-fil-A, and a founder’s habit of
            counting the cost of ownership — is one page over.
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
