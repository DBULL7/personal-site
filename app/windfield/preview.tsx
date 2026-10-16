'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './preview.module.css'

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Preview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const elapsedRef = useRef(0)
  const [paused, setPaused] = useState(true)
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setPaused(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) {
      setUnavailable(true)
      return
    }
    const ctx = context
    let w = 1,
      h = 1,
      frame = 0,
      last = 0,
      elapsed = elapsedRef.current,
      visible = true,
      disposed = false
    const pointer = { x: 0, y: 0 }
    const draw = (t: number) => {
      const sky = ctx.createLinearGradient(0, 0, 0, h)
      sky.addColorStop(0, '#e7eee3')
      sky.addColorStop(0.55, '#e8eddb')
      sky.addColorStop(1, '#c1d3a5')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, w, h)
      // A stippled sun stays behind the landscape.
      const sx = w * 0.78,
        sy = h * 0.29,
        sr = Math.min(w * 0.075, 58)
      ctx.fillStyle = '#c8a75a'
      for (let y = -sr; y < sr; y += 4)
        for (let x = -sr; x < sr; x += 4) {
          if (x * x + y * y < sr * sr) {
            ctx.globalAlpha = 0.52
            ctx.beginPath()
            ctx.arc(sx + x, sy + y, 0.8, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      ctx.globalAlpha = 1
      for (let row = 0; row < 76; row++) {
        const d = row / 75
        for (let col = 0; col < 130; col++) {
          const u = (col / 129 - 0.5) * 3.8
          const xx = w / 2 + u * w * (0.17 + 0.42 * d)
          const ridge =
            Math.sin(u * 2.4 + d * 2.7) * 0.48 +
            Math.cos(u * 4.1 - d * 2.8) * 0.21
          const breeze =
            Math.sin(u * 5 + d * 9 - t * 0.7 + pointer.x * 0.8) * 0.015
          const yy = h * (0.53 + d * 0.53 - (ridge + breeze) * 0.25 * d)
          const light = 0.5 + 0.5 * Math.sin(u * 2.4 + d * 2.7 + 0.8)
          ctx.fillStyle =
            light > 0.55 ? '#6c8c35' : light > 0.28 ? '#477a47' : '#22564b'
          ctx.globalAlpha = 0.42 + d * 0.54
          const r = 0.48 + d * 1.55
          ctx.beginPath()
          ctx.arc(
            xx + Math.sin(t * 0.55 + d * 8 + u * 3) * d * 2.2,
            yy,
            r,
            0,
            Math.PI * 2
          )
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(elapsed)
    }
    const tick = (now: number) => {
      if (disposed) return
      if (now - last >= 1000 / 30) {
        elapsed += Math.min((now - last) / 1000, 0.05)
        last = now
        draw(elapsed)
      }
      frame = requestAnimationFrame(tick)
    }
    const synchronize = () => {
      cancelAnimationFrame(frame)
      last = performance.now()
      if (!paused && visible && !document.hidden)
        frame = requestAnimationFrame(tick)
      else draw(elapsed)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    const intersection = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      synchronize()
    })
    intersection.observe(canvas)
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const box = canvas.getBoundingClientRect()
      pointer.x = (event.clientX - box.left) / box.width - 0.5
      pointer.y = (event.clientY - box.top) / box.height - 0.5
    }
    canvas.addEventListener('pointermove', move)
    document.addEventListener('visibilitychange', synchronize)
    resize()
    synchronize()
    return () => {
      disposed = true
      elapsedRef.current = elapsed
      cancelAnimationFrame(frame)
      observer.disconnect()
      intersection.disconnect()
      canvas.removeEventListener('pointermove', move)
      document.removeEventListener('visibilitychange', synchronize)
    }
  }, [paused])

  return (
    <main className={styles.page}>
      <a className={styles.skip} href="#explore">
        Skip to portfolio links
      </a>
      <header className={styles.navigation}>
        <Link className={styles.identity} href="/">
          Devon Bull<span>Software engineer</span>
        </Link>
        <nav aria-label="Portfolio">
          <a href="#explore">Explore</a>
          <Link href="/blog">Writing</Link>
          <a
            href="https://www.linkedin.com/in/bulldevon"
            target="_blank"
            rel="noreferrer"
          >
            Connect
            <Arrow />
          </a>
        </nav>
      </header>
      <section className={styles.hero} aria-labelledby="preview-title">
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <h1 id="preview-title">
            A little curiosity.
            <br />
            <span>A wider horizon.</span>
          </h1>
          <p>
            Software engineer. Exploring the space between technology and
            imagination.
          </p>
          <a className={styles.primary} href="#explore">
            Explore my work
            <Arrow />
          </a>
        </div>
        <div className={styles.sceneFooter}>
          <div>
            <strong>Windfield</strong>
            <span>A landscape made of points, moved by a gentle breeze.</span>
          </div>
          {!unavailable && (
            <button
              type="button"
              className={styles.motion}
              onClick={() => setPaused((value) => !value)}
              aria-pressed={paused}
              aria-label={
                paused
                  ? 'Play landscape animation'
                  : 'Pause landscape animation'
              }
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                {paused ? (
                  <path d="m7 4 9 6-9 6V4Z" fill="currentColor" />
                ) : (
                  <path
                    d="M7 4v12M13 4v12"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                )}
              </svg>
              <span>{paused ? 'Play' : 'Pause'}</span>
            </button>
          )}
        </div>
      </section>
      <section
        id="explore"
        className={styles.explore}
        aria-labelledby="explore-title"
      >
        <div className={styles.about}>
          <h2 id="explore-title">Let curiosity lead.</h2>
          <p>
            I’m Devon, a software engineer. I work with JavaScript, TypeScript,
            Go and React — and enjoy seeing where a small idea can go.
          </p>
        </div>
        <div className={styles.destinations}>
          <a href="https://github.com/DBULL7" target="_blank" rel="noreferrer">
            <div>
              <span>Code & experiments</span>
              <p>Explore my public repositories on GitHub.</p>
            </div>
            <Arrow />
          </a>
          <Link href="/blog">
            <div>
              <span>Notes & ideas</span>
              <p>Read my writing on technology and software.</p>
            </div>
            <Arrow />
          </Link>
        </div>
      </section>
      <footer className={styles.footer}>
        <Link href="/">Devon Bull</Link>
        <span>Windfield · An interactive portfolio study</span>
        <a
          href="https://www.linkedin.com/in/bulldevon"
          target="_blank"
          rel="noreferrer"
        >
          Let’s connect
          <Arrow />
        </a>
      </footer>
    </main>
  )
}
