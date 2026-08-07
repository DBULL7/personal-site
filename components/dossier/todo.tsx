import styles from './dossier.module.css'

/**
 * A clearly-marked content placeholder. Every instance is mirrored in
 * docs/career-content-todo.md so the owner can fill them in one sitting.
 */
export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <mark className={styles.todo} data-content-todo="">
      <span className={styles.todoTag}>Todo</span>
      {children}
    </mark>
  )
}
