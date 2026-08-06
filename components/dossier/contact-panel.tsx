import { profile } from '@/config/profile'
import styles from './dossier.module.css'

type ContactPanelProps = {
  headline: string
  blurb: string
  id?: string
}

export function ContactPanel({
  headline,
  blurb,
  id = 'contact'
}: ContactPanelProps) {
  return (
    <section className={styles.contact} id={id} aria-labelledby={`${id}-title`}>
      <div className={styles.contactShell}>
        <div className={styles.contactLede}>
          <p className={styles.contactEyebrow}>
            <span className={styles.statusDot} aria-hidden="true" />
            Available
          </p>
          <h2 id={`${id}-title`}>{headline}</h2>
          <p>{blurb}</p>
          <p className={styles.status}>
            <strong>{profile.availability.state}</strong>
            <span>{profile.availability.detail}</span>
          </p>
        </div>

        <div>
          <div className={styles.ctaGrid}>
            <a
              className={`${styles.cta} ${styles.ctaPrimary}`}
              href={`mailto:${profile.email}?subject=Role%20enquiry`}
            >
              <span className={styles.ctaLabel}>
                Email me
                <span aria-hidden="true">&#8599;</span>
              </span>
              <span className={styles.ctaValue}>{profile.email}</span>
            </a>
            <a
              className={styles.cta}
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.ctaLabel}>
                R&eacute;sum&eacute;
                <span aria-hidden="true">&#8599;</span>
              </span>
              <span className={styles.ctaValue}>
                One page, PDF
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
            <a
              className={styles.cta}
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.ctaLabel}>
                LinkedIn
                <span aria-hidden="true">&#8599;</span>
              </span>
              <span className={styles.ctaValue}>
                in/bulldevon
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
            <a
              className={styles.cta}
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.ctaLabel}>
                GitHub
                <span aria-hidden="true">&#8599;</span>
              </span>
              <span className={styles.ctaValue}>
                DBULL7
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
            <a className={styles.cta} href="/blog">
              <span className={styles.ctaLabel}>
                Field notes
                <span aria-hidden="true">&#8594;</span>
              </span>
              <span className={styles.ctaValue}>
                Writing, hardware experiments, post-mortems
              </span>
            </a>
          </div>
          <p className={styles.ctaFoot}>
            TODO(devon): add public/resume.pdf &mdash; the link is already wired
            and works the moment the file is real.
          </p>
        </div>
      </div>
    </section>
  )
}
