'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { stages } from '@/app/systems/systems-data'
import {
  damp,
  disposeObject,
  machinePalettes,
  makeCanvasTexture,
  monoFont,
  type MachineTheme
} from './machine-core'
import styles from './rack-scene.module.css'

export type MachineEvent =
  | 'enter'
  | 'fault'
  | 'breaker'
  | 'bypass'
  | 'rejoin'
  | 'complete'

type CutawaySceneProps = {
  theme: MachineTheme
  running: boolean
  speed: number
  explode: number
  faults: Record<string, boolean>
  activeId: string
  stepToken: number
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
  onEvent: (event: MachineEvent, stageId: string, at: number) => void
}

const MODULE_W = 3.1
const PITCH = 3.9
const MODULE_H = 3.2
const MODULE_D = 2.6
const ENTRY_X = -((stages.length - 1) * PITCH) / 2 - 2.2
const EXIT_X = ((stages.length - 1) * PITCH) / 2 + 2.2

const moduleX = (index: number) => (index - (stages.length - 1) / 2) * PITCH

function drawPlate(index: number, theme: MachineTheme) {
  const stage = stages[index]
  const palette = machinePalettes[theme]
  const ink = theme === 'dark' ? 'rgba(226, 240, 235, 0.95)' : 'rgba(20, 30, 28, 0.95)'
  return makeCanvasTexture(512, 128, (ctx) => {
    ctx.fillStyle = theme === 'dark' ? '#0d1618' : '#d8d4c9'
    ctx.fillRect(0, 0, 512, 128)
    ctx.strokeStyle = theme === 'dark' ? 'rgba(226, 240, 235, 0.25)' : 'rgba(20, 30, 28, 0.3)'
    ctx.lineWidth = 4
    ctx.strokeRect(6, 6, 500, 116)
    ctx.fillStyle = palette.signalCss
    ctx.font = monoFont(40, 700)
    ctx.textBaseline = 'middle'
    ctx.fillText(stage.code, 26, 64)
    ctx.fillStyle = ink
    ctx.font = monoFont(38, 700)
    ctx.fillText(stage.name.toUpperCase(), 108, 56)
    ctx.font = monoFont(18, 500)
    ctx.globalAlpha = 0.65
    ctx.fillText(stage.tools.slice(0, 3).join(' · ').toUpperCase(), 108, 96)
  })
}

export function CutawayScene(props: CutawaySceneProps) {
  const { theme } = props
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controls = useRef(props)
  controls.current = props

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    const palette = machinePalettes[theme]
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.setClearColor(palette.clear, 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(palette.clear)
    const camera = new THREE.PerspectiveCamera(34, 1, 0.5, 140)

    scene.add(
      new THREE.HemisphereLight(
        theme === 'dark' ? 0x8fd8cc : 0xffffff,
        theme === 'dark' ? 0x0a1416 : 0xa9a196,
        theme === 'dark' ? 0.8 : 1.4
      )
    )
    const key = new THREE.DirectionalLight(0xffffff, theme === 'dark' ? 1.8 : 2.4)
    key.position.set(4, 9, 11)
    scene.add(key)
    const rim = new THREE.PointLight(palette.signal, theme === 'dark' ? 30 : 12, 34, 2)
    rim.position.set(-8, 3, 6)
    scene.add(rim)

    const root = new THREE.Group()
    scene.add(root)
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()

    // ---- cutaway shells (instanced slabs) ---------------------------------
    const SLABS = 5
    const shellMaterial = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0x131c1e : 0x9c9890,
      roughness: 0.6,
      metalness: 0.5
    })
    const shells = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      shellMaterial,
      stages.length * SLABS
    )
    root.add(shells)

    // ---- internals (instanced) -------------------------------------------
    const INNER = 7
    const innerMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.45,
      metalness: 0.2
    })
    const internals = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.42, 0.42, 0.42),
      innerMaterial,
      stages.length * INNER
    )
    internals.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(stages.length * INNER * 3),
      3
    )
    root.add(internals)

    // ---- nameplates -------------------------------------------------------
    const plates = stages.map((_, index) => {
      const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(MODULE_W * 0.92, MODULE_W * 0.92 * 0.25),
        new THREE.MeshBasicMaterial({ map: drawPlate(index, theme), transparent: true })
      )
      plate.position.set(moduleX(index), -MODULE_H / 2 - 0.55, MODULE_D / 2)
      plate.userData.stageId = stages[index].id
      root.add(plate)
      return plate
    })

    // hit targets
    const clickable = stages.map((stage, index) => {
      const hit = new THREE.Mesh(
        new THREE.BoxGeometry(MODULE_W + 0.6, MODULE_H + 1.6, MODULE_D + 0.6),
        new THREE.MeshBasicMaterial({ visible: false })
      )
      hit.position.set(moduleX(index), -0.2, 0)
      hit.userData.stageId = stage.id
      root.add(hit)
      return hit
    })

    // ---- shutters (breaker) ----------------------------------------------
    const shutters = stages.map((_, index) => {
      const shutter = new THREE.Mesh(
        new THREE.BoxGeometry(MODULE_W * 0.96, MODULE_H * 0.9, 0.12),
        new THREE.MeshStandardMaterial({
          color: palette.fault,
          roughness: 0.5,
          transparent: true,
          opacity: 0.9
        })
      )
      shutter.position.set(moduleX(index), MODULE_H, MODULE_D / 2 - 0.2)
      shutter.scale.y = 0.001
      root.add(shutter)
      return shutter
    })

    // ---- rails ------------------------------------------------------------
    const railMaterial = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0x27332f : 0x6f7a74,
      roughness: 0.6,
      metalness: 0.6
    })
    const rail = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, EXIT_X - ENTRY_X, 10),
      railMaterial
    )
    rail.rotation.z = Math.PI / 2
    rail.position.set((ENTRY_X + EXIT_X) / 2, 0, 0)
    root.add(rail)

    const bypass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, EXIT_X - ENTRY_X, 8),
      new THREE.MeshStandardMaterial({
        color: theme === 'dark' ? 0x1d2a28 : 0x7d867f,
        roughness: 0.7
      })
    )
    bypass.rotation.z = Math.PI / 2
    bypass.position.set((ENTRY_X + EXIT_X) / 2, -1.75, 0)
    root.add(bypass)

    // ---- packet + trail ---------------------------------------------------
    const packetMaterial = new THREE.MeshBasicMaterial({ color: palette.signal })
    const packet = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), packetMaterial)
    root.add(packet)
    const TRAIL = 26
    const trail = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.16, 0.16, 0.16),
      new THREE.MeshBasicMaterial({ color: palette.signal, transparent: true, opacity: 0.55 }),
      TRAIL
    )
    trail.frustumCulled = false
    root.add(trail)
    const history: THREE.Vector3[] = Array.from(
      { length: TRAIL },
      () => new THREE.Vector3(ENTRY_X, 0, 0)
    )

    // ---- interaction ------------------------------------------------------
    const state = {
      azimuth: -0.1,
      polar: 0.16,
      targetAzimuth: -0.1,
      targetPolar: 0.16,
      radius: 30,
      dragging: false
    }
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const target = new THREE.Vector3(0, -0.2, 0)
    let hovered: string | null = null

    const resize = () => {
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      const halfSpan = (EXIT_X - ENTRY_X) / 2 + 0.6
      const fitHeight = Math.max(3.6, halfSpan / camera.aspect)
      state.radius = Math.min(70, fitHeight / Math.tan((camera.fov * Math.PI) / 360) + 2)
      camera.updateProjectionMatrix()
    }

    const pick = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(clickable, false)[0]
      return (hit?.object.userData.stageId as string | undefined) ?? null
    }

    let pointerId: number | null = null
    let downX = 0
    let downY = 0
    let moved = 0

    const handleDown = (event: PointerEvent) => {
      pointerId = event.pointerId
      downX = event.clientX
      downY = event.clientY
      moved = 0
      state.dragging = true
      canvas.setPointerCapture(event.pointerId)
      canvas.style.cursor = 'grabbing'
    }
    const handleMove = (event: PointerEvent) => {
      if (state.dragging && pointerId === event.pointerId) {
        moved = Math.max(moved, Math.hypot(event.clientX - downX, event.clientY - downY))
        state.targetAzimuth = clamp(state.targetAzimuth + event.movementX * 0.004, -0.55, 0.55)
        state.targetPolar = clamp(state.targetPolar - event.movementY * 0.003, -0.15, 0.55)
        return
      }
      const id = pick(event)
      if (id !== hovered) {
        hovered = id
        canvas.style.cursor = id ? 'pointer' : 'grab'
        controls.current.onHover(id)
      }
    }
    const handleUp = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return
      state.dragging = false
      pointerId = null
      canvas.releasePointerCapture?.(event.pointerId)
      if (moved < 6) {
        const id = pick(event)
        if (id) controls.current.onSelect(id)
      }
    }
    const handleKey = (event: KeyboardEvent) => {
      const step = 0.1
      if (event.key === 'ArrowLeft') state.targetAzimuth = clamp(state.targetAzimuth - step, -0.55, 0.55)
      else if (event.key === 'ArrowRight') state.targetAzimuth = clamp(state.targetAzimuth + step, -0.55, 0.55)
      else if (event.key === 'ArrowUp') state.targetPolar = clamp(state.targetPolar + step, -0.15, 0.55)
      else if (event.key === 'ArrowDown') state.targetPolar = clamp(state.targetPolar - step, -0.15, 0.55)
      else return
      event.preventDefault()
    }

    canvas.addEventListener('pointerdown', handleDown)
    canvas.addEventListener('pointermove', handleMove)
    canvas.addEventListener('pointerup', handleUp)
    canvas.addEventListener('pointercancel', handleUp)
    canvas.addEventListener('keydown', handleKey)
    canvas.style.cursor = 'grab'

    // ---- transport state --------------------------------------------------
    let packetX = ENTRY_X
    let packetY = 0
    let phase: 'flow' | 'stalled' | 'bypass' = 'flow'
    let stallTimer = 0
    let lastStage = -1
    let elapsed = 0
    let lastToken = controls.current.stepToken
    let stepping = false
    let stepTarget = 0
    const shutterLevel = stages.map(() => 0)
    const faultLevel = stages.map(() => 0)

    const stageAt = (x: number) => {
      for (let index = 0; index < stages.length; index += 1) {
        if (Math.abs(x - moduleX(index)) <= MODULE_W / 2) return index
      }
      return -1
    }

    const reset = () => {
      packetX = ENTRY_X
      packetY = 0
      phase = 'flow'
      lastStage = -1
      elapsed = 0
      history.forEach((point) => point.set(ENTRY_X, 0, 0))
    }

    const clock = new THREE.Clock()
    let frame = 0
    let inView = true
    let visible = !document.hidden

    const renderFrame = () => {
      const delta = Math.min(clock.getDelta(), 0.05)
      const { running, speed, explode, faults, activeId, stepToken, onEvent } =
        controls.current

      if (stepToken !== lastToken) {
        lastToken = stepToken
        const current = stageAt(packetX)
        const next = current + 1
        stepTarget =
          next >= stages.length ? EXIT_X : moduleX(next) - MODULE_W / 2 + 0.35
        stepping = true
      }

      const moving = running || stepping
      if (moving && phase !== 'stalled') {
        packetX += delta * speed * 3.4
        elapsed += delta * speed * 3.4 * 14
        if (stepping && packetX >= stepTarget) {
          packetX = stepTarget
          stepping = false
        }
      }

      const current = stageAt(packetX)
      if (current !== lastStage && current >= 0) {
        lastStage = current
        onEvent('enter', stages[current].id, elapsed)
        if (faults[stages[current].id]) {
          phase = 'stalled'
          stallTimer = 0
          onEvent('fault', stages[current].id, elapsed)
        }
      }
      if (current < 0 && packetX > moduleX(stages.length - 1)) lastStage = -1

      if (phase === 'stalled') {
        stallTimer += delta * (running ? speed : 1)
        elapsed += delta * speed * 210
        if (stallTimer > 1.1) {
          const index = Math.max(0, stageAt(packetX))
          onEvent('breaker', stages[index].id, elapsed)
          onEvent('bypass', stages[index].id, elapsed + 40)
          phase = 'bypass'
        }
      }

      if (phase === 'bypass') {
        packetX += delta * speed * 3.4
        elapsed += delta * speed * 3.4 * 14
        packetY = damp(packetY, -1.75, 7, delta)
        const index = stageAt(packetX)
        if (index === -1 && packetX > 0) {
          const passed = stages.findIndex((_, i) => packetX > moduleX(i) + MODULE_W / 2)
          if (passed >= 0) {
            phase = 'flow'
            onEvent('rejoin', stages[Math.max(0, passed)].id, elapsed)
          }
        }
      } else {
        packetY = damp(packetY, 0, 7, delta)
      }

      if (packetX > EXIT_X) {
        onEvent('complete', 'feedback', elapsed)
        reset()
      }

      // camera
      state.azimuth = damp(state.azimuth, state.targetAzimuth, 6, delta)
      state.polar = damp(state.polar, state.targetPolar, 6, delta)
      camera.position.set(
        target.x + state.radius * Math.sin(state.azimuth),
        target.y + state.radius * Math.sin(state.polar),
        state.radius * Math.cos(state.azimuth) * Math.cos(state.polar)
      )
      camera.lookAt(target)

      // modules
      const shellColor = new THREE.Color(theme === 'dark' ? 0x131c1e : 0x9c9890)
      const faultColor = new THREE.Color(palette.fault)
      const okColor = new THREE.Color(palette.signal)
      const idleColor = new THREE.Color(theme === 'dark' ? 0x1d2b2b : 0x5c6663)

      stages.forEach((stage, index) => {
        const faulted = Boolean(faults[stage.id])
        faultLevel[index] = damp(faultLevel[index], faulted ? 1 : 0, 6, delta)
        const isActive = stage.id === activeId
        const isHover = stage.id === hovered
        const lift = explode * (index - (stages.length - 1) / 2) * 0.55
        const rise = explode * 1.5 + (isActive ? 0.24 : isHover ? 0.1 : 0)
        const shake =
          phase === 'stalled' && stageAt(packetX) === index
            ? Math.sin(clock.elapsedTime * 40) * 0.04
            : 0
        const cx = moduleX(index) + lift + shake
        const cy = rise
        const cz = explode * 0.9

        const slabs: [number, number, number, number, number, number][] = [
          [cx, cy + MODULE_H / 2, cz, MODULE_W, 0.24, MODULE_D],
          [cx, cy - MODULE_H / 2, cz, MODULE_W, 0.24, MODULE_D],
          [cx, cy, cz - MODULE_D / 2, MODULE_W, MODULE_H, 0.2],
          [cx - MODULE_W / 2, cy, cz, 0.2, MODULE_H, MODULE_D],
          [cx + MODULE_W / 2, cy, cz, 0.2, MODULE_H, MODULE_D]
        ]
        slabs.forEach((slab, slabIndex) => {
          dummy.position.set(slab[0], slab[1], slab[2])
          dummy.scale.set(slab[3], slab[4], slab[5])
          dummy.rotation.set(0, 0, 0)
          dummy.updateMatrix()
          shells.setMatrixAt(index * SLABS + slabIndex, dummy.matrix)
        })

        for (let inner = 0; inner < INNER; inner += 1) {
          const gx = (inner % 4) / 3 - 0.5
          const gy = inner < 4 ? 0.45 : -0.45
          dummy.position.set(
            cx + gx * (MODULE_W - 1.1),
            cy + gy - 0.1,
            cz + (inner % 2 === 0 ? 0.2 : -0.5)
          )
          dummy.scale.setScalar(isActive ? 1.12 : 1)
          dummy.rotation.set(0, 0, 0)
          dummy.updateMatrix()
          internals.setMatrixAt(index * INNER + inner, dummy.matrix)
          const busy = stageAt(packetX) === index && phase !== 'stalled'
          color
            .copy(idleColor)
            .lerp(okColor, busy || isActive ? 0.85 : 0.15)
            .lerp(faultColor, faultLevel[index])
          internals.setColorAt(index * INNER + inner, color)
        }

        const plate = plates[index]
        plate.position.set(cx, cy - MODULE_H / 2 - 0.55, cz + MODULE_D / 2 + 0.02)
        ;(plate.material as THREE.MeshBasicMaterial).color
          .copy(new THREE.Color(0xffffff))
          .lerp(faultColor, faultLevel[index] * 0.75)

        const openBreaker =
          faulted && (phase === 'bypass' || packetX > moduleX(index)) ? 1 : faulted ? 0.15 : 0
        shutterLevel[index] = damp(shutterLevel[index], openBreaker, 8, delta)
        const shutter = shutters[index]
        shutter.scale.y = Math.max(0.001, shutterLevel[index])
        shutter.position.set(
          cx,
          cy + (MODULE_H / 2) * (1 - shutterLevel[index]),
          cz + MODULE_D / 2 - 0.2
        )
        ;(shutter.material as THREE.MeshStandardMaterial).opacity = 0.85 * shutterLevel[index]

        const hit = clickable[index]
        hit.position.set(cx, cy - 0.2, cz)
      })
      shells.instanceMatrix.needsUpdate = true
      internals.instanceMatrix.needsUpdate = true
      if (internals.instanceColor) internals.instanceColor.needsUpdate = true

      // packet + trail
      packet.position.set(packetX, packetY, 0)
      packet.rotation.y += delta * 2.4
      packetMaterial.color.copy(phase === 'flow' ? okColor : faultColor)
      history.pop()
      history.unshift(new THREE.Vector3(packetX, packetY, 0))
      history.forEach((point, index) => {
        dummy.position.copy(point)
        dummy.scale.setScalar(1 - index / TRAIL)
        dummy.rotation.set(0, 0, 0)
        dummy.updateMatrix()
        trail.setMatrixAt(index, dummy.matrix)
      })
      trail.instanceMatrix.needsUpdate = true

      rim.position.set(packetX, 1.5, 4)
      shellMaterial.color.copy(shellColor)

      renderer.render(scene, camera)
    }

    const animate = () => {
      renderFrame()
      frame = window.requestAnimationFrame(animate)
    }
    const sync = () => {
      window.cancelAnimationFrame(frame)
      if (inView && visible) {
        clock.getDelta()
        frame = window.requestAnimationFrame(animate)
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    const intersection = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        sync()
      },
      { threshold: 0.02 }
    )
    intersection.observe(host)
    const handleVisibility = () => {
      visible = !document.hidden
      sync()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    resize()
    sync()

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      canvas.removeEventListener('pointerdown', handleDown)
      canvas.removeEventListener('pointermove', handleMove)
      canvas.removeEventListener('pointerup', handleUp)
      canvas.removeEventListener('pointercancel', handleUp)
      canvas.removeEventListener('keydown', handleKey)
      disposeObject(scene)
      renderer.dispose()
    }
  }, [theme])

  return (
    <div ref={hostRef} className={styles.host}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        tabIndex={0}
        role="application"
        aria-label="Cutaway of a request path through five stages. Drag to tilt, arrow keys to rotate, click a module to read it. Transport and fault controls are available as buttons, and the same information is written out below."
      />
    </div>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
