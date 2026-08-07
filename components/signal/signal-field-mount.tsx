'use client'

import dynamic from 'next/dynamic'
import type { MutableRefObject } from 'react'

import type { SignalMask, SignalState } from './signal-types'
import styles from './signal-field.module.css'

const SignalField = dynamic(() => import('./signal-field'), {
  ssr: false,
  loading: () => <div className={styles.host} aria-hidden="true" />
})

export function SignalFieldMount(props: {
  stateRef: MutableRefObject<SignalState>
  mask: SignalMask
  className?: string
  gain?: number
}) {
  return <SignalField {...props} />
}
