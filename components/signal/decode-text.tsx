'use client'

import { createElement, useEffect, useRef, useState } from 'react'
import type { ElementType } from 'react'

import styles from './decode-text.module.css'

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#*+=-_/\\|<>[]{}~^%$&'

type Props = {
  text: string
  as?: ElementType
  className?: string
  /** seconds before the resolve starts once the element is in view */
  delay?: number
  /** seconds from first glyph to full lock */
  duration?: number
  /** replay every time the element re-enters the viewport */
  replay?: boolean
  id?: string
}

/**
 * Renders `text` and, on entering the viewport, resolves it out of glyph noise.
 * The real string is always present in the accessibility tree and in the SSR
 * markup — the scramble is a purely visual layer that is skipped entirely for
 * `prefers-reduced-motion`.
 */
export function DecodeText({
  text,
  as = 'span',
  className,
  delay = 0,
  duration = 0.9,
  replay = false,
  id
}: Props) {
  const hostRef = useRef<HTMLElement | null>(null)
  const [display, setDisplay] = useState(text)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplay(text)
      return
    }

    let raf = 0
    let cancelled = false
    const chars = Array.from(text)
    const seeds = chars.map((_, i) => {
      const wave = i / Math.max(chars.length - 1, 1)
      return delay + wave * duration * 0.55 + Math.random() * duration * 0.45
    })

    const run = () => {
      const begin = performance.now()
      setStarted(true)
      let lastChurn = 0
      let frame = ''
      const tick = (now: number) => {
        if (cancelled) return
        const t = (now - begin) / 1000
        const churn = now - lastChurn > 34
        if (churn) lastChurn = now
        let done = true
        if (churn) {
          frame = chars
            .map((char, i) => {
              if (char === ' ' || char === '\u00a0') return char
              if (t >= seeds[i]) return char
              done = false
              return GLYPHS[(Math.random() * GLYPHS.length) | 0]
            })
            .join('')
          setDisplay(frame)
        } else {
          done = chars.every((char, i) => char === ' ' || t >= seeds[i])
        }
        if (!done) {
          raf = requestAnimationFrame(tick)
        } else {
          setDisplay(text)
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run()
            if (!replay) io.disconnect()
          }
        }
      },
      { threshold: 0.25 }
    )
    io.observe(host)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [text, delay, duration, replay])

  return createElement(
    as,
    {
      ref: hostRef,
      className: `${styles.root} ${className ?? ''}`,
      id,
      'data-resolving': started && display !== text ? 'true' : undefined
    },
    createElement(
      'span',
      { 'aria-hidden': 'true', className: styles.visual },
      display
    ),
    createElement('span', { className: styles.sr }, text)
  )
}
