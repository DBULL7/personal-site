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
      elapsed = 0,
      visible = true,
      disposed = false
    const pointer = { x: 0, y: 0 }
    const draw = (t: number) => {
      const sky = ctx.createLinearGradient(0, 0, 0, h)
      sky.addColorStop(0, '#edf4f3')
      sky.addColorStop(0.48, '#e5efef')
      sky.addColorStop(1, '#a7cbd0')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, w, h)
      const mx = w * 0.73,
        my = h * 0.33,
        mr = Math.min(w * 0.09, 66)
      ctx.fillStyle = '#87aeb9'
      ctx.globalAlpha = 0.38
      for (let y = -mr; y < mr; y += 4)
        for (let x = -mr; x < mr; x += 4)
          if (x * x + y * y < mr * mr) {
            ctx.beginPath()
            ctx.arc(mx + x, my + y, 0.7, 0, Math.PI * 2)
            ctx.fill()
          }
      for (let row = 0; row < 80; row++) {
        const d = row / 79
        for (let col = 0; col < 140; col++) {
          const u = (col / 139 - 0.5) * 3.3
          const wave =
            Math.sin(u * 3.2 + d * 11 - t * 0.6) * 0.55 +
            Math.cos(u * 5.8 - d * 8 - t * 0.35) * 0.32
          const xx =
            w / 2 +
            u * w * (0.19 + d * 0.39) +
            Math.sin(t * 0.3 + d * 3) * d * 3
          const yy =
            h * (0.52 + d * 0.47 - wave * 0.075 * d) + pointer.y * d * 3
          const reflected = Math.abs(u - 0.51) < 0.22 + 0.08 * Math.sin(d * 20)
          ctx.fillStyle = reflected
            ? '#e1f0eb'
            : wave > 0.38
              ? '#427f8e'
              : '#286070'
          ctx.globalAlpha = reflected ? 0.85 : 0.35 + d * 0.6
          ctx.beginPath()
          ctx.ellipse(xx, yy, 0.45 + d * 1.3, 0.35 + d * 0.8, 0, 0, Math.PI * 2)
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
            Thoughtful code.
            <br />
            <span>Room to wonder.</span>
          </h1>
          <p>I’m Devon Bull, a software engineer exploring what comes next.</p>
          <a className={styles.primary} href="#explore">
            Explore my work
            <Arrow />
          </a>
        </div>
        <div className={styles.sceneFooter}>
          <div>
            <strong>Tidal</strong>
            <span>An ocean of individual points, moving as one.</span>
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
          <h2 id="explore-title">Depth beneath the surface.</h2>
          <p>
            Software starts with curiosity. Mine takes me across JavaScript,
            TypeScript, Go and React — from small experiments to the systems
            underneath.
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
        <span>Tidal · An interactive portfolio study</span>
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
