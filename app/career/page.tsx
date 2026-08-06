import type { Metadata } from 'next'
import Link from 'next/link'
import { compareDesc } from 'date-fns'
import { allPosts } from 'contentlayer2/generated'

import { profile } from '@/config/profile'
import { ContactPanel } from '@/components/dossier/contact-panel'
import { SectionHead } from '@/components/dossier/section-head'
import { Todo } from '@/components/dossier/todo'
import { engagements, factSheet, founder, lookingFor } from './career-data'
import styles from './career.module.css'

export const metadata: Metadata = {
  title: 'Career | Devon Bull — Senior Software Engineer',
  description:
    'Work history for Devon Bull: senior software engineer in Raleigh, NC. Embedded engineering for Apple and Chick-fil-A through one consulting firm, plus full-stack and platform work. Former founder. Open to senior and staff roles.',
  keywords: [
    'senior software engineer',
    'embedded engineer',
    'Raleigh NC',
    'Apple',
    'Chick-fil-A',
    'TypeScript',
    'Go',
    'Kubernetes'
  ],
  alternates: { canonical: '/career' },
  openGraph: {
    title: 'Career | Devon Bull — Senior Software Engineer',
    description:
      'Embedded engineering for Apple and Chick-fil-A, full-stack platform work, and a founder chapter. The record, with dates and scope.',
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
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Raleigh',
    addressRegion: 'NC',
    addressCountry: 'US'
  },
  sameAs: [profile.linkedin, profile.github, profile.site],
  knowsAbout: [
    'Embedded systems engineering',
    'Firmware and device software',
    'TypeScript',
    'React',
    'Node.js',
    'Go',
    'PostgreSQL',
    'DynamoDB',
    'MongoDB',
    'Amazon Web Services',
    'Google Cloud Platform',
    'Kubernetes',
    'CI/CD',
    'Observability and Datadog',
    'Applied AI tooling'
  ],
  seeks: {
    '@type': 'Demand',
    name: profile.availability.state
  }
}

const jumpLinks = [
  ['Work record', '#record'],
  ['Founder chapter', '#founder'],
  ['Written proof', '#evidence'],
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
              {profile.role} &middot; {profile.location}
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
                One employer, several clients. Consulting firms rotate you
                through other people&rsquo;s hardest quarters, which is a strange
                way to build range and a very good one. Each engagement below is
                listed the way an engineer would want to read it: what it was,
                what shipped, and what made it hard.
              </>
            }
          />

          <article className={styles.employer}>
            <div className={styles.employerRail}>
              <span className={styles.employerIndex}>Employer</span>
            </div>
            <div className={styles.employerBody}>
              <h3>One firm, several clients</h3>
              <dl className={styles.employerMeta}>
                <div>
                  <dt>Firm</dt>
                  <dd>
                    <Todo>consulting firm name</Todo>
                  </dd>
                </div>
                <div>
                  <dt>Titles</dt>
                  <dd>
                    <Todo>title progression and promotion dates</Todo>
                  </dd>
                </div>
              </dl>
              <p>
                Every engagement on this page was delivered under one firm. The
                client changed, the domain changed, the codebase changed; the
                standard did not. Consulting is the fastest available training
                in walking into a system you did not build, finding the
                load-bearing parts, and being useful before anyone has time to
                onboard you.
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
                    <p className={styles.engagementKind}>{item.kind}</p>
                    <h3>{item.client}</h3>
                    <p className={styles.engagementDomain}>{item.domain}</p>
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
                    <span>Took away</span>
                    {item.taught}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="founder"
        className={styles.founder}
        aria-labelledby="founder-title"
      >
        <div className={styles.shell}>
          <SectionHead
            index="02"
            id="founder-title"
            title="Before the firm: I ran the company"
            note={
              <>
                Most senior engineers have never had to make the call that costs
                money. I have. That is the part of this page that is hardest to
                hire for and easiest to verify in an interview &mdash; ask me
                about the decisions I got wrong.
              </>
            }
          />

          <div className={styles.founderGrid}>
            <dl className={styles.founderSpecs}>
              <div>
                <dt>Venture</dt>
                <dd>{founder.title}</dd>
              </div>
              <div>
                <dt>Years</dt>
                <dd>{founder.period}</dd>
              </div>
              <div>
                <dt>Product</dt>
                <dd>{founder.what}</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>{founder.scope}</dd>
              </div>
              <div>
                <dt>Outcome</dt>
                <dd>{founder.outcome}</dd>
              </div>
            </dl>

            <div className={styles.founderProse}>
              <p>
                Running a company taught me the part of engineering that is not
                engineering. What a deadline actually costs. Why a customer
                stops answering. When &ldquo;good enough, ship it&rdquo; is the
                correct technical answer and when it is the expensive one.
              </p>
              <p>
                It also taught me to be honest about scope in public. A founder
                who over-promises loses a customer; an engineer who
                over-promises loses a quarter. Same reflex, different blast
                radius.
              </p>
              <p className={styles.founderPull}>
                I do not put &ldquo;entrepreneurial mindset&rdquo; on a
                r&eacute;sum&eacute;. I put the outcome on it, including the
                parts that did not work.
              </p>
            </div>
          </div>
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
            title="Written proof"
            note={
              <>
                Client work is mostly under NDA. Writing is not. These are
                published, dated, and mine &mdash; the closest thing to a work
                sample I can hand you before we talk.
              </>
            }
          />

          <div className={styles.evidenceGrid}>
            <div>
              <h3 className={styles.evidenceLabel}>Published</h3>
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
              <p className={styles.evidenceNote}>
                <Todo>
                  there are unpublished drafts sitting in /posts, including the
                  voice-cloning one &mdash; ship them, they are the strongest
                  applied-AI evidence you have
                </Todo>
              </p>
            </div>

            <aside className={styles.artifactCard}>
              <h3 className={styles.evidenceLabel}>Code &amp; artifacts</h3>
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
                  A WebGL experience built on this site &mdash; three.js, custom
                  shaders, disposal and reduced-motion handling
                </span>
              </a>
              <p className={styles.evidenceNote}>
                <Todo>
                  two or three more public artifacts: an open-source
                  contribution, a talk, a patent, a shipped device anyone can
                  buy
                </Todo>
              </p>
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
                Stated plainly so we can both save a call if it is not a match.
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
            The technical version of this &mdash; decision logs, stack
            annotations, the problems I am actually good at &mdash; is on{' '}
            <Link href="/systems">the systems page</Link>.
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
