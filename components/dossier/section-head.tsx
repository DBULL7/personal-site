import styles from './dossier.module.css'

type SectionHeadProps = {
  index: string
  title: string
  id: string
  note?: React.ReactNode
}

export function SectionHead({ index, title, id, note }: SectionHeadProps) {
  return (
    <div className={styles.sectionHead}>
      <span className={styles.sectionIndex}>{index}</span>
      <h2 className={styles.sectionTitle} id={id}>
        {title}
      </h2>
      {note ? <p className={styles.sectionNote}>{note}</p> : null}
    </div>
  )
}
