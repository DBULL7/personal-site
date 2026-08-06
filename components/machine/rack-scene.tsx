'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  RACK_HEIGHT,
  RACK_WIDTH,
  UNIT_PITCH,
  patches,
  rackUnits,
  unitCenterY,
  type RackUnit
} from '@/app/career/career-data'
import {
  damp,
  disposeObject,
  machinePalettes,
  makeCanvasTexture,
  monoFont,
  type MachineTheme
} from './machine-core'
import styles from './rack-scene.module.css'

type RackSceneProps = {
  theme: MachineTheme
  activeId: string
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

const FACE_W = 1024
const FACE_H = 150
const SEGMENTS = 20
const UNIT_W = 10.9
const UNIT_H = UNIT_PITCH - 0.12
const METER_X0 = 0.9
const METER_X1 = 3.5

function drawFace(unit: RackUnit, theme: MachineTheme) {
  const palette = machinePalettes[theme]
  const metal = theme === 'dark' ? '#161d1f' : '#c9c6bd'
  const metalHi = theme === 'dark' ? '#222c2e' : '#e7e4da'
  const ink =
    theme === 'dark' ? 'rgba(226, 240, 235, 0.94)' : 'rgba(24, 32, 30, 0.92)'
  const inkFaint =
    theme === 'dark' ? 'rgba(226, 240, 235, 0.45)' : 'rgba(24, 32, 30, 0.5)'
  return makeCanvasTexture(FACE_W, FACE_H, (ctx) => {
    const base = ctx.createLinearGradient(0, 0, 0, FACE_H)
    base.addColorStop(0, metalHi)
    base.addColorStop(0.5, metal)
    base.addColorStop(1, theme === 'dark' ? '#10171a' : '#b8b5ac')
    ctx.fillStyle = base
    ctx.fillRect(0, 0, FACE_W, FACE_H)

    // brushed metal
    ctx.strokeStyle =
      theme === 'dark'
        ? 'rgba(255, 255, 255, 0.035)'
        : 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 1
    for (let y = 0; y < FACE_H; y += 3) {
      ctx.beginPath()
      ctx.moveTo(0, y + 0.5)
      ctx.lineTo(FACE_W, y + 0.5)
      ctx.stroke()
    }

    // rack ears + screws
    ctx.fillStyle =
      theme === 'dark' ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.14)'
    ctx.fillRect(0, 0, 54, FACE_H)
    ctx.fillRect(FACE_W - 54, 0, 54, FACE_H)
    ;[
      [27, 36],
      [27, FACE_H - 36],
      [FACE_W - 27, 36],
      [FACE_W - 27, FACE_H - 36]
    ].forEach(([cx, cy]) => {
      ctx.beginPath()
      ctx.arc(cx, cy, 11, 0, Math.PI * 2)
      ctx.fillStyle = theme === 'dark' ? '#0a1113' : '#8f8d85'
      ctx.fill()
      ctx.strokeStyle = inkFaint
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx - 6, cy - 6)
      ctx.lineTo(cx + 6, cy + 6)
      ctx.strokeStyle = ink
      ctx.lineWidth = 2.5
      ctx.stroke()
    })

    // slot number
    ctx.fillStyle = palette.signalCss
    ctx.font = monoFont(46, 700)
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    ctx.fillText(unit.slot, 74, FACE_H / 2)

    // engraved label
    ctx.fillStyle = ink
    ctx.font = monoFont(30, 700)
    ctx.fillText(unit.face[0], 148, FACE_H / 2 - 16)
    ctx.fillStyle = inkFaint
    ctx.font = monoFont(19, 600)
    ctx.fillText(
      `${unit.face[1]}  ·  ${unit.window.toUpperCase()}`,
      148,
      FACE_H / 2 + 20
    )

    // meter window
    const x0 = ((METER_X0 + UNIT_W / 2) / UNIT_W) * FACE_W
    const x1 = ((METER_X1 + UNIT_W / 2) / UNIT_W) * FACE_W
    ctx.fillStyle = theme === 'dark' ? '#05100e' : '#0a1614'
    ctx.fillRect(x0 - 10, 34, x1 - x0 + 20, FACE_H - 68)
    ctx.strokeStyle = inkFaint
    ctx.lineWidth = 2
    ctx.strokeRect(x0 - 10, 34, x1 - x0 + 20, FACE_H - 68)
    ctx.fillStyle = inkFaint
    ctx.font = monoFont(15, 600)
    ctx.textAlign = 'left'
    ctx.fillText(unit.meter.label.toUpperCase(), x0 - 10, 20)

    // ventilation slots
    ctx.fillStyle =
      theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)'
    for (let index = 0; index < 6; index += 1) {
      ctx.fillRect(x1 + 42 + index * 12, 46, 5, FACE_H - 92)
    }
  })
}

function radialTexture(color: string) {
  return makeCanvasTexture(128, 128, (ctx) => {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.3, color)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)
  })
}

export function RackScene({
  theme,
  activeId,
  onSelect,
  onHover
}: RackSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(activeId)
  const selectRef = useRef(onSelect)
  const hoverRef = useRef(onHover)

  useEffect(() => {
    selectRef.current = onSelect
    hoverRef.current = onHover
  }, [onSelect, onHover])

  useEffect(() => {
    activeRef.current = activeId
  }, [activeId])

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
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(palette.clear)
    const camera = new THREE.PerspectiveCamera(36, 1, 0.5, 120)

    scene.add(
      new THREE.HemisphereLight(
        theme === 'dark' ? 0x8fd8cc : 0xffffff,
        theme === 'dark' ? 0x0a1416 : 0xa9a196,
        theme === 'dark' ? 0.75 : 1.4
      )
    )
    const key = new THREE.DirectionalLight(0xffffff, theme === 'dark' ? 2 : 2.6)
    key.position.set(5, 8, 12)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    const shadowCamera = key.shadow.camera as THREE.OrthographicCamera
    shadowCamera.left = -9
    shadowCamera.right = 9
    shadowCamera.top = 7
    shadowCamera.bottom = -7
    shadowCamera.near = 1
    shadowCamera.far = 40
    scene.add(key)
    const rim = new THREE.PointLight(
      palette.signal,
      theme === 'dark' ? 34 : 12,
      30,
      2
    )
    rim.position.set(-6, 2, 5)
    scene.add(rim)

    const root = new THREE.Group()
    scene.add(root)

    // ---- rack frame -------------------------------------------------------
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0x0d1416 : 0x76736c,
      roughness: 0.55,
      metalness: 0.65
    })
    const railGeometry = new THREE.BoxGeometry(0.55, RACK_HEIGHT + 1.1, 1.6)
    ;[-1, 1].forEach((side) => {
      const rail = new THREE.Mesh(railGeometry, frameMaterial)
      rail.position.set((side * RACK_WIDTH) / 2 - side * 0.28, 0, -0.35)
      rail.castShadow = true
      rail.receiveShadow = true
      root.add(rail)
    })
    const capGeometry = new THREE.BoxGeometry(RACK_WIDTH, 0.5, 1.6)
    ;[-1, 1].forEach((side) => {
      const cap = new THREE.Mesh(capGeometry, frameMaterial)
      cap.position.set(0, (side * (RACK_HEIGHT + 1.1)) / 2 - side * 0.25, -0.35)
      cap.castShadow = true
      root.add(cap)
    })
    const backPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(RACK_WIDTH, RACK_HEIGHT + 1.1),
      new THREE.MeshStandardMaterial({
        color: theme === 'dark' ? 0x05090a : 0x4c4a45,
        roughness: 0.95
      })
    )
    backPlane.position.z = -1.1
    backPlane.receiveShadow = true
    root.add(backPlane)

    // ---- mounting holes (instanced) --------------------------------------
    const holeGeometry = new THREE.CylinderGeometry(0.055, 0.055, 0.12, 8)
    const holeMaterial = new THREE.MeshStandardMaterial({
      color: 0x05090a,
      roughness: 0.9
    })
    const holeCount = 2 * 3 * rackUnits.length
    const holes = new THREE.InstancedMesh(holeGeometry, holeMaterial, holeCount)
    const dummy = new THREE.Object3D()
    let holeIndex = 0
    rackUnits.forEach((_, index) => {
      const cy = unitCenterY(index)
      ;[-1, 1].forEach((side) => {
        ;[-0.3, 0, 0.3].forEach((offset) => {
          dummy.position.set(
            (side * RACK_WIDTH) / 2 - side * 0.28,
            cy + offset * UNIT_PITCH,
            0.46
          )
          dummy.rotation.set(Math.PI / 2, 0, 0)
          dummy.updateMatrix()
          holes.setMatrixAt(holeIndex, dummy.matrix)
          holeIndex += 1
        })
      })
    })
    holes.instanceMatrix.needsUpdate = true
    root.add(holes)

    // ---- units ------------------------------------------------------------
    type UnitRig = {
      unit: RackUnit
      index: number
      group: THREE.Group
      out: number
      level: number
      ledMaterial: THREE.MeshStandardMaterial
      jack: THREE.Vector3
    }

    const rigs: UnitRig[] = []
    const clickable: THREE.Object3D[] = []
    const unitGeometry = new THREE.BoxGeometry(UNIT_W, UNIT_H, 0.62)
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0x0f1618 : 0x8e8b83,
      roughness: 0.6,
      metalness: 0.5
    })
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: palette.gold,
      roughness: 0.25,
      metalness: 0.95
    })
    const jackGeometry = new THREE.CylinderGeometry(0.13, 0.15, 0.16, 14)
    const jackHoleGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 10)
    const ledGeometry = new THREE.CylinderGeometry(0.055, 0.055, 0.1, 10)
    const knobGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.22, 18)

    rackUnits.forEach((unit, index) => {
      const group = new THREE.Group()
      group.position.set(0, unitCenterY(index), 0)
      root.add(group)

      const faceMaterial = new THREE.MeshStandardMaterial({
        map: drawFace(unit, theme),
        roughness: 0.45,
        metalness: 0.55
      })
      const body = new THREE.Mesh(unitGeometry, [
        sideMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial,
        faceMaterial,
        sideMaterial
      ])
      body.castShadow = true
      body.receiveShadow = true
      body.userData.unitId = unit.id
      group.add(body)
      clickable.push(body)

      // status LED
      const ledMaterial = new THREE.MeshStandardMaterial({
        color: palette.signal,
        emissive: new THREE.Color(palette.signal),
        emissiveIntensity: 0.2,
        roughness: 0.3
      })
      const led = new THREE.Mesh(ledGeometry, ledMaterial)
      led.rotation.x = Math.PI / 2
      led.position.set(-UNIT_W / 2 + 0.42, UNIT_H / 2 - 0.2, 0.34)
      group.add(led)

      // patch jack + knob
      const jack = new THREE.Mesh(jackGeometry, goldMaterial)
      jack.rotation.x = Math.PI / 2
      jack.position.set(UNIT_W / 2 - 0.55, 0, 0.36)
      group.add(jack)
      const jackHole = new THREE.Mesh(
        jackHoleGeometry,
        new THREE.MeshStandardMaterial({ color: 0x04090a, roughness: 1 })
      )
      jackHole.rotation.x = Math.PI / 2
      jackHole.position.set(UNIT_W / 2 - 0.55, 0, 0.42)
      group.add(jackHole)

      const knob = new THREE.Mesh(
        knobGeometry,
        new THREE.MeshStandardMaterial({
          color: theme === 'dark' ? 0x1b2325 : 0x3a3f3d,
          roughness: 0.45,
          metalness: 0.4
        })
      )
      knob.rotation.x = Math.PI / 2
      knob.position.set(UNIT_W / 2 - 1.25, 0, 0.36)
      knob.rotation.y = index * 0.7
      group.add(knob)

      rigs.push({
        unit,
        index,
        group,
        out: 0,
        level: 0,
        ledMaterial,
        jack: new THREE.Vector3(UNIT_W / 2 - 0.55, unitCenterY(index), 0.45)
      })
    })

    // ---- meters (one instanced mesh for every segment) --------------------
    const segmentGeometry = new THREE.BoxGeometry(
      ((METER_X1 - METER_X0) / SEGMENTS) * 0.72,
      UNIT_H * 0.42,
      0.08
    )
    const segmentMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.4,
      emissiveIntensity: 1
    })
    const segments = new THREE.InstancedMesh(
      segmentGeometry,
      segmentMaterial,
      rackUnits.length * SEGMENTS
    )
    segments.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(rackUnits.length * SEGMENTS * 3),
      3
    )
    rackUnits.forEach((_, unitIndex) => {
      for (let seg = 0; seg < SEGMENTS; seg += 1) {
        const x = METER_X0 + ((seg + 0.5) / SEGMENTS) * (METER_X1 - METER_X0)
        dummy.position.set(x, unitCenterY(unitIndex), 0.36)
        dummy.rotation.set(0, 0, 0)
        dummy.updateMatrix()
        segments.setMatrixAt(unitIndex * SEGMENTS + seg, dummy.matrix)
      }
    })
    segments.instanceMatrix.needsUpdate = true
    root.add(segments)

    const dimColor = new THREE.Color(theme === 'dark' ? 0x123028 : 0x14352c)
    const litColor = new THREE.Color(palette.signal)
    const hotColor = new THREE.Color(palette.warn)

    // ---- patch cables -----------------------------------------------------
    type CableRig = {
      from: string
      to: string
      curve: THREE.CatmullRomCurve3
      material: THREE.MeshStandardMaterial
    }
    const cables: CableRig[] = patches.map((patch) => {
      const a = new THREE.Vector3(
        UNIT_W / 2 - 0.55,
        unitCenterY(patch.fromIndex),
        0.62
      )
      const b = new THREE.Vector3(
        UNIT_W / 2 - 0.55,
        unitCenterY(patch.toIndex),
        0.62
      )
      const span = Math.abs(patch.toIndex - patch.fromIndex)
      const bow = 0.9 + span * 0.55
      const curve = new THREE.CatmullRomCurve3([
        a,
        new THREE.Vector3(a.x + bow * 0.55, a.y - 0.25, a.z + bow),
        new THREE.Vector3(
          a.x + bow * 0.7,
          (a.y + b.y) / 2 - 0.35 * span,
          a.z + bow * 1.15
        ),
        new THREE.Vector3(b.x + bow * 0.55, b.y + 0.25, b.z + bow),
        b
      ])
      const material = new THREE.MeshStandardMaterial({
        color: theme === 'dark' ? 0x24302f : 0x3d4744,
        roughness: 0.65
      })
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 48, 0.055, 8, false),
        material
      )
      tube.castShadow = true
      root.add(tube)
      return { from: patch.from, to: patch.to, curve, material }
    })

    // ---- traffic dots (instanced) -----------------------------------------
    const DOTS = 72
    const dotMesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.085, 8, 8),
      new THREE.MeshBasicMaterial({ color: palette.signal }),
      DOTS
    )
    dotMesh.frustumCulled = false
    root.add(dotMesh)

    const glowTexture = radialTexture(palette.copperLit)
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0
      })
    )
    glow.scale.setScalar(3)
    root.add(glow)

    // ---- interaction ------------------------------------------------------
    const state = {
      azimuth: -0.12,
      polar: 0.05,
      targetAzimuth: -0.12,
      targetPolar: 0.05,
      radius: 20,
      dragging: false,
      idle: 0
    }
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const target = new THREE.Vector3(0, 0, 0)
    let hovered: string | null = null
    let selectionAge = 99
    let lastActive = activeRef.current

    const resize = () => {
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      const fitHeight = Math.max(
        (RACK_HEIGHT / 2) * 1.16,
        ((RACK_WIDTH / 2) * 1.06) / camera.aspect
      )
      state.radius = Math.min(
        40,
        fitHeight / Math.tan((camera.fov * Math.PI) / 360) + 1.2
      )
      camera.updateProjectionMatrix()
    }

    const setHover = (id: string | null) => {
      if (hovered === id) return
      hovered = id
      canvas.style.cursor = id ? 'pointer' : 'grab'
      hoverRef.current(id)
    }

    const pick = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(clickable, false)[0]
      return (hit?.object.userData.unitId as string | undefined) ?? null
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
      state.idle = 0
      canvas.setPointerCapture(event.pointerId)
      canvas.style.cursor = 'grabbing'
    }

    const handleMove = (event: PointerEvent) => {
      if (state.dragging && pointerId === event.pointerId) {
        moved = Math.max(
          moved,
          Math.hypot(event.clientX - downX, event.clientY - downY)
        )
        state.targetAzimuth = clamp(
          state.targetAzimuth + event.movementX * 0.004,
          -0.6,
          0.6
        )
        state.targetPolar = clamp(
          state.targetPolar - event.movementY * 0.003,
          -0.35,
          0.45
        )
        return
      }
      setHover(pick(event))
      state.idle = 0
    }

    const handleUp = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return
      state.dragging = false
      pointerId = null
      canvas.releasePointerCapture?.(event.pointerId)
      canvas.style.cursor = hovered ? 'pointer' : 'grab'
      if (moved < 6) {
        const id = pick(event)
        if (id) {
          selectRef.current(id)
          selectionAge = 0
        }
      }
    }

    const handleKey = (event: KeyboardEvent) => {
      const step = 0.1
      if (event.key === 'ArrowLeft')
        state.targetAzimuth = clamp(state.targetAzimuth - step, -0.6, 0.6)
      else if (event.key === 'ArrowRight')
        state.targetAzimuth = clamp(state.targetAzimuth + step, -0.6, 0.6)
      else if (event.key === 'ArrowUp')
        state.targetPolar = clamp(state.targetPolar + step, -0.35, 0.45)
      else if (event.key === 'ArrowDown')
        state.targetPolar = clamp(state.targetPolar - step, -0.35, 0.45)
      else return
      event.preventDefault()
      state.idle = 0
    }

    canvas.addEventListener('pointerdown', handleDown)
    canvas.addEventListener('pointermove', handleMove)
    canvas.addEventListener('pointerup', handleUp)
    canvas.addEventListener('pointercancel', handleUp)
    canvas.addEventListener('pointerleave', () => setHover(null))
    canvas.addEventListener('keydown', handleKey)
    canvas.style.cursor = 'grab'

    const clock = new THREE.Clock()
    let frame = 0
    let inView = true
    let visible = !document.hidden
    const color = new THREE.Color()

    const renderFrame = () => {
      const delta = Math.min(clock.getDelta(), 0.05)
      const elapsed = clock.elapsedTime
      if (activeRef.current !== lastActive) {
        lastActive = activeRef.current
        selectionAge = 0
      }
      selectionAge += delta
      state.idle += delta

      if (!state.dragging && state.idle > 7) {
        state.targetAzimuth = clamp(
          -0.12 + Math.sin(elapsed * 0.1) * 0.16,
          -0.6,
          0.6
        )
      }
      state.azimuth = damp(state.azimuth, state.targetAzimuth, 6, delta)
      state.polar = damp(state.polar, state.targetPolar, 6, delta)
      camera.position.set(
        state.radius * Math.sin(state.azimuth),
        state.radius * Math.sin(state.polar),
        state.radius * Math.cos(state.azimuth) * Math.cos(state.polar)
      )
      camera.lookAt(target)

      const activeId2 = activeRef.current
      let activeRig: UnitRig | null = null

      rigs.forEach((rig, index) => {
        const isActive = rig.unit.id === activeId2
        const isHover = rig.unit.id === hovered
        rig.out = damp(rig.out, isActive ? 0.95 : isHover ? 0.28 : 0, 9, delta)
        rig.group.position.z = rig.out
        rig.group.rotation.x = damp(
          rig.group.rotation.x,
          isActive ? -0.06 : 0,
          8,
          delta
        )

        const goal = isActive ? 1 : 0.16
        rig.level = damp(rig.level, goal, isActive ? 2.4 : 6, delta)
        rig.ledMaterial.emissiveIntensity = isActive
          ? 1.6 + Math.sin(elapsed * 5) * 0.4
          : isHover
            ? 0.9
            : 0.18

        const meter = rig.unit.meter
        const span = meter.to - meter.from
        const shown = isActive
          ? meter.from + span * easeOut(Math.min(1, selectionAge / 1.4))
          : meter.from
        const ratio =
          meter.to === 0
            ? 0
            : Math.min(1, Math.max(0, shown / Math.max(meter.to, 0.0001)))
        const litCount = Math.round(ratio * SEGMENTS * (isActive ? 1 : 0.18))
        for (let seg = 0; seg < SEGMENTS; seg += 1) {
          const lit = seg < litCount
          const hot = seg > SEGMENTS * 0.78
          color.copy(lit ? (hot ? hotColor : litColor) : dimColor)
          if (lit && isActive)
            color.multiplyScalar(1 + Math.sin(elapsed * 6 - seg) * 0.08)
          segments.setColorAt(index * SEGMENTS + seg, color)
          dummy.position.set(
            METER_X0 + ((seg + 0.5) / SEGMENTS) * (METER_X1 - METER_X0),
            unitCenterY(index) + rig.out * 0.06,
            0.36 + rig.out
          )
          dummy.rotation.set(0, 0, 0)
          dummy.scale.setScalar(1)
          dummy.updateMatrix()
          segments.setMatrixAt(index * SEGMENTS + seg, dummy.matrix)
        }
        if (isActive) activeRig = rig
      })
      if (segments.instanceColor) segments.instanceColor.needsUpdate = true
      segments.instanceMatrix.needsUpdate = true

      // cables: light the ones touching the active unit
      cables.forEach((cable) => {
        const live = cable.from === activeId2 || cable.to === activeId2
        cable.material.color.lerp(
          live
            ? litColor
            : new THREE.Color(theme === 'dark' ? 0x24302f : 0x3d4744),
          0.14
        )
      })

      const liveCables = cables.filter(
        (cable) => cable.from === activeId2 || cable.to === activeId2
      )
      let dotIndex = 0
      if (liveCables.length) {
        const perCable = Math.floor(DOTS / liveCables.length)
        liveCables.forEach((cable, cableIndex) => {
          const forward = cable.from === activeId2
          for (let i = 0; i < perCable; i += 1) {
            const phase =
              (elapsed * 0.42 + i / perCable + cableIndex * 0.17) % 1
            const t = forward ? phase : 1 - phase
            const point = cable.curve.getPoint(t)
            dummy.position.copy(point)
            dummy.rotation.set(0, 0, 0)
            dummy.scale.setScalar(0.6 + Math.sin(phase * Math.PI) * 0.8)
            dummy.updateMatrix()
            dotMesh.setMatrixAt(dotIndex, dummy.matrix)
            dotIndex += 1
          }
        })
      }
      for (let i = dotIndex; i < DOTS; i += 1) {
        dummy.position.set(0, 0, -60)
        dummy.scale.setScalar(0.001)
        dummy.updateMatrix()
        dotMesh.setMatrixAt(i, dummy.matrix)
      }
      dotMesh.instanceMatrix.needsUpdate = true

      if (activeRig) {
        const rig = activeRig as UnitRig
        glow.position.set(
          -UNIT_W / 2 + 0.42,
          unitCenterY(rig.index),
          rig.out + 0.5
        )
        const strength = Math.max(0, 1 - selectionAge * 1.6)
        ;(glow.material as THREE.SpriteMaterial).opacity =
          0.15 + strength * 0.55
        glow.scale.setScalar(2 + strength * 2)
      }

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
        aria-label="Interactive equipment rack. Drag to tilt, arrow keys to rotate, click a rack unit to pull it out and read it. The same information is listed in the slot buttons and the plain-text log below."
      />
    </div>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3)
}
