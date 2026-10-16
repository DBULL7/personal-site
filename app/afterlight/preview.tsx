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
      ctx.fillStyle = '#050810'
      ctx.fillRect(0, 0, w, h)
      const vx = w * (0.66 + pointer.x * 0.035),
        vy = h * 0.43
      // A curved point lattice has its own perspective, rather than a flat grid texture.
      for (let row = 0; row < 84; row++) {
        const d = (row / 84 + t * 0.025) % 1
        const depth = d * d
        for (let col = -65; col <= 65; col++) {
          const u = col / 34
          const xx = vx + u * w * (0.045 + depth * 0.57)
          const wall = Math.pow(Math.abs(u), 1.8) * h * 0.085 * depth
          const yy =
            vy +
            h * 0.68 * depth -
            wall +
            Math.sin(u * 2.6 + d * 8 - t * 0.5) * h * 0.025 * depth
          if (xx < 0 || xx > w || yy < 0 || yy > h) continue
          ctx.globalAlpha = 0.25 + depth * 0.7
          ctx.fillStyle =
            col % 13 === 0 ? '#df77db' : row % 7 === 0 ? '#96f9fa' : '#278aab'
          ctx.beginPath()
          ctx.arc(xx, yy, 0.38 + depth * 1.35, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 0.7
      ctx.strokeStyle = '#71d8e3'
      ctx.lineWidth = 0.7
      ctx.beginPath()
      ctx.moveTo(vx, h * 0.25)
      ctx.lineTo(vx, vy - 10)
      ctx.stroke()
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
            Ideas into
            <br />
            <span>new dimensions.</span>
          </h1>
          <p>
            Devon Bull. Software engineer. Building, exploring, and following
            the next idea.
          </p>
          <a className={styles.primary} href="#explore">
            Explore my work
            <Arrow />
          </a>
        </div>
        <div className={styles.sceneFooter}>
          <div>
            <strong>Afterlight</strong>
            <span>
              A lightscape drawn from points, flowing through perspective.
            </span>
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
          <h2 id="explore-title">Follow the signal.</h2>
          <p>
            From interfaces to infrastructure, I work with TypeScript, Go, React
            and cloud tooling. Explore the code, or follow the thinking behind
            it.
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
        <span>Afterlight · An interactive portfolio study</span>
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
