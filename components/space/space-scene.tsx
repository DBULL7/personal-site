'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import styles from './space-scene.module.css'

export type SpaceSceneMode = 'orbital' | 'career' | 'systems'

type SpaceSceneProps = {
  mode: SpaceSceneMode
  className?: string
  onNodeSelect?: (id: string) => void
}

type SceneRig = {
  update: (elapsed: number, delta: number, pointer: THREE.Vector2) => void
  clickable: THREE.Object3D[]
}

const palette = {
  ink: 0x03070a,
  ice: 0xbfe8df,
  cyan: 0x63c9c0,
  blue: 0x4d86ad,
  amber: 0xe2ae66,
  coral: 0xc9795e,
  metal: 0x273337
}

function createStarField(count: number, radius: number, seed = 7) {
  let value = seed
  const random = () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const warm = new THREE.Color(0xffdfb6)
  const cool = new THREE.Color(0x9fd8df)
  const white = new THREE.Color(0xffffff)

  for (let index = 0; index < count; index += 1) {
    const distance = radius * (0.36 + random() * 0.64)
    const theta = random() * Math.PI * 2
    const phi = Math.acos(2 * random() - 1)
    const offset = index * 3
    positions[offset] = distance * Math.sin(phi) * Math.cos(theta)
    positions[offset + 1] = distance * Math.sin(phi) * Math.sin(theta)
    positions[offset + 2] = distance * Math.cos(phi)
    const color = random() > 0.82 ? warm : random() > 0.7 ? cool : white
    colors[offset] = color.r
    colors[offset + 1] = color.g
    colors[offset + 2] = color.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const material = new THREE.PointsMaterial({
    size: 0.055,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.88,
    vertexColors: true,
    depthWrite: false
  })

  return new THREE.Points(geometry, material)
}

function createGlow(color: number, opacity = 0.28) {
  const material = new THREE.SpriteMaterial({
    map: makeRadialTexture(color),
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  return new THREE.Sprite(material)
}

function makeRadialTexture(color: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')
  if (!context) return null
  const fill = `#${new THREE.Color(color).getHexString()}`
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, fill)
  gradient.addColorStop(0.16, fill)
  gradient.addColorStop(0.45, `${fill}55`)
  gradient.addColorStop(1, `${fill}00`)
  context.fillStyle = gradient
  context.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function makeLabel(text: string, accent = '#bfe8df') {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 96
  const context = canvas.getContext('2d')
  if (!context) return new THREE.Sprite()
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.font = '600 26px ui-monospace, SFMono-Regular, Menlo, monospace'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = 'rgba(3, 8, 10, .76)'
  context.fillRect(4, 8, 504, 80)
  context.strokeStyle = 'rgba(191, 232, 223, .28)'
  context.strokeRect(4.5, 8.5, 503, 79)
  context.fillStyle = accent
  context.fillText(text.toUpperCase(), 256, 49)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
  )
  sprite.scale.set(2.5, 0.47, 1)
  return sprite
}

function createOrbitLine(radius: number, color = palette.cyan, opacity = 0.16) {
  const points: THREE.Vector3[] = []
  for (let index = 0; index <= 128; index += 1) {
    const angle = (index / 128) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false })
  )
}

function buildOrbital(scene: THREE.Scene, camera: THREE.PerspectiveCamera): SceneRig {
  scene.add(createStarField(4200, 78, 11))

  const ambient = new THREE.HemisphereLight(0x8fced4, 0x091012, 1.35)
  scene.add(ambient)
  const sunLight = new THREE.DirectionalLight(0xffd5a3, 4.8)
  sunLight.position.set(12, 8, 9)
  scene.add(sunLight)

  const sun = new THREE.Group()
  const sunCore = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffd29a })
  )
  sun.add(sunCore)
  const sunGlow = createGlow(0xffb960, 0.62)
  sunGlow.scale.setScalar(8)
  sun.add(sunGlow)
  sun.position.set(12.5, 6.8, -20)
  scene.add(sun)

  const planet = new THREE.Group()
  const planetBody = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 48, 48),
    new THREE.MeshStandardMaterial({
      color: 0x183a4e,
      roughness: 0.87,
      metalness: 0.02,
      emissive: 0x07131b,
      emissiveIntensity: 0.8
    })
  )
  planetBody.scale.set(1, 0.97, 1)
  planet.add(planetBody)
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(2.32, 48, 48),
    new THREE.MeshBasicMaterial({
      color: 0x68b2cd,
      transparent: true,
      opacity: 0.11,
      side: THREE.BackSide
    })
  )
  planet.add(atmosphere)
  planet.position.set(-11, -4.4, -19)
  scene.add(planet)

  const orbital = new THREE.Group()
  orbital.rotation.set(0.96, -0.16, -0.22)
  orbital.position.set(0.7, -0.3, -1.2)
  scene.add(orbital)

  const plateCount = 112
  const radius = 5.2
  const arc = (Math.PI * 2 * radius) / plateCount
  const plateGeometry = new THREE.BoxGeometry(arc * 0.91, 0.18, 1.42)
  const plateMaterial = new THREE.MeshStandardMaterial({
    color: palette.metal,
    roughness: 0.62,
    metalness: 0.78
  })
  const plates = new THREE.InstancedMesh(plateGeometry, plateMaterial, plateCount)
  const landGeometry = new THREE.BoxGeometry(arc * 0.86, 0.035, 1.24)
  const landMaterial = new THREE.MeshStandardMaterial({
    color: 0x315c4d,
    emissive: 0x163b33,
    emissiveIntensity: 0.48,
    roughness: 0.9
  })
  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x285c71,
    emissive: 0x183f52,
    emissiveIntensity: 0.42,
    roughness: 0.58
  })
  const land = new THREE.InstancedMesh(landGeometry, landMaterial, plateCount)
  const water = new THREE.InstancedMesh(landGeometry, waterMaterial, plateCount)
  const edgeGeometry = new THREE.BoxGeometry(arc * 0.9, 0.2, 0.055)
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x72918d,
    emissive: 0x315f5a,
    emissiveIntensity: 0.55,
    roughness: 0.42,
    metalness: 0.65
  })
  const edges = new THREE.InstancedMesh(edgeGeometry, edgeMaterial, plateCount * 2)

  const matrix = new THREE.Matrix4()
  const position = new THREE.Vector3()
  const quaternion = new THREE.Quaternion()
  const scale = new THREE.Vector3(1, 1, 1)
  const rotation = new THREE.Euler()

  for (let index = 0; index < plateCount; index += 1) {
    const angle = (index / plateCount) * Math.PI * 2
    rotation.set(0, 0, angle + Math.PI / 2)
    quaternion.setFromEuler(rotation)
    position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
    matrix.compose(position, quaternion, scale)
    plates.setMatrixAt(index, matrix)

    position.set(Math.cos(angle) * (radius - 0.11), Math.sin(angle) * (radius - 0.11), 0)
    matrix.compose(position, quaternion, index % 7 === 0 ? new THREE.Vector3(1, 0.6, 1) : scale)
    land.setMatrixAt(index, matrix)
    water.setMatrixAt(index, matrix)

    for (let edge = 0; edge < 2; edge += 1) {
      position.set(
        Math.cos(angle) * (radius - 0.13),
        Math.sin(angle) * (radius - 0.13),
        edge === 0 ? -0.69 : 0.69
      )
      matrix.compose(position, quaternion, scale)
      edges.setMatrixAt(index * 2 + edge, matrix)
    }
  }

  land.count = Math.ceil(plateCount / 2)
  water.count = Math.floor(plateCount / 2)
  let landIndex = 0
  let waterIndex = 0
  for (let index = 0; index < plateCount; index += 1) {
    const angle = (index / plateCount) * Math.PI * 2
    rotation.set(0, 0, angle + Math.PI / 2)
    quaternion.setFromEuler(rotation)
    position.set(Math.cos(angle) * (radius - 0.11), Math.sin(angle) * (radius - 0.11), 0)
    matrix.compose(position, quaternion, scale)
    if ((index + Math.floor(index / 9)) % 3 === 0) {
      water.setMatrixAt(waterIndex, matrix)
      waterIndex += 1
    } else {
      land.setMatrixAt(landIndex, matrix)
      landIndex += 1
    }
  }
  land.count = landIndex
  water.count = waterIndex
  orbital.add(plates, land, water, edges)

  const runningLights = new THREE.Group()
  const beaconGeometry = new THREE.SphereGeometry(0.035, 8, 8)
  const beaconMaterial = new THREE.MeshBasicMaterial({ color: palette.ice })
  for (let index = 0; index < 38; index += 1) {
    const angle = (index / 38) * Math.PI * 2
    const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial)
    beacon.position.set(Math.cos(angle) * 5.08, Math.sin(angle) * 5.08, index % 2 ? -0.73 : 0.73)
    runningLights.add(beacon)
  }
  orbital.add(runningLights)

  const hub = new THREE.Group()
  const hubCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.52, 2),
    new THREE.MeshStandardMaterial({
      color: 0x7fa8a3,
      metalness: 0.85,
      roughness: 0.28,
      emissive: 0x1b5551,
      emissiveIntensity: 0.9
    })
  )
  hub.add(hubCore)
  ;[0.78, 1.03].forEach((ringRadius, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(ringRadius, 0.018, 6, 96),
      new THREE.MeshBasicMaterial({
        color: index ? palette.blue : palette.cyan,
        transparent: true,
        opacity: 0.56
      })
    )
    ring.rotation.set(index ? 0.9 : 0.2, index ? 0.2 : 0.85, 0)
    hub.add(ring)
  })
  const hubGlow = createGlow(palette.cyan, 0.32)
  hubGlow.scale.setScalar(2.8)
  hub.add(hubGlow)
  orbital.add(hub)

  const shipGeometry = new THREE.ConeGeometry(0.055, 0.24, 5)
  shipGeometry.rotateX(Math.PI / 2)
  const ships: Array<{
    object: THREE.Group
    curve: THREE.CatmullRomCurve3
    reverse: boolean
    offset: number
    speed: number
  }> = []

  const pathData = [
    { port: new THREE.Vector3(3.7, 2.8, 0.5), far: new THREE.Vector3(15, 7, 7), reverse: false },
    { port: new THREE.Vector3(-4.3, 2.1, -0.4), far: new THREE.Vector3(-15, 5, 4), reverse: true },
    { port: new THREE.Vector3(1.2, -4.8, 0.6), far: new THREE.Vector3(8, -11, 9), reverse: false },
    { port: new THREE.Vector3(-2.7, -4.0, -0.5), far: new THREE.Vector3(-13, -8, 7), reverse: true },
    { port: new THREE.Vector3(4.8, -1.3, 0.1), far: new THREE.Vector3(17, -1, 3), reverse: true },
    { port: new THREE.Vector3(-0.8, 4.9, -0.2), far: new THREE.Vector3(-2, 14, 8), reverse: false }
  ]

  pathData.forEach((path, index) => {
    const object = new THREE.Group()
    const ship = new THREE.Mesh(
      shipGeometry,
      new THREE.MeshBasicMaterial({ color: index % 2 ? 0xe4f4ef : 0xf1bd76 })
    )
    object.add(ship)
    const engine = createGlow(index % 2 ? palette.cyan : palette.amber, 0.6)
    engine.scale.setScalar(0.28)
    engine.position.z = 0.13
    object.add(engine)
    object.scale.setScalar(index % 3 === 0 ? 1.35 : 0.9)
    scene.add(object)
    const middle = path.port.clone().lerp(path.far, 0.54)
    middle.y += index % 2 ? 2.6 : -2.2
    middle.z += 2.5
    const curve = new THREE.CatmullRomCurve3([path.port, middle, path.far])
    ships.push({
      object,
      curve,
      reverse: path.reverse,
      offset: index / pathData.length,
      speed: 0.018 + index * 0.0018
    })
  })

  camera.position.set(0, 1.25, 15.5)
  camera.lookAt(0, -0.2, -1)

  return {
    clickable: [],
    update: (elapsed, delta, pointer) => {
      orbital.rotation.z += delta * 0.018
      hub.rotation.y += delta * 0.17
      hub.rotation.x -= delta * 0.05
      planet.rotation.y += delta * 0.018
      runningLights.rotation.z -= delta * 0.02
      ships.forEach((item) => {
        let progress = (elapsed * item.speed + item.offset) % 1
        if (item.reverse) progress = 1 - progress
        const point = item.curve.getPointAt(progress)
        const aheadProgress = THREE.MathUtils.clamp(progress + (item.reverse ? -0.004 : 0.004), 0, 1)
        const ahead = item.curve.getPointAt(aheadProgress)
        item.object.position.copy(point)
        if (ahead) item.object.lookAt(ahead)
      })
      camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.018
      camera.position.y += (1.25 + pointer.y * 0.45 - camera.position.y) * 0.018
      camera.lookAt(0.35, -0.25, -1.2)
    }
  }
}

const careerNodes = [
  { id: 'origin', label: 'DEVON / ORIGIN', position: [0, 0, 0], color: palette.ice, size: 0.36 },
  { id: 'consulting', label: 'CONSULTING', position: [-3.4, 1.55, -0.7], color: palette.blue, size: 0.28 },
  { id: 'apple', label: 'APPLE', position: [-5.4, -1.15, -1.6], color: palette.amber, size: 0.3 },
  { id: 'chickfila', label: 'CHICK-FIL-A', position: [-1.9, -3.1, -0.9], color: palette.coral, size: 0.3 },
  { id: 'leadership', label: 'LEADERSHIP', position: [3.3, 2.45, -1.5], color: palette.cyan, size: 0.31 },
  { id: 'platforms', label: 'PLATFORMS', position: [5.2, -0.55, -2], color: palette.blue, size: 0.27 },
  { id: 'future', label: 'NEXT SIGNAL', position: [2.7, -3.25, -1.25], color: palette.amber, size: 0.25 }
] as const

function buildCareer(scene: THREE.Scene, camera: THREE.PerspectiveCamera): SceneRig {
  scene.add(createStarField(3600, 70, 19))
  scene.add(new THREE.AmbientLight(0xa6cfce, 1.25))
  const constellation = new THREE.Group()
  scene.add(constellation)

  const clickable: THREE.Object3D[] = []
  const meshes: THREE.Mesh[] = []
  careerNodes.forEach((node, index) => {
    const group = new THREE.Group()
    group.position.set(node.position[0], node.position[1], node.position[2])
    const glow = createGlow(node.color, 0.38)
    glow.scale.setScalar(node.size * 7.2)
    group.add(glow)
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(node.size, index === 0 ? 2 : 1),
      new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: index === 0 ? 1.35 : 0.75,
        metalness: 0.34,
        roughness: 0.32
      })
    )
    mesh.userData.nodeId = node.id
    mesh.userData.baseScale = node.size
    group.add(mesh)
    const label = makeLabel(node.label, `#${new THREE.Color(node.color).getHexString()}`)
    label.position.y = node.size + 0.62
    group.add(label)
    clickable.push(mesh)
    meshes.push(mesh)
    constellation.add(group)
  })

  const links = [
    ['origin', 'consulting'],
    ['consulting', 'apple'],
    ['consulting', 'chickfila'],
    ['origin', 'leadership'],
    ['leadership', 'platforms'],
    ['leadership', 'future'],
    ['chickfila', 'future']
  ]
  links.forEach(([from, to]) => {
    const start = careerNodes.find((node) => node.id === from)
    const end = careerNodes.find((node) => node.id === to)
    if (!start || !end) return
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(start.position[0], start.position[1], start.position[2]),
      new THREE.Vector3(end.position[0], end.position[1], end.position[2])
    ])
    constellation.add(
      new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: palette.ice,
          transparent: true,
          opacity: 0.24,
          depthWrite: false
        })
      )
    )
  })

  const scan = new THREE.Mesh(
    new THREE.RingGeometry(0.98, 1.02, 128),
    new THREE.MeshBasicMaterial({ color: palette.cyan, transparent: true, opacity: 0.22, side: THREE.DoubleSide })
  )
  scan.scale.setScalar(7)
  scan.rotation.x = 1.25
  constellation.add(scan)

  camera.position.set(0.5, 0.35, 12.4)
  camera.lookAt(0, -0.25, 0)
  return {
    clickable,
    update: (elapsed, delta, pointer) => {
      constellation.rotation.y = Math.sin(elapsed * 0.07) * 0.055
      scan.rotation.z += delta * 0.075
      meshes.forEach((mesh, index) => {
        const pulse = 1 + Math.sin(elapsed * 1.4 + index * 0.8) * 0.08
        mesh.scale.setScalar(pulse)
        mesh.rotation.y += delta * (0.12 + index * 0.018)
      })
      camera.position.x += (0.5 + pointer.x * 0.55 - camera.position.x) * 0.02
      camera.position.y += (0.35 + pointer.y * 0.36 - camera.position.y) * 0.02
      camera.lookAt(0, -0.25, 0)
    }
  }
}

const systemNodes = [
  { id: 'typescript', label: 'TYPESCRIPT', radius: 2.3, speed: 0.16, phase: 0, color: palette.blue },
  { id: 'react', label: 'REACT', radius: 2.3, speed: 0.16, phase: 2.1, color: palette.cyan },
  { id: 'node', label: 'NODE', radius: 2.3, speed: 0.16, phase: 4.2, color: 0x78b676 },
  { id: 'go', label: 'GO', radius: 3.8, speed: -0.1, phase: 0.7, color: 0x68bad2 },
  { id: 'cloud', label: 'CLOUD', radius: 3.8, speed: -0.1, phase: 2.6, color: palette.amber },
  { id: 'data', label: 'DATA', radius: 3.8, speed: -0.1, phase: 4.7, color: palette.coral },
  { id: 'platform', label: 'PLATFORM', radius: 5.1, speed: 0.068, phase: 1.6, color: palette.ice },
  { id: 'ai', label: 'AI SYSTEMS', radius: 5.1, speed: 0.068, phase: 4.7, color: 0xae86c6 }
]

function buildSystems(scene: THREE.Scene, camera: THREE.PerspectiveCamera): SceneRig {
  scene.add(createStarField(3100, 68, 31))
  scene.add(new THREE.AmbientLight(0xb9d6d2, 1.6))
  const keyLight = new THREE.PointLight(0x7fd4ce, 8, 18)
  keyLight.position.set(3, 4, 6)
  scene.add(keyLight)

  const assembly = new THREE.Group()
  assembly.rotation.x = 0.78
  assembly.rotation.z = -0.14
  scene.add(assembly)

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0x193238,
    emissive: 0x1b7772,
    emissiveIntensity: 0.68,
    metalness: 0.78,
    roughness: 0.2,
    wireframe: true
  })
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.12, 3), coreMaterial)
  assembly.add(core)
  const coreInner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.72, 1),
    new THREE.MeshBasicMaterial({ color: 0x8ce2d5, transparent: true, opacity: 0.18 })
  )
  assembly.add(coreInner)
  const coreGlow = createGlow(palette.cyan, 0.32)
  coreGlow.scale.setScalar(5)
  assembly.add(coreGlow)

  ;[2.3, 3.8, 5.1].forEach((radius, index) => {
    const orbit = createOrbitLine(radius, index === 1 ? palette.blue : palette.cyan, 0.16)
    orbit.rotation.x = index * 0.18 - 0.13
    assembly.add(orbit)
  })

  const clickable: THREE.Object3D[] = []
  const nodes = systemNodes.map((node, index) => {
    const group = new THREE.Group()
    const mesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(index < 3 ? 0.23 : 0.19, 1),
      new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.8,
        metalness: 0.4,
        roughness: 0.25
      })
    )
    mesh.userData.nodeId = node.id
    group.add(mesh)
    const glow = createGlow(node.color, 0.32)
    glow.scale.setScalar(1.1)
    group.add(glow)
    const label = makeLabel(node.label, `#${new THREE.Color(node.color).getHexString()}`)
    label.scale.multiplyScalar(0.72)
    label.position.y = 0.48
    group.add(label)
    assembly.add(group)
    clickable.push(mesh)
    return { ...node, group, mesh }
  })

  camera.position.set(0, 1.2, 13.4)
  camera.lookAt(0, 0, 0)
  return {
    clickable,
    update: (elapsed, delta, pointer) => {
      core.rotation.x += delta * 0.08
      core.rotation.y += delta * 0.13
      coreInner.rotation.y -= delta * 0.17
      nodes.forEach((node, index) => {
        const angle = elapsed * node.speed + node.phase
        node.group.position.set(
          Math.cos(angle) * node.radius,
          Math.sin(angle * 1.07) * 0.28,
          Math.sin(angle) * node.radius
        )
        node.mesh.rotation.y += delta * (0.18 + index * 0.01)
      })
      assembly.rotation.y = pointer.x * 0.08
      camera.position.y += (1.2 + pointer.y * 0.4 - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)
    }
  }
}

export function SpaceScene({ mode, className = '', onNodeSelect }: SpaceSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const selectRef = useRef(onNodeSelect)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    selectRef.current = onNodeSelect
  }, [onNodeSelect])

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    } catch {
      setFailed(true)
      return
    }

    renderer.setClearColor(palette.ink, 1)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(palette.ink)
    scene.fog = new THREE.FogExp2(palette.ink, mode === 'orbital' ? 0.012 : 0.018)
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 180)
    let rig: SceneRig
    try {
      rig = mode === 'orbital' ? buildOrbital(scene, camera) : mode === 'career' ? buildCareer(scene, camera) : buildSystems(scene, camera)
    } catch {
      renderer.dispose()
      setFailed(true)
      return
    }
    const pointer = new THREE.Vector2()
    const raycaster = new THREE.Raycaster()
    const clock = new THREE.Clock()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0

    const resize = () => {
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      if (rig.clickable.length) {
        raycaster.setFromCamera(pointer, camera)
        const hit = raycaster.intersectObjects(rig.clickable, false)[0]
        canvas.style.cursor = hit ? 'pointer' : 'default'
      }
    }

    const selectNode = () => {
      if (!rig.clickable.length) return
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(rig.clickable, false)[0]
      const nodeId = hit?.object.userData.nodeId as string | undefined
      if (nodeId) selectRef.current?.(nodeId)
    }

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05)
      const elapsed = clock.elapsedTime
      rig.update(reduceMotion ? 2.4 : elapsed, reduceMotion ? 0 : delta, pointer)
      renderer.render(scene, camera)
      if (!reduceMotion) frame = window.requestAnimationFrame(animate)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(host)
    canvas.addEventListener('pointermove', updatePointer)
    canvas.addEventListener('click', selectNode)
    resize()
    animate()

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.removeEventListener('pointermove', updatePointer)
      canvas.removeEventListener('click', selectNode)
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Line) {
          object.geometry?.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value instanceof THREE.Texture) value.dispose()
            })
            material.dispose()
          })
        }
        if (object instanceof THREE.Sprite) {
          object.material.map?.dispose()
          object.material.dispose()
        }
      })
      renderer.dispose()
    }
  }, [mode])

  return (
    <div ref={hostRef} className={`${styles.scene} ${className}`} aria-hidden="true">
      {failed ? <div className={styles.fallback} /> : <canvas ref={canvasRef} className={styles.canvas} />}
      <div className={styles.status}>{failed ? 'Static telemetry' : 'Live spatial render'}</div>
    </div>
  )
}
