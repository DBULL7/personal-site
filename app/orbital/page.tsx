import type { Metadata } from 'next'
import Link from 'next/link'
import { OrbitalHero } from './orbital-hero'
import styles from '../space-experiences.module.css'

export const metadata: Metadata = {
  title: 'The Orbital | Devon Bull',
  description: 'A Culture-inspired Three.js portfolio experience by senior software engineer Devon Bull.'
}

export default function OrbitalPage() {
  return (
    <main className={styles.page}>
      <OrbitalHero />

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.split}>
            <div>
              <p className={styles.sectionEyebrow}>The scale of the idea</p>
              <h2 className={styles.sectionTitle}>Not a world. A decision to build one.</h2>
            </div>
            <div>
              <p className={styles.sectionText}>
                Iain M. Banks imagined Orbitals as vast, open ring habitats: smaller than a Ringworld,
                centred on their own Hub, and orbiting a star like a planet. Their spin supplies gravity;
                their slight tilt creates the rhythm of day and night. That combination of audacity and
                practical systems thinking is exactly what keeps pulling me back to engineering.
              </p>
              <a
                className={styles.sourceLink}
                href="https://theculture.adactio.com/"
                target="_blank"
                rel="noreferrer"
              >
                Read Banks&apos;s notes on the Culture ↗
              </a>
            </div>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>3M</span>
              <span className={styles.statLabel}>kilometres across</span>
              <p className={styles.statText}>A human habitat so large that Earth becomes the unit of comparison.</p>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10M</span>
              <span className={styles.statLabel}>kilometres around</span>
              <p className={styles.statText}>A landscape made from plates, bounded by edgewalls and held in balance.</p>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>24h-ish</span>
              <span className={styles.statLabel}>one rotation</span>
              <p className={styles.statText}>A structural motion that creates both gravity and a livable day.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.darkSection}>
        <div className={styles.sectionInner}>
          <div className={styles.split}>
            <div>
              <p className={styles.sectionEyebrow}>Inhabited by the work</p>
              <h2 className={styles.sectionTitle}>A portfolio built as a place.</h2>
            </div>
            <p className={styles.sectionText}>
              The spectacle gets you through the airlock. The substance lives on the plates: embedded
              engineering for global products, platform and cloud experience, and a career spent making
              complex systems easier for people to understand and operate.
            </p>
          </div>
          <div className={styles.plateGrid}>
            <article className={styles.plate} style={{ '--plate-accent': 'rgba(226, 174, 102, .22)' } as React.CSSProperties}>
              <span className={styles.plateNumber}>PLATE / 01</span>
              <h3 className={styles.plateTitle}>Embedded in the real world</h3>
              <p className={styles.plateText}>Client engineering engagements for Apple and Chick-fil-A, where software met hardware and operations.</p>
            </article>
            <article className={styles.plate}>
              <span className={styles.plateNumber}>PLATE / 02</span>
              <h3 className={styles.plateTitle}>Platforms with leverage</h3>
              <p className={styles.plateText}>TypeScript, React, Node, Go, cloud infrastructure, data systems, and the connective tissue between them.</p>
            </article>
            <article className={styles.plate} style={{ '--plate-accent': 'rgba(77, 134, 173, .23)' } as React.CSSProperties}>
              <span className={styles.plateNumber}>PLATE / 03</span>
              <h3 className={styles.plateTitle}>Calm technical leadership</h3>
              <p className={styles.plateText}>A bias for clarity, steady collaboration, and helping teams find the clean path through hard problems.</p>
            </article>
          </div>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/career">Navigate the career constellation</Link>
            <Link className={styles.secondaryAction} href="/blog">Read field notes</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
