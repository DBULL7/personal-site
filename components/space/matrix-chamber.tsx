'use client'

import { useEffect, useRef, useState } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faApple,
  faChrome,
  faDocker,
  faGitAlt,
  faGithub,
  faNodeJs,
  faOpenai,
  faReact,
  faSafari
} from '@fortawesome/free-brands-svg-icons'
import {
  faCode,
  faDatabase,
  faTerminal
} from '@fortawesome/free-solid-svg-icons'
import * as THREE from 'three'
import styles from './matrix-chamber.module.css'

type MatrixChamberProps = {
  paused?: boolean
  glyphSet?: 'matrix' | 'toolkit'
}

type RainGlyph =
  | { type: 'text'; value: string; label?: string }
  | { type: 'icon'; icon: IconDefinition; label: string }

type GlyphParticle = {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  texture: THREE.CanvasTexture
  material: THREE.SpriteMaterial
  sprite: THREE.Sprite
  baseX: number
  y: number
  depth: number
  speed: number
  phase: number
  drift: number
  nextMutation: number
  brightness: number
}

const matrixGlyphs: RainGlyph[] = [
  ...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\[]{}+=-_#%&@',
  ...'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
  ...'零壱弐参肆伍陸漆捌玖'
].map((value) => ({ type: 'text' as const, value }))

const toolkitGlyphs: RainGlyph[] = [
  { type: 'icon', icon: faReact, label: 'React' },
  { type: 'icon', icon: faNodeJs, label: 'Node.js' },
  { type: 'text', value: 'TS', label: 'TypeScript' },
  { type: 'icon', icon: faTerminal, label: 'Terminal' },
  { type: 'icon', icon: faChrome, label: 'Chrome' },
  { type: 'icon', icon: faSafari, label: 'Safari' },
  { type: 'icon', icon: faOpenai, label: 'OpenAI' },
  { type: 'text', value: '✳', label: 'Claude / Anthropic' },
  { type: 'icon', icon: faGithub, label: 'GitHub' },
  { type: 'icon', icon: faGitAlt, label: 'Git' },
  { type: 'icon', icon: faDocker, label: 'Docker' },
  { type: 'icon', icon: faApple, label: 'Apple' },
  { type: 'text', value: 'GO', label: 'Go' },
  { type: 'icon', icon: faCode, label: 'Code' },
  { type: 'icon', icon: faDatabase, label: 'Data' },
  { type: 'text', value: '{}', label: 'Source' }
]

function drawGlyph(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  glyph: RainGlyph,
  brightness: number
) {
  context.clearRect(0, 0, canvas.width, canvas.height)
  const alpha = Math.max(0.28, brightness)
  context.shadowColor = `rgba(52, 255, 113, ${alpha})`
  context.shadowBlur = 14
  context.fillStyle = `rgba(117, 255, 156, ${alpha})`

  if (glyph.type === 'text') {
    const fontSize = glyph.value.length > 1 ? 39 : 52
    context.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(glyph.value, canvas.width / 2, canvas.height / 2)
    return
  }

  const [iconWidth, iconHeight, , , pathData] = glyph.icon.icon
  const targetSize = 54
  const scale = targetSize / Math.max(iconWidth, iconHeight)
  const offsetX = (canvas.width - iconWidth * scale) / 2
  const offsetY = (canvas.height - iconHeight * scale) / 2
  const paths = Array.isArray(pathData) ? pathData : [pathData]

  context.save()
  context.translate(offsetX, offsetY)
  context.scale(scale, scale)
  paths.forEach((path) => context.fill(new Path2D(path)))
  context.restore()
}

function makeMarker(text: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 64
  const context = canvas.getContext('2d')
  if (!context) return new THREE.Sprite()
  context.font = '700 24px ui-monospace, SFMono-Regular, Menlo, monospace'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = 'rgba(89, 255, 140, .74)'
  context.fillText(text, 128, 32)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.68,
      depthWrite: false
    })
  )
  sprite.scale.set(2.2, 0.55, 1)
  return sprite
}

function makeGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')
  if (!context) return null
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(104, 255, 151, .82)')
  gradient.addColorStop(0.12, 'rgba(40, 255, 105, .4)')
  gradient.addColorStop(0.48, 'rgba(18, 147, 68, .12)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function MatrixChamber({
  paused = false,
  glyphSet = 'matrix'
}: MatrixChamberProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pausedRef = useRef(paused)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    const glyphs = glyphSet === 'toolkit' ? toolkitGlyphs : matrixGlyphs

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: 'high-performance'
      })
    } catch {
      setFailed(true)
      return
    }

    renderer.setClearColor(0x000301, 1)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000301)
    scene.fog = new THREE.FogExp2(0x000301, 0.03)

    const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 80)
    camera.position.set(0, 1.4, 14)
    const cameraTarget = new THREE.Vector3(0, 0.4, -7)
    camera.lookAt(cameraTarget)

    let seed = 481516
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }

    const room = new THREE.Group()
    scene.add(room)
    const linePositions: number[] = []
    const addLine = (
      start: [number, number, number],
      end: [number, number, number]
    ) => {
      linePositions.push(...start, ...end)
    }

    const floorY = -5.8
    const ceilingY = 9.5
    const roomFront = 8
    const roomBack = -22
    for (let depth = 0; depth <= 30; depth += 2.5) {
      const z = roomFront - depth
      addLine([-12, floorY, z], [12, floorY, z])
    }
    for (let x = -12; x <= 12; x += 2) {
      addLine([x, floorY, roomFront], [x, floorY, roomBack])
    }
    for (let y = floorY; y <= ceilingY; y += 3.8) {
      addLine([-12, y, roomFront], [-12, y, roomBack])
      addLine([12, y, roomFront], [12, y, roomBack])
      addLine([-12, y, roomBack], [12, y, roomBack])
    }
    for (let x = -12; x <= 12; x += 3)
      addLine([x, floorY, roomBack], [x, ceilingY, roomBack])
    addLine([-12, floorY, roomFront], [-12, ceilingY, roomFront])
    addLine([12, floorY, roomFront], [12, ceilingY, roomFront])
    addLine([-12, ceilingY, roomFront], [-12, ceilingY, roomBack])
    addLine([12, ceilingY, roomFront], [12, ceilingY, roomBack])

    const roomGeometry = new THREE.BufferGeometry()
    roomGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    )
    const roomLines = new THREE.LineSegments(
      roomGeometry,
      new THREE.LineBasicMaterial({
        color: 0x2b8e4a,
        transparent: true,
        opacity: 0.18
      })
    )
    room.add(roomLines)
    ;[5, 10, 15, 20, 25, 30].forEach((depth) => {
      const marker = makeMarker(`${String(depth).padStart(2, '0')} FT`)
      marker.position.set(-10.3, floorY + 0.22, roomFront - depth)
      marker.rotation.x = -Math.PI / 2
      room.add(marker)
    })

    const glowTexture = makeGlowTexture()
    if (glowTexture) {
      const centralGlow = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color: 0x44ff82,
          transparent: true,
          opacity: 0.16,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        })
      )
      centralGlow.position.set(0, 0.5, -8)
      centralGlow.scale.set(12, 12, 1)
      scene.add(centralGlow)
    }

    const chooseDepth = (index: number) => {
      const band = index % 3
      if (band === 0) return 2 + random() * 7
      if (band === 1) return 10 + random() * 9
      return 20 + random() * 10
    }

    const particles: GlyphParticle[] = []
    const particleCount = window.innerWidth < 700 ? 78 : 148
    for (let index = 0; index < particleCount; index += 1) {
      const glyphCanvas = document.createElement('canvas')
      glyphCanvas.width = 96
      glyphCanvas.height = 96
      const glyphContext = glyphCanvas.getContext('2d')
      if (!glyphContext) continue
      const depth = chooseDepth(index)
      const brightness = THREE.MathUtils.lerp(0.94, 0.32, depth / 30)
      drawGlyph(
        glyphCanvas,
        glyphContext,
        glyphs[Math.floor(random() * glyphs.length)],
        brightness
      )
      const texture = new THREE.CanvasTexture(glyphCanvas)
      texture.colorSpace = THREE.SRGBColorSpace
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
      const sprite = new THREE.Sprite(material)
      const scale = 0.48 + random() * 0.34
      sprite.scale.set(scale, scale, 1)
      const baseX = -10.5 + random() * 21
      const y = floorY + random() * (ceilingY - floorY)
      sprite.position.set(baseX, y, roomFront - depth)
      scene.add(sprite)
      particles.push({
        canvas: glyphCanvas,
        context: glyphContext,
        texture,
        material,
        sprite,
        baseX,
        y,
        depth,
        speed: 0.42 + random() * 0.62,
        phase: random() * Math.PI * 2,
        drift: 0.25 + random() * 0.5,
        nextMutation: random() * 0.8,
        brightness
      })
    }

    const pointer = new THREE.Vector2()
    const timer = new THREE.Timer()
    timer.connect(document)
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    let frame = 0
    let inView = true
    let pageVisible = !document.hidden

    const resize = () => {
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.fov = width < 700 ? 68 : 56
      camera.updateProjectionMatrix()
    }

    const updatePointer = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
    }

    const renderFrame = () => {
      timer.update()
      const delta = Math.min(timer.getDelta(), 0.05)
      const elapsed = timer.getElapsed()
      const shouldMove = !pausedRef.current && !reducedMotion

      particles.forEach((particle, index) => {
        if (shouldMove) particle.y += delta * particle.speed
        if (particle.y > ceilingY + 0.8) {
          particle.y = floorY - random() * 1.4
          particle.depth = chooseDepth(index + Math.floor(elapsed))
          particle.baseX = -10.5 + random() * 21
          particle.brightness = THREE.MathUtils.lerp(
            0.94,
            0.32,
            particle.depth / 30
          )
        }

        if (shouldMove && elapsed >= particle.nextMutation) {
          drawGlyph(
            particle.canvas,
            particle.context,
            glyphs[Math.floor(random() * glyphs.length)],
            particle.brightness
          )
          particle.texture.needsUpdate = true
          particle.nextMutation = elapsed + 0.14 + random() * 0.62
        }

        const progress = THREE.MathUtils.clamp(
          (particle.y - floorY) / (ceilingY - floorY),
          0,
          1
        )
        const fade = Math.sin(progress * Math.PI)
        const flicker = 0.82 + Math.sin(elapsed * 4.2 + particle.phase) * 0.18
        particle.material.opacity = fade * particle.brightness * flicker
        particle.sprite.position.set(
          particle.baseX +
            Math.sin(elapsed * particle.drift + particle.phase) * 0.16,
          particle.y,
          roomFront - particle.depth
        )
      })

      const cameraEase = 0.035
      camera.position.x += (pointer.x * 0.72 - camera.position.x) * cameraEase
      camera.position.y +=
        (1.4 + pointer.y * 0.34 - camera.position.y) * cameraEase
      cameraTarget.x += (pointer.x * 0.18 - cameraTarget.x) * cameraEase
      camera.lookAt(cameraTarget)
      renderer.render(scene, camera)
    }

    const animate = () => {
      renderFrame()
      frame = window.requestAnimationFrame(animate)
    }

    const syncAnimation = () => {
      window.cancelAnimationFrame(frame)
      timer.reset()
      if (reducedMotion) renderFrame()
      else if (inView && pageVisible)
        frame = window.requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        syncAnimation()
      },
      { threshold: 0.01 }
    )
    const handleVisibility = () => {
      pageVisible = !document.hidden
      syncAnimation()
    }

    resizeObserver.observe(host)
    visibilityObserver.observe(host)
    document.addEventListener('visibilitychange', handleVisibility)
    host.addEventListener('pointermove', updatePointer)
    resize()
    syncAnimation()

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      host.removeEventListener('pointermove', updatePointer)
      timer.dispose()
      scene.traverse((object) => {
        if (object instanceof THREE.LineSegments) {
          object.geometry.dispose()
          object.material.dispose()
        }
        if (object instanceof THREE.Sprite) {
          object.material.map?.dispose()
          object.material.dispose()
        }
      })
      renderer.dispose()
    }
  }, [glyphSet])

  return (
    <div ref={hostRef} className={styles.scene} aria-hidden="true">
      {failed ? (
        <div className={styles.fallback} />
      ) : (
        <canvas ref={canvasRef} className={styles.canvas} />
      )}
      <span className={styles.renderStatus}>
        {failed
          ? 'Static chamber'
          : glyphSet === 'toolkit'
            ? 'Spatial render · 30 ft · toolkit'
            : 'Spatial render · 30 ft'}
      </span>
    </div>
  )
}
