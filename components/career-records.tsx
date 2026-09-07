import Link from 'next/link'
import { signal } from '@/content/signal'
import styles from '@/app/signal.module.css'

export function CareerRecords() {
  return (
    <>
      <section className={styles.section} aria-labelledby="experience">
        <h2 id="experience">Experience</h2>
        <p className={styles.role}>
          {signal.person.title} at {signal.person.employer}
        </p>
        <p className={styles.muted}>{signal.person.tenure}</p>
        <ol className={styles.records} role="list">
          {signal.work.map((work) => (
            <li key={work.id}>
              <article id={work.id} className={styles.record}>
                <h3>{work.title}</h3>
                <dl className={styles.credits}>
                  <div>
                    <dt>Client</dt>
                    <dd>{work.client}</dd>
                  </div>
                  <div>
                    <dt>Period</dt>
                    <dd>{work.period}</dd>
                  </div>
                  <div>
                    <dt>Project role</dt>
                    <dd>{work.role}</dd>
                  </div>
                </dl>
                <p>{work.contribution}</p>
                <ul className={styles.highlights}>
                  {work.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                {work.technologies.length > 0 ? (
                  <p className={styles.muted}>
                    {work.technologies.join(' · ')}
                  </p>
                ) : null}
                {work.caseStudy ? (
                  <Link href="/work/cloud-console">
                    Read the cloud-console case study
                  </Link>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      </section>
      <section className={styles.section} aria-labelledby="education">
        <h2 id="education">Education</h2>
        <ul className={styles.education} role="list">
          {signal.education.map((education) => (
            <li key={education.school}>
              <h3>{education.school}</h3>
              <p>
                {education.study} · {education.year}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
