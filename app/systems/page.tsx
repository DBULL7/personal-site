import type { Metadata } from 'next'
import Link from 'next/link'

import { profile } from '@/config/profile'
import { ContactPanel } from '@/components/dossier/contact-panel'
import { SectionHead } from '@/components/dossier/section-head'
import { Todo } from '@/components/dossier/todo'
import { decisions, scenarios, seniority, stackGroups } from './systems-data'
import styles from './systems.module.css'

export const metadata: Metadata = {
  title: 'Systems | Devon Bull — Technical Depth',
  description:
    'How Devon Bull actually builds: the problems he is good at, a decision log with the tradeoffs and what they cost, an annotated stack (Node, TypeScript, Go, Vue, React, MongoDB, DynamoDB, Postgres, AWS, Kubernetes, Datadog), and explicit seniority signals.',
  keywords: [
    'Node.js',
    'TypeScript',
    'Go',
    'Vue',
    'React',
    'MongoDB',
    'DynamoDB',
    'PostgreSQL',
    'AWS CloudFormation',
    'Kubernetes',
    'Datadog',
    'third-party integrations',
    'architecture decision record'
  ],
  alternates: { canonical: '/systems' },
  openGraph: {
    title: 'Systems | Devon Bull — Technical Depth',
    description:
      'A decision log, an annotated stack, and the problems I am actually good at. Depth over breadth.',
    url: '/systems',
    type: 'profile'
  }
}

const profilePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  name: 'Systems — Devon Bull',
  url: `${profile.site}/systems`,
  about: {
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    url: profile.site,
    sameAs: [profile.linkedin, profile.github],
    knowsAbout: stackGroups.flatMap((group) =>
      group.rows.map((row) => row.name)
    )
  }
}

const jumpLinks = [
  ['Problems I solve', '#problems'],
  ['Decision log', '#decisions'],
  ['Stack, annotated', '#stack'],
  ['Seniority signals', '#signals'],
  ['Contact', '#contact']
] as const

export default function SystemsPage() {
  return (
    <main className={`dossier ${styles.page}`}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />

      <header className={styles.masthead} aria-labelledby="systems-title">
        <div className={styles.mastheadShell}>
          <div>
            <p className={styles.eyebrow}>Technical record &mdash; 002</p>
            <h1 id="systems-title">
              A list of technologies proves nothing. Here is the thinking.
            </h1>
            <p className={styles.lede}>
              Everybody&rsquo;s portfolio says AWS, Node, Postgres. This page is
              the part that is harder to fake: the problems I am good at, the
              calls I have made and what they cost, and where each tool actually
              sits in my hands. Companion to the{' '}
              <Link href="/career">work record</Link>.
            </p>
          </div>

          <dl className={styles.keyCard}>
            <div>
              <dt>Depth key</dt>
              <dd>
                <span className={styles.depthPrimary}>Primary</span> ship it
                without looking things up &middot;{' '}
                <span className={styles.depthWorking}>Working</span> productive,
                still reach for docs &middot;{' '}
                <span className={styles.depthExploring}>Exploring</span>{' '}
                deliberate, hands-on, not yet load-bearing
              </dd>
            </div>
            <div>
              <dt>Page build</dt>
              <dd>
                Statically rendered, zero client-side JavaScript, no WebGL, no
                animation. The fastest page on this site is the one asking you
                to hire me.
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <nav className={styles.jump} aria-label="Sections of this page">
        <ul>
          {jumpLinks.map(([label, href]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
          <li className={styles.jumpAside}>
            <Link href="/career">Work record &rarr;</Link>
          </li>
        </ul>
      </nav>

      <section
        id="problems"
        className={styles.problems}
        aria-labelledby="problems-title"
      >
        <div className={styles.shell}>
          <SectionHead
            index="01"
            id="problems-title"
            title="Problems I am good at"
            note={
              <>
                Not a tech list &mdash; situations. If one of these is happening
                on your team right now, that is the conversation to have.
              </>
            }
          />

          <div className={styles.scenarioList}>
            {scenarios.map((item) => (
              <article key={item.id} className={styles.scenario}>
                <p className={styles.scenarioIndex}>{item.index}</p>
                <div className={styles.scenarioBody}>
                  <h3>{item.situation}</h3>
                  <ul>
                    {item.moves.map((move, i) => (
                      <li key={i}>{move}</li>
                    ))}
                  </ul>
                  <p className={styles.scenarioEvidence}>
                    <span>Evidence</span>
                    {item.evidence}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="decisions"
        className={styles.decisions}
        aria-labelledby="decisions-title"
      >
        <div className={styles.shell}>
          <SectionHead
            index="02"
            id="decisions-title"
            title="Decision log"
            note={
              <>
                Real tradeoffs, the options that lost, and the price the winning
                option charged. Every entry expands. Disagree with any of them
                and we will have a good interview.
              </>
            }
          />

          <div className={styles.decisionList}>
            {decisions.map((item, index) => (
              <details
                key={item.id}
                className={styles.decision}
                open={index === 0}
              >
                <summary>
                  <span className={styles.decisionCode}>{item.code}</span>
                  <span className={styles.decisionTitle}>{item.title}</span>
                  <span className={styles.decisionMarker} aria-hidden="true" />
                </summary>
                <div className={styles.decisionBody}>
                  <div className={styles.decisionCol}>
                    <div className={styles.decisionField}>
                      <h4>Context</h4>
                      <p>{item.context}</p>
                    </div>
                    <div className={styles.decisionField}>
                      <h4>Options considered</h4>
                      <ul>
                        {item.options.map((option) => (
                          <li key={option}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className={styles.decisionCol}>
                    <div className={styles.decisionField}>
                      <h4>The call</h4>
                      <p>{item.call}</p>
                    </div>
                    <div className={styles.decisionField}>
                      <h4>What it cost</h4>
                      <p>{item.consequence}</p>
                    </div>
                    <div
                      className={`${styles.decisionField} ${styles.decisionAgain}`}
                    >
                      <h4>Same call again?</h4>
                      <p>{item.again}</p>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="stack" className={styles.stack} aria-labelledby="stack-title">
        <div className={styles.shell}>
          <SectionHead
            index="03"
            id="stack-title"
            title="The stack, annotated"
            note={
              <>
                Each tool appears exactly once, with an honest depth rating, what
                I used it for, and what I would do differently. The third column
                is the only one worth reading.
              </>
            }
          />

          {stackGroups.map((group) => (
            <div key={group.id} className={styles.stackGroup}>
              <div className={styles.stackGroupHead}>
                <h3>{group.label}</h3>
                <p>{group.blurb}</p>
              </div>

              <table className={styles.stackTable}>
                <caption className="sr-only">{group.label}</caption>
                <thead>
                  <tr>
                    <th scope="col">Technology</th>
                    <th scope="col">Depth</th>
                    <th scope="col">Used for</th>
                    <th scope="col">What I would do differently</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row) => (
                    <tr key={row.name}>
                      <th scope="row">{row.name}</th>
                      <td>
                        <span
                          className={
                            row.depth === 'Primary'
                              ? styles.depthPrimary
                              : row.depth === 'Working'
                                ? styles.depthWorking
                                : styles.depthExploring
                          }
                        >
                          {row.depth}
                        </span>
                      </td>
                      <td>{row.usedFor}</td>
                      <td className={styles.opinionCell}>{row.opinion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <p className={styles.stackFoot}>
            <Todo>
              add years-of-use per row if you want recruiters to stop asking
              &mdash; a simple &ldquo;since 2019&rdquo; column would do it
            </Todo>
          </p>
        </div>
      </section>

      <section
        id="signals"
        className={styles.signals}
        aria-labelledby="signals-title"
      >
        <div className={styles.shell}>
          <SectionHead
            index="04"
            id="signals-title"
            title="Seniority signals"
            note={
              <>
                The things that separate a senior engineer from a productive one.
                Ask about any of them.
              </>
            }
          />
          <ol className={styles.signalList}>
            {seniority.map((item) => (
              <li key={item.index}>
                <span className={styles.signalIndex}>{item.index}</span>
                <strong>{item.label}</strong>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ContactPanel
        headline="You now know how I think. The rest is a conversation."
        blurb="Send the hardest problem on your roadmap. I will tell you honestly whether I am the right person for it."
      />
    </main>
  )
}
