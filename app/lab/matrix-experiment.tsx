'use client'

import { useState } from 'react'
import MatrixRain from '@/components/matrix-rain'
import styles from '../signal.module.css'

export function MatrixExperiment() {
  const [running, setRunning] = useState(false)

  return (
    <div>
      <button
        className={styles.experimentButton}
        type="button"
        aria-pressed={running}
        onClick={() => setRunning((current) => !current)}
      >
        {running ? 'Stop Matrix rain' : 'Start Matrix rain'}
      </button>
      <div id="matrix-canvas" className={styles.experiment} aria-hidden="true">
        {running ? <MatrixRain /> : null}
      </div>
    </div>
  )
}
