import type { Metadata } from 'next'
import Link from 'next/link'
import { compareDesc } from 'date-fns'
import { allPosts } from 'contentlayer2/generated'

import { profile } from '@/config/profile'
import { ContactPanel } from '@/components/dossier/contact-panel'
import { SectionHead } from '@/components/dossier/section-head'
import { Todo } from '@/components/dossier/todo'
import {
  engagements,
  factSheet,
  lookingFor,
  path,
  proofPoints,
  sideProjects
} from './career-data'
import styles from './career.module.css'

export const metadata: Metadata = {
  title: 'Career | Devon Bull — Product Engineer',
  description:
    'Work record for Devon Bull, product engineer in Raleigh NC. Seven years at one firm, most of it building for Apple: backend lead on the chatbot platform (1M → 15M users, 100% uptime, 60s → 2s), two years as sole engineer on an Apple internal product, now Apple’s internal cloud site and developer portal. Chick-fil-A delivery integrations from $1M to $5M a day.',
  keywords: [
    'product engineer',
    'senior software engineer',
    'full-stack engineer',
    'React',
    'TypeScript',
    'developer platform',
    'Stellar Elements',
    'Amdocs',
    'Big Nerd Ranch',
    'Raleigh NC',
    'Apple',
    'Chick-fil-A',
    'Node.js',
    'TypeScript',
    'Go',
    'AWS',
    'third-party integrations'
  ],
  alternates: { canonical: '/career' },
  openGraph: {
    title: 'Career | Devon Bull — Product Engineer',
    description:
      'Seven years, one firm, three Apple engagements. 1M → 15M users at 100% uptime, 60s → 2s page load, $1M → $5M a day at Chick-fil-A, then two years solo on an Apple internal product.',
    url: '/career',
    type: 'profile'
  }
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  description: profile.summary,
  url: `${profile.site}/career`,
  email: `mailto:${profile.email}`,
  image: `${profile.site}/profile_pic.jpg`,
  worksFor: {
    '@type': 'Organization',
    name: 'Stellar Elements',
    alternateName: 'Big Nerd Ranch',
    parentOrganization: { '@type': 'Organization', name: 'Amdocs' }
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Raleigh',
    addressRegion: 'NC',
    addressCountry: 'US'
  },
  alumniOf: [
    {
      '@type': 'EducationalOrganization',
      name: 'Turing School of Software & Design'
    },
    { '@type': 'CollegeOrUniversity', name: 'University of Kansas' }
  ],
  sameAs: [profile.linkedin, profile.github, profile.site],
  knowsAbout: [
    'Product engineering',
    'Full-stack web development',
    'Internal developer platforms',
    'Developer experience',
    'Backend engineering',
    'High-traffic consumer platforms',
    'Third-party API integrations',
    'Legacy modernisation',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'Go',
    'Vue.js',
    'React',
    'Express',
    'MongoDB',
    'DynamoDB',
    'PostgreSQL',
    'Amazon Web Services',
    'AWS CloudFormation',
    'Docker',
    'Kubernetes',
    'Datadog',
    'Splunk',
    'Observability'
  ],
  seeks: { '@type': 'Demand', name: profile.availability.state }
}

const jumpLinks = [
  ['Work record', '#record'],
  ['How I got here', '#path'],
  ['Proof of work', '#evidence'],
  ['What I want next', '#fit'],
  ['Contact', '#contact']
] as const

export default function CareerPage() {
  const posts = [...allPosts]
    .filter((post) => post.draft !== true)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, 3)

  return (
    <main className={`dossier ${styles.page}`}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <header className={styles.masthead} aria-labelledby="career-title">
        <div className={styles.mastheadShell}>
          <div className={styles.identity}>
            <p className={styles.eyebrow}>Career record &mdash; 001</p>
            <h1 id="career-title">{profile.name}</h1>
            <p className={styles.role}>
              {profile.role} &middot; {profile.firm} &middot; {profile.location}
            </p>
            <p className={styles.lede}>{profile.summary}</p>

            <div className={styles.actions}>
              <a
                className={styles.actionPrimary}
                href={`mailto:${profile.email}?subject=Role%20enquiry`}
              >
                Email me
              </a>
              <a
                className={styles.action}
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
              >
                R&eacute;sum&eacute; (PDF)
              </a>
              <a
                className={styles.action}
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                className={styles.action}
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
            <p className={styles.availability}>
              <span className={styles.dot} aria-hidden="true" />
              {profile.availability.state}. {profile.availability.detail}
            </p>

            <ol className={styles.proofList} aria-label="Results at a glance">
              {proofPoints.map((point) => (
                <li key={point.value}>
                  <strong>{point.value}</strong>
                  <span className={styles.proofLabel}>{point.label}</span>
                  <span className={styles.proofSource}>{point.source}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.factSheet}>
            <p className={styles.factSheetTitle}>At a glance</p>
            <dl>
              {factSheet.map(([term, value]) => (
                <div key={term} className={styles.factRow}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
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
            <Link href="/systems">Technical depth &rarr;</Link>
          </li>
        </ul>
      </nav>

      <section
        id="record"
        className={styles.record}
        aria-labelledby="record-title"
      >
        <div className={styles.shell}>
          <SectionHead
            index="01"
            id="record-title"
            title="The work record"
            note={
              <>
                Seven years at one firm, and a relationship with Apple that has
                run in three separate eras since 2018 &mdash; backend, then a
                two-year solo product, now the internal developer platform.
                Chick-fil-A sits in the middle. Listed the way an engineer would
                want to read it: what it was, what shipped, and what made it
                hard. Most recent first.
              </>
            }
          />

          <article className={styles.employer}>
            <div className={styles.employerRail}>
              <span className={styles.employerIndex}>Employer</span>
            </div>
            <div className={styles.employerBody}>
              <h3>Stellar Elements</h3>
              <dl className={styles.employerMeta}>
                <div>
                  <dt>Formerly</dt>
                  <dd>Big Nerd Ranch &middot; an Amdocs company</dd>
                </div>
                <div>
                  <dt>Since</dt>
                  <dd>July 2018 &mdash; 7 years, still here</dd>
                </div>
                <div>
                  <dt>Title</dt>
                  <dd>
                    Solutions Architect &middot;{' '}
                    <Todo>confirm current title</Todo>
                  </dd>
                </div>
              </dl>
              <p>
                One firm for seven years, through a rebrand and an acquisition,
                placed inside client engineering teams for years at a time
                rather than weeks. Four engagements, not a list of logos. The
                scope grew each time: backend lead, then engineering lead, then
                the only engineer on a product, then the platform other
                engineers build on.
              </p>
            </div>
          </article>

          <ol className={styles.engagements}>
            {engagements.map((item, index) => (
              <li key={item.id} className={styles.engagement} id={item.id}>
                <div className={styles.engagementRail}>
                  <span className={styles.engagementIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.railLine} aria-hidden="true" />
                </div>

                <div className={styles.engagementBody}>
                  <div className={styles.engagementHead}>
                    <p className={styles.engagementKind}>
                      {item.kind} <span aria-hidden="true">&middot;</span>{' '}
                      {item.period}
                    </p>
                    <h3>{item.client}</h3>
                    <p className={styles.engagementDomain}>{item.domain}</p>
                    {item.headline ? (
                      <p className={styles.engagementHeadline}>
                        {item.headline}
                      </p>
                    ) : null}
                  </div>

                  <dl className={styles.specs}>
                    <div>
                      <dt>Period</dt>
                      <dd>{item.period}</dd>
                    </div>
                    <div>
                      <dt>Role</dt>
                      <dd>{item.role}</dd>
                    </div>
                    <div>
                      <dt>Team</dt>
                      <dd>{item.team}</dd>
                    </div>
                    <div>
                      <dt>Stack</dt>
                      <dd>{item.stack}</dd>
                    </div>
                  </dl>

                  <div className={styles.engagementColumns}>
                    <div className={styles.shipped}>
                      <h4>What shipped</h4>
                      <ul>
                        {item.shipped.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.hard}>
                      <h4>What made it hard</h4>
                      <p>{item.hard}</p>
                    </div>
                  </div>

                  <p className={styles.taught}>
                    <span className={styles.taughtLabel}>Took away</span>
                    <span>{item.taught}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="path" className={styles.path} aria-labelledby="path-title">
        <div className={styles.shell}>
          <SectionHead
            index="02"
            id="path-title"
            title="Economics, a startup, a bootcamp, then backend lead at Apple"
            note={
              <>
                No computer science degree. I ran properties, then wrote a
                business plan, got a company into an accelerator, and taught
                myself Sketch and Swift to build the prototype because nobody
                else was going to. The engineering came after the operating
                experience, not before it.
              </>
            }
          />

          <ol className={styles.pathList}>
            {path.map((step) => (
              <li key={`${step.year}-${step.title}`}>
                <span className={styles.pathYear}>{step.year}</span>
                <strong>{step.title}</strong>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>

          <p className={styles.pathPull}>
            The useful part is not the story. It is that I have been the person
            who has to decide what a delay actually costs &mdash; and that
            changes which technical argument you make.
          </p>
        </div>
      </section>

      <section
        id="evidence"
        className={styles.evidence}
        aria-labelledby="evidence-title"
      >
        <div className={styles.shell}>
          <SectionHead
            index="03"
            id="evidence-title"
            title="Proof of work"
            note={
              <>
                Client work sits behind client agreements. These do not &mdash;
                published, dated, and mine.
              </>
            }
          />

          <div className={styles.evidenceGrid}>
            <div>
              <h3 className={styles.evidenceLabel}>Written</h3>
              <ul className={styles.postList}>
                {posts.map((post) => (
                  <li key={post.url}>
                    <Link href={post.url} className={styles.postLink}>
                      <span className={styles.postDate}>
                        {new Date(post.date).toISOString().slice(0, 10)}
                      </span>
                      <span className={styles.postTitle}>{post.title}</span>
                      <span className={styles.postBlurb}>
                        {post.description}
                      </span>
                      <span className={styles.postArrow} aria-hidden="true">
                        &rarr;
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className={styles.evidenceMore} href="/blog">
                All field notes <span aria-hidden="true">&rarr;</span>
              </Link>
              <p className={styles.evidenceNote}>
                <Todo>
                  the voice-cloning write-up is still a draft in /posts &mdash;
                  publish it, it is the strongest applied-AI evidence you have
                </Todo>
              </p>
            </div>

            <aside className={styles.artifactCard}>
              <h3 className={styles.evidenceLabel}>Built</h3>
              <a
                className={styles.artifactLink}
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                <strong>github.com/DBULL7</strong>
                <span>
                  Public repositories, this site included
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
              </a>
              <a className={styles.artifactLink} href="/orbital">
                <strong>/orbital</strong>
                <span>
                  A WebGL piece built on this site &mdash; three.js, custom
                  shaders, reduced-motion and disposal handled properly
                </span>
              </a>
              {sideProjects.map((item) => (
                <div className={styles.artifactLink} key={item.name}>
                  <strong>{item.name}</strong>
                  <span>{item.detail}</span>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <section id="fit" className={styles.fit} aria-labelledby="fit-title">
        <div className={styles.shell}>
          <SectionHead
            index="04"
            id="fit-title"
            title="What I want next"
            note={
              <>
                Stated plainly, so we can both save a call if it is not a match.
              </>
            }
          />
          <div className={styles.fitGrid}>
            {lookingFor.map((item) => (
              <article key={item.index}>
                <span>{item.index}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <p className={styles.fitCross}>
            The technical version of this &mdash; a decision log, the stack
            annotated tool by tool, and the problems I am actually good at
            &mdash; is on <Link href="/systems">the systems page</Link>.
          </p>
        </div>
      </section>

      <ContactPanel
        headline="If any of this is useful, start the conversation."
        blurb="I answer email. Tell me what you are building and what is going wrong with it — that is a better first message than a job description."
      />
    </main>
  )
}
