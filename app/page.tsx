import type { Metadata } from 'next'
import Link from 'next/link'
import { signal } from '@/content/signal'
import styles from './signal.module.css'
import composition from './resonance.module.css'

const title = `${signal.person.name} | ${signal.person.title}`

export const metadata: Metadata = {
  title: { absolute: title },
  description: signal.person.introduction,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description: signal.person.introduction,
    url: '/',
    images: ['/signal-social.png']
  }
}

export default function Home() {
  const selectedWork = signal.work.filter(
    (work) => work.id === 'cloud-console' || work.id === 'delivery-integrations'
  )
  const currentWork = signal.work.find((work) => work.id === 'cloud-portal')

  return (
    <main className={`${styles.page} ${composition.home}`}>
      <div className={styles.container}>
        <header className={composition.hero}>
          <div className={composition.heroCopy}>
            <p className={composition.eyebrow}>Signal index</p>
            <h1 className={composition.name}>{signal.person.name}</h1>
            <p className={composition.role}>
              {signal.person.title} at {signal.person.employer}
            </p>
            <p className={composition.introduction}>
              {signal.person.introduction}
            </p>
            <nav className={composition.heroLinks} aria-label="Get in touch">
              <a href={signal.person.contact}>
                Contact on LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href="/resume.pdf">
                Resume PDF <span aria-hidden="true">↓</span>
              </a>
            </nav>
          </div>
          <div className={composition.engraving} aria-hidden="true" />
          <a className={composition.workInvitation} href="#selected-work">
            Selected work <span aria-hidden="true">↓</span>
          </a>
        </header>

        <section
          className={composition.workSection}
          aria-labelledby="selected-work"
        >
          <div className={composition.sectionHeading}>
            <h2 id="selected-work">Selected work</h2>
            <p className={composition.eyebrow}>Architecture &amp; delivery</p>
          </div>
          <ol className={styles.workIndex} role="list">
            {selectedWork.map((work, index) => (
              <li key={work.id}>
                <article className={composition.workRow}>
                  <div className={composition.workCredit}>
                    <span className={composition.index} aria-hidden="true">
                      0{index + 1}
                    </span>
                    <p>{work.client}</p>
                    <p className={composition.period}>{work.period}</p>
                  </div>
                  <div className={composition.workTitle}>
                    <h3>
                      <Link
                        href={
                          work.id === 'cloud-console'
                            ? '/work/cloud-console'
                            : '/career#delivery-integrations'
                        }
                      >
                        {work.title}
                        <span
                          className={composition.workArrow}
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </Link>
                    </h3>
                    <p className={composition.workRole}>
                      {work.role} · {signal.person.employer}
                    </p>
                  </div>
                  <p className={composition.contribution}>
                    {work.contribution}
                  </p>
                </article>
              </li>
            ))}
          </ol>
          <div className={composition.careerLink}>
            <Link href="/career">
              Read the full career record <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        {currentWork ? (
          <section
            className={composition.currentWork}
            aria-labelledby="current-work"
          >
            <h2 id="current-work">Current work</h2>
            <div>
              <p className={composition.currentTitle}>
                {currentWork.title} · {currentWork.client}
              </p>
              <p className={composition.eyebrow}>{currentWork.period}</p>
            </div>
            <p>{currentWork.contribution}</p>
          </section>
        ) : null}

        <section
          className={composition.contact}
          aria-labelledby="contact-heading"
        >
          <div>
            <h2 id="contact-heading">Get in touch</h2>
            <a className={composition.contactLink} href={signal.person.contact}>
              Contact on LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
          <nav
            className={composition.supportingLinks}
            aria-label="More from Devon"
          >
            <a href="/resume.pdf">Resume PDF</a>
            <Link href="/career">Career</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/lab">Lab experiments</Link>
          </nav>
        </section>
      </div>
    </main>
  )
}
