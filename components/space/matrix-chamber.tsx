'use client'

import { useEffect, useRef, useState } from 'react'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faAws, faOpenai } from '@fortawesome/free-brands-svg-icons'
import {
  faCode,
  faDatabase,
  faTerminal
} from '@fortawesome/free-solid-svg-icons'
import type { SimpleIcon } from 'simple-icons'
import {
  siApache,
  siAnthropic,
  siApple,
  siBun,
  siC,
  siCircleci,
  siClaude,
  siCloudflare,
  siCplusplus,
  siCss,
  siCursor,
  siDatadog,
  siDeno,
  siDjango,
  siDocker,
  siElectron,
  siElixir,
  siExpress,
  siFastapi,
  siFirefoxbrowser,
  siFlask,
  siGit,
  siGithub,
  siGithubactions,
  siGithubcopilot,
  siGitlab,
  siGnubash,
  siGo,
  siGooglechrome,
  siGooglecloud,
  siGrafana,
  siGraphql,
  siHackthebox,
  siHtml5,
  siHuggingface,
  siIntellijidea,
  siJavascript,
  siJenkins,
  siJetbrains,
  siKalilinux,
  siKubernetes,
  siLaravel,
  siLinux,
  siMongodb,
  siMysql,
  siNeovim,
  siNestjs,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siNpm,
  siOpenjdk,
  siOwasp,
  siPagerduty,
  siPhp,
  siPhoenixframework,
  siPnpm,
  siPostgresql,
  siPostman,
  siPrisma,
  siPrometheus,
  siPython,
  siRaspberrypi,
  siReact,
  siRedis,
  siRuby,
  siRubyonrails,
  siRust,
  siSafari,
  siSentry,
  siSpringboot,
  siSqlite,
  siSupabase,
  siSwift,
  siTailwindcss,
  siTerraform,
  siTorbrowser,
  siTypescript,
  siUbuntu,
  siVercel,
  siVim,
  siVite,
  siVscodium,
  siWireshark,
  siYarn
} from 'simple-icons'
import * as THREE from 'three'
import {
  createChamberArtifact,
  type BlackGlassBackWallStudy,
  type ChamberEnvironment
} from './chamber-artifacts'
import styles from './matrix-chamber.module.css'

type MatrixChamberProps = {
  paused?: boolean
  glyphSet?: 'matrix' | 'toolkit'
  environment?: ChamberEnvironment
  blackGlassBackWall?: BlackGlassBackWallStudy
}

type RainGlyph =
  | { type: 'text'; value: string; label?: string }
  | { type: 'icon'; icon: IconDefinition; label: string }
  | { type: 'simple-icon'; icon: SimpleIcon }

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
  floorGhost?: {
    material: THREE.MeshBasicMaterial
    mesh: THREE.Mesh
  }
}

const matrixGlyphs: RainGlyph[] = [
  ...'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\[]{}+=-_#%&@',
  ...'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
  ...'零壱弐参肆伍陸漆捌玖'
].map((value) => ({ type: 'text' as const, value }))

const logo = (icon: SimpleIcon): RainGlyph => ({ type: 'simple-icon', icon })

const toolkitGlyphs: RainGlyph[] = [
  // Languages and core web technologies.
  logo(siTypescript),
  logo(siJavascript),
  logo(siPython),
  logo(siRuby),
  logo(siElixir),
  logo(siGo),
  logo(siRust),
  logo(siC),
  logo(siCplusplus),
  logo(siOpenjdk),
  logo(siSwift),
  logo(siPhp),
  logo(siGnubash),
  logo(siHtml5),
  logo(siCss),

  // Frameworks and runtimes.
  logo(siReact),
  logo(siNextdotjs),
  logo(siNodedotjs),
  logo(siDeno),
  logo(siBun),
  logo(siPhoenixframework),
  logo(siRubyonrails),
  logo(siDjango),
  logo(siFlask),
  logo(siFastapi),
  logo(siExpress),
  logo(siNestjs),
  logo(siSpringboot),
  logo(siLaravel),
  logo(siTailwindcss),
  logo(siVite),
  logo(siElectron),

  // Cloud, infrastructure, and delivery.
  { type: 'icon', icon: faAws, label: 'AWS' },
  logo(siGooglecloud),
  logo(siDocker),
  logo(siKubernetes),
  logo(siTerraform),
  logo(siCloudflare),
  logo(siVercel),
  logo(siNginx),
  logo(siApache),
  logo(siGithubactions),
  logo(siJenkins),
  logo(siCircleci),
  logo(siRaspberrypi),

  // Databases, APIs, and data tooling.
  logo(siPostgresql),
  logo(siRedis),
  logo(siMongodb),
  logo(siSqlite),
  logo(siMysql),
  logo(siSupabase),
  logo(siGraphql),
  logo(siPrisma),
  logo(siPostman),

  // Source control, editors, package managers, and environments.
  logo(siGit),
  logo(siGithub),
  logo(siGitlab),
  logo(siNpm),
  logo(siPnpm),
  logo(siYarn),
  logo(siVscodium),
  logo(siNeovim),
  logo(siVim),
  logo(siCursor),
  logo(siJetbrains),
  logo(siIntellijidea),
  logo(siLinux),
  logo(siUbuntu),
  logo(siApple),
  logo(siGooglechrome),
  logo(siSafari),
  logo(siFirefoxbrowser),

  // AI, observability, and security.
  { type: 'icon', icon: faOpenai, label: 'OpenAI' },
  logo(siAnthropic),
  logo(siClaude),
  logo(siHuggingface),
  logo(siGithubcopilot),
  logo(siSentry),
  logo(siDatadog),
  logo(siGrafana),
  logo(siPrometheus),
  logo(siPagerduty),
  logo(siKalilinux),
  logo(siWireshark),
  logo(siTorbrowser),
  logo(siOwasp),
  logo(siHackthebox),

  // Compact universal software symbols.
  { type: 'icon', icon: faTerminal, label: 'Terminal' },
  { type: 'icon', icon: faCode, label: 'Code' },
  { type: 'icon', icon: faDatabase, label: 'Data' },
  { type: 'text', value: '{}', label: 'Source' },
  { type: 'text', value: '</>', label: 'Markup' },
  { type: 'text', value: '$', label: 'Shell' },
  { type: 'text', value: '#', label: 'Root' }
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
    const fontSize =
      glyph.value.length > 2 ? 28 : glyph.value.length > 1 ? 39 : 52
    context.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(glyph.value, canvas.width / 2, canvas.height / 2)
    return
  }

  const targetSize = 58
  const isSimpleIcon = glyph.type === 'simple-icon'
  const iconWidth = isSimpleIcon ? 24 : glyph.icon.icon[0]
  const iconHeight = isSimpleIcon ? 24 : glyph.icon.icon[1]
  const pathData = isSimpleIcon ? glyph.icon.path : glyph.icon.icon[4]
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
  glyphSet = 'matrix',
  environment = 'standard',
  blackGlassBackWall = 'baseline'
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
    const isCastle = environment === 'castle'
    const isCyber = environment === 'cyber'
    const isBlackGlass = environment === 'black-glass'

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: isCastle,
        powerPreference: 'high-performance'
      })
    } catch {
      setFailed(true)
      return
    }

    renderer.setClearColor(0x000301, isCastle ? 0 : 1)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08

    const scene = new THREE.Scene()
    scene.background = isCastle ? null : new THREE.Color(0x000301)
    scene.fog = isCastle
      ? null
      : new THREE.FogExp2(
          isCyber ? 0x010805 : 0x000301,
          isCyber ? 0.017 : isBlackGlass ? 0.021 : 0.03
        )

    if (isCyber) {
      scene.add(new THREE.AmbientLight(0x214d30, 1.7))
      const corridorLight = new THREE.PointLight(0x59ff89, 23, 34, 1.7)
      corridorLight.position.set(0, 4.2, -5)
      scene.add(corridorLight)
      const backLight = new THREE.PointLight(0x2a7dff, 9, 22, 1.8)
      backLight.position.set(0, 6.2, -19)
      scene.add(backLight)
    }

    if (isBlackGlass) {
      scene.add(new THREE.AmbientLight(0x213029, 1.4))
      const floorLight = new THREE.PointLight(0x7dff9f, 13, 25, 1.8)
      floorLight.position.set(0, 1.8, -3)
      scene.add(floorLight)
    }

    const camera = new THREE.PerspectiveCamera(
      56,
      1,
      0.1,
      blackGlassBackWall === 'wall-lightning' ? 150 : 80
    )
    camera.position.set(0, 1.4, 14)
    const cameraTarget = new THREE.Vector3(
      0,
      blackGlassBackWall === 'wall-lightning' ? 2.1 : 0.4,
      -7
    )
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
    const artifactCenterZ = -8
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
    roomLines.visible = !isCastle && !isCyber && !isBlackGlass
    room.add(roomLines)
    if (environment === 'standard') {
      ;[5, 10, 15, 20, 25, 30].forEach((depth) => {
        const marker = makeMarker(`${String(depth).padStart(2, '0')} FT`)
        marker.position.set(-10.3, floorY + 0.22, roomFront - depth)
        marker.rotation.x = -Math.PI / 2
        room.add(marker)
      })
    }

    const glowTexture = makeGlowTexture()
    if (glowTexture && !isCastle && !isBlackGlass) {
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

    const artifact = createChamberArtifact(
      environment,
      floorY,
      artifactCenterZ,
      blackGlassBackWall
    )
    if (artifact) scene.add(artifact.group)

    const chooseDepth = (index: number) => {
      const band = index % 3
      if (band === 0) return 2 + random() * 7
      if (band === 1) return 10 + random() * 9
      return 20 + random() * 10
    }

    const chooseParticlePosition = (index: number) => {
      const ambientPosition = {
        baseX: -10.5 + random() * 21,
        depth: chooseDepth(index)
      }
      if (environment === 'standard' || index % 3 !== 0) return ambientPosition

      if (environment === 'castle') return ambientPosition

      if (environment === 'black-glass') return ambientPosition

      if (environment === 'relic') {
        return {
          baseX: -3.4 + random() * 6.8,
          depth: roomFront - (artifactCenterZ - 2.2 + random() * 4.4)
        }
      }

      if (environment === 'cyber') {
        const side = random() < 0.5 ? -1 : 1
        return {
          baseX: side * (5.1 + random() * 4.6),
          depth: 1.5 + random() * 27.5
        }
      }

      const angle = random() * Math.PI * 2
      const radius =
        environment === 'reactor'
          ? Math.sqrt(random()) * 3.2
          : 2.7 + random() * 2.4
      const z = artifactCenterZ + Math.sin(angle) * radius
      return {
        baseX: Math.cos(angle) * radius,
        depth: roomFront - z
      }
    }

    const particles: GlyphParticle[] = []
    const particleCount = window.innerWidth < 700 ? 78 : 148
    for (let index = 0; index < particleCount; index += 1) {
      const glyphCanvas = document.createElement('canvas')
      glyphCanvas.width = 96
      glyphCanvas.height = 96
      const glyphContext = glyphCanvas.getContext('2d')
      if (!glyphContext) continue
      const position = chooseParticlePosition(index)
      const depth = position.depth
      const brightness = THREE.MathUtils.lerp(0.94, 0.32, depth / 30)
      const initialGlyph =
        glyphSet === 'toolkit'
          ? glyphs[index % glyphs.length]
          : glyphs[Math.floor(random() * glyphs.length)]
      drawGlyph(
        glyphCanvas,
        glyphContext,
        initialGlyph,
        isBlackGlass ? 0.86 : brightness
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
      const baseX = position.baseX
      const y =
        isBlackGlass && index % 4 === 0
          ? floorY - random() * 1.35
          : floorY + random() * (ceilingY - floorY)
      sprite.position.set(baseX, y, roomFront - depth)
      scene.add(sprite)

      let floorGhost: GlyphParticle['floorGhost']
      if (isBlackGlass) {
        const ghostMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide
        })
        const ghostMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1),
          ghostMaterial
        )
        ghostMesh.rotation.x = -Math.PI / 2
        ghostMesh.position.set(baseX, floorY + 0.058, roomFront - depth)
        scene.add(ghostMesh)
        floorGhost = {
          material: ghostMaterial,
          mesh: ghostMesh
        }
      }

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
        brightness,
        floorGhost
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
    let surgeStarted = -10

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
      const triggeredSurge = THREE.MathUtils.clamp(
        1 - (elapsed - surgeStarted) / 1.35,
        0,
        1
      )
      const ambientSurge =
        environment === 'black-glass'
          ? Math.pow(Math.max(0, Math.sin(elapsed * 0.42)), 18) * 0.24
          : environment === 'cyber'
            ? Math.pow(Math.max(0, Math.sin(elapsed * 0.64)), 12) * 0.42
            : environment === 'castle'
              ? Math.pow(Math.max(0, Math.sin(elapsed * 0.34)), 20) * 0.16
              : environment === 'reactor'
                ? Math.pow(Math.max(0, Math.sin(elapsed * 0.78)), 16) * 0.62
                : environment === 'invocation'
                  ? Math.pow(Math.max(0, Math.sin(elapsed * 0.52)), 20) * 0.34
                  : 0
      const surge = Math.max(triggeredSurge, ambientSurge)

      artifact?.update(elapsed, surge)

      particles.forEach((particle, index) => {
        const previousY = particle.y
        if (shouldMove) particle.y += delta * particle.speed * (1 + surge * 2.2)
        if (particle.y > ceilingY + 0.8) {
          particle.y = floorY - random() * 1.4
          const position = chooseParticlePosition(index + Math.floor(elapsed))
          particle.depth = position.depth
          particle.baseX = position.baseX
          particle.brightness = THREE.MathUtils.lerp(
            0.94,
            0.32,
            particle.depth / 30
          )
        }

        const currentX =
          particle.baseX +
          Math.sin(elapsed * particle.drift + particle.phase) * 0.16
        const currentZ = roomFront - particle.depth
        if (previousY < floorY && particle.y >= floorY)
          artifact?.onGlyphEmerge?.(currentX, currentZ)

        if (shouldMove && elapsed >= particle.nextMutation) {
          drawGlyph(
            particle.canvas,
            particle.context,
            glyphs[Math.floor(random() * glyphs.length)],
            isBlackGlass ? 0.86 : particle.brightness
          )
          particle.texture.needsUpdate = true
          particle.nextMutation =
            elapsed +
            (glyphSet === 'toolkit'
              ? 0.6 + random() * 1.4
              : 0.14 + random() * 0.62)
        }

        const progress = THREE.MathUtils.clamp(
          (particle.y - floorY) / (ceilingY - floorY),
          0,
          1
        )
        const heightFromFloor = particle.y - floorY
        const surfaceBirth =
          isBlackGlass && heightFromFloor >= 0
            ? 1 - THREE.MathUtils.clamp(heightFromFloor / 1.7, 0, 1)
            : 0
        const flicker = 0.82 + Math.sin(elapsed * 4.2 + particle.phase) * 0.18
        const ambientOpacity =
          Math.sin(progress * Math.PI) *
          particle.brightness *
          flicker *
          (1 + surge * 0.24)
        const breachOpacity =
          surfaceBirth *
          (0.54 + particle.brightness * 0.12) *
          (0.94 + flicker * 0.06)
        particle.material.opacity = Math.max(ambientOpacity, breachOpacity)
        particle.sprite.position.set(currentX, particle.y, currentZ)

        if (particle.floorGhost) {
          const approach = THREE.MathUtils.clamp(
            1 + heightFromFloor / 1.35,
            0,
            1
          )
          const release = 1 - THREE.MathUtils.clamp(heightFromFloor / 2.2, 0, 1)
          const ghostStrength =
            heightFromFloor < 0 ? 0.08 + approach * 0.44 : release * 0.27
          particle.floorGhost.material.opacity =
            ghostStrength *
            (0.72 + particle.brightness * 0.28) *
            flicker *
            (1 + surge * 0.28)
          particle.floorGhost.mesh.position.set(
            currentX,
            floorY + 0.058,
            currentZ
          )
          const liquidWarp = Math.sin(elapsed * 1.7 + particle.phase) * 0.075
          const ghostScale = particle.sprite.scale.x
          particle.floorGhost.mesh.scale.set(
            ghostScale * (1.42 + liquidWarp),
            ghostScale * (1.12 - liquidWarp),
            1
          )
        }
      })

      const cameraEase = 0.035
      const cameraTravel = isCastle ? 0.22 : 0.72
      camera.position.x +=
        (pointer.x * cameraTravel - camera.position.x) * cameraEase
      camera.position.y +=
        (1.4 + pointer.y * (isCastle ? 0.12 : 0.34) - camera.position.y) *
        cameraEase
      cameraTarget.x +=
        (pointer.x * (isCastle ? 0.06 : 0.18) - cameraTarget.x) * cameraEase
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
    const triggerSurge = () => {
      if (environment !== 'standard') surgeStarted = timer.getElapsed()
    }

    resizeObserver.observe(host)
    visibilityObserver.observe(host)
    document.addEventListener('visibilitychange', handleVisibility)
    host.addEventListener('pointermove', updatePointer)
    host.addEventListener('pointerdown', triggerSurge)
    if (environment === 'relic')
      window.addEventListener('keydown', triggerSurge)
    resize()
    syncAnimation()

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      host.removeEventListener('pointermove', updatePointer)
      host.removeEventListener('pointerdown', triggerSurge)
      if (environment === 'relic')
        window.removeEventListener('keydown', triggerSurge)
      timer.dispose()
      artifact?.dispose?.()
      const disposedTextures = new Set<THREE.Texture>()
      const disposeMaterial = (material: THREE.Material) => {
        const mappedMaterial = material as THREE.Material & {
          map?: THREE.Texture | null
        }
        if (mappedMaterial.map && !disposedTextures.has(mappedMaterial.map)) {
          disposedTextures.add(mappedMaterial.map)
          mappedMaterial.map.dispose()
        }
        material.dispose()
      }
      scene.traverse((object) => {
        if (
          object instanceof THREE.LineSegments ||
          object instanceof THREE.Line ||
          object instanceof THREE.Mesh ||
          object instanceof THREE.InstancedMesh
        ) {
          object.geometry.dispose()
          if (Array.isArray(object.material))
            object.material.forEach(disposeMaterial)
          else disposeMaterial(object.material)
        }
        if (object instanceof THREE.Sprite) {
          disposeMaterial(object.material)
        }
      })
      renderer.dispose()
    }
  }, [blackGlassBackWall, environment, glyphSet])

  return (
    <div
      ref={hostRef}
      className={styles.scene}
      data-environment={environment}
      aria-hidden="true"
    >
      {failed ? (
        <div className={styles.fallback} />
      ) : (
        <canvas ref={canvasRef} className={styles.canvas} />
      )}
      <span className={styles.renderStatus}>
        {failed
          ? 'Static chamber'
          : environment !== 'standard'
            ? `Powered field · ${environment}`
            : glyphSet === 'toolkit'
              ? 'Spatial render · 30 ft · toolkit'
              : 'Spatial render · 30 ft'}
      </span>
    </div>
  )
}
