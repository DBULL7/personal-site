import * as THREE from 'three'

export type ChamberEnvironment = 'standard' | 'relic' | 'reactor' | 'invocation'

export type ChamberArtifact = {
  group: THREE.Group
  update: (elapsed: number, surge: number) => void
}

const GREEN = 0x72ff9a
const BRIGHT_GREEN = 0xb8ffc8
const DARK_GREEN = 0x176532

function additiveMaterial(color = GREEN, opacity = 0.5, wireframe = false) {
  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    wireframe,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  })
}

function makeFloorCircle(
  radius: number,
  floorY: number,
  centerZ: number,
  opacity = 0.5,
  color = GREEN
) {
  const points = Array.from({ length: 97 }, (_, index) => {
    const angle = (index / 96) * Math.PI * 2
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      floorY,
      centerZ + Math.sin(angle) * radius
    )
  })
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  )
}

function makeRadialTicks(
  radius: number,
  count: number,
  floorY: number,
  centerZ: number,
  length = 0.55,
  opacity = 0.45
) {
  const positions: number[] = []
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2
    const inner = radius - length / 2
    const outer = radius + length / 2
    positions.push(
      Math.cos(angle) * inner,
      floorY,
      centerZ + Math.sin(angle) * inner,
      Math.cos(angle) * outer,
      floorY,
      centerZ + Math.sin(angle) * outer
    )
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  )
  return new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  )
}

function makeRuneSprite(character: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 96
  canvas.height = 96
  const context = canvas.getContext('2d')
  if (!context) return new THREE.Sprite()
  context.font = '700 44px ui-monospace, SFMono-Regular, Menlo, monospace'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.shadowColor = 'rgba(82, 255, 128, .8)'
  context.shadowBlur = 12
  context.fillStyle = 'rgba(166, 255, 190, .82)'
  context.fillText(character, 48, 48)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.52,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(0.7, 0.7, 1)
  return sprite
}

function createRelic(floorY: number, centerZ: number): ChamberArtifact {
  const group = new THREE.Group()
  const keyboard = new THREE.Group()
  keyboard.position.set(0, floorY + 2.35, centerZ)
  keyboard.rotation.x = -0.12
  keyboard.rotation.z = -0.035
  group.add(keyboard)

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(5.8, 0.22, 2.15),
    additiveMaterial(DARK_GREEN, 0.64)
  )
  keyboard.add(base)

  const baseEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(base.geometry),
    new THREE.LineBasicMaterial({
      color: BRIGHT_GREEN,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending
    })
  )
  keyboard.add(baseEdges)

  const keyGeometry = new THREE.BoxGeometry(0.34, 0.13, 0.3)
  const keyMaterial = additiveMaterial(GREEN, 0.55)
  const keyCount = 58
  const keys = new THREE.InstancedMesh(keyGeometry, keyMaterial, keyCount)
  const matrix = new THREE.Matrix4()
  let keyIndex = 0
  const rowCounts = [13, 13, 12, 11, 9]
  rowCounts.forEach((count, row) => {
    const rowWidth = (count - 1) * 0.41
    for (let column = 0; column < count; column += 1) {
      matrix.makeTranslation(
        -rowWidth / 2 + column * 0.41,
        0.2,
        -0.72 + row * 0.36
      )
      keys.setMatrixAt(keyIndex, matrix)
      keyIndex += 1
    }
  })
  keys.instanceMatrix.needsUpdate = true
  keyboard.add(keys)

  const spacebar = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.13, 0.32),
    additiveMaterial(BRIGHT_GREEN, 0.44)
  )
  spacebar.position.set(0, 0.2, 0.72)
  keyboard.add(spacebar)

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 1.7, 2.3, 48, 1, true),
    additiveMaterial(GREEN, 0.08)
  )
  beam.position.set(0, floorY + 1.15, centerZ)
  group.add(beam)

  const rings = [1.7, 2.7, 3.8].map((radius, index) => {
    const ring = makeFloorCircle(
      radius,
      floorY + 0.035 + index * 0.008,
      centerZ,
      0.62 - index * 0.14
    )
    group.add(ring)
    return ring
  })
  const ticks = makeRadialTicks(3.8, 28, floorY + 0.05, centerZ, 0.45, 0.34)
  group.add(ticks)

  return {
    group,
    update: (elapsed, surge) => {
      keyboard.position.y =
        floorY + 2.35 + Math.sin(elapsed * 1.25) * 0.11 + surge * 0.12
      keyboard.rotation.y = Math.sin(elapsed * 0.42) * 0.075
      keyMaterial.opacity = 0.52 + Math.sin(elapsed * 3.6) * 0.08 + surge * 0.32
      beam.material.opacity = 0.06 + surge * 0.16
      rings.forEach((ring, index) => {
        const pulse = 1 + Math.sin(elapsed * 1.7 - index * 0.8) * 0.025
        ring.scale.setScalar(pulse + surge * 0.018)
      })
      ticks.rotation.y = elapsed * 0.08
    }
  }
}

function createReactor(floorY: number, centerZ: number): ChamberArtifact {
  const group = new THREE.Group()
  const aperture = new THREE.Mesh(
    new THREE.CircleGeometry(3.25, 96),
    new THREE.MeshBasicMaterial({
      color: 0x000301,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    })
  )
  aperture.rotation.x = -Math.PI / 2
  aperture.position.set(0, floorY + 0.025, centerZ)
  group.add(aperture)

  const ringMeshes = [
    { inner: 3.15, outer: 3.35, opacity: 0.78 },
    { inner: 4.05, outer: 4.16, opacity: 0.46 },
    { inner: 5.0, outer: 5.07, opacity: 0.25 }
  ].map(({ inner, outer, opacity }, index) => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(inner, outer, 128),
      additiveMaterial(index === 0 ? BRIGHT_GREEN : GREEN, opacity)
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.set(0, floorY + 0.04 + index * 0.01, centerZ)
    group.add(ring)
    return ring
  })

  const ticks = makeRadialTicks(4.55, 40, floorY + 0.075, centerZ, 0.85, 0.52)
  group.add(ticks)

  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(2.35, 3.15, 0.38, 96, 1, true),
    additiveMaterial(GREEN, 0.23)
  )
  core.position.set(0, floorY + 0.12, centerZ)
  group.add(core)

  const plume = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 2.85, 5.8, 64, 1, true),
    additiveMaterial(GREEN, 0.055)
  )
  plume.position.set(0, floorY + 2.9, centerZ)
  group.add(plume)

  const spokes: number[] = []
  for (let index = 0; index < 12; index += 1) {
    const angle = (index / 12) * Math.PI * 2
    spokes.push(
      Math.cos(angle) * 3.4,
      floorY + 0.06,
      centerZ + Math.sin(angle) * 3.4,
      Math.cos(angle) * 7.8,
      floorY + 0.06,
      centerZ + Math.sin(angle) * 7.8
    )
  }
  const spokeGeometry = new THREE.BufferGeometry()
  spokeGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(spokes, 3)
  )
  const spokeLines = new THREE.LineSegments(
    spokeGeometry,
    new THREE.LineBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending
    })
  )
  group.add(spokeLines)

  return {
    group,
    update: (elapsed, surge) => {
      const heartbeat = Math.pow(Math.max(0, Math.sin(elapsed * 0.78)), 14)
      ticks.rotation.y = elapsed * 0.22
      spokeLines.rotation.y = -elapsed * 0.035
      core.material.opacity = 0.2 + heartbeat * 0.23 + surge * 0.12
      plume.material.opacity = 0.045 + heartbeat * 0.085 + surge * 0.08
      ringMeshes.forEach((ring, index) => {
        const pulse = 1 + heartbeat * (0.018 + index * 0.006)
        ring.scale.setScalar(pulse)
      })
    }
  }
}

function createInvocation(floorY: number, centerZ: number): ChamberArtifact {
  const group = new THREE.Group()
  const circles = [1.35, 2.65, 4.1, 5.25].map((radius, index) => {
    const circle = makeFloorCircle(
      radius,
      floorY + 0.035 + index * 0.008,
      centerZ,
      0.72 - index * 0.11,
      index === 0 ? BRIGHT_GREEN : GREEN
    )
    group.add(circle)
    return circle
  })

  const innerTicks = makeRadialTicks(
    2.05,
    16,
    floorY + 0.055,
    centerZ,
    1.0,
    0.52
  )
  const outerTicks = makeRadialTicks(
    4.72,
    32,
    floorY + 0.06,
    centerZ,
    0.48,
    0.38
  )
  group.add(innerTicks, outerTicks)

  const runes = 'アカサタナハマヤラワ零壱'.split('').map((character, index) => {
    const rune = makeRuneSprite(character)
    const angle = (index / 12) * Math.PI * 2
    rune.position.set(
      Math.cos(angle) * 3.45,
      floorY + 0.3,
      centerZ + Math.sin(angle) * 3.45
    )
    group.add(rune)
    return rune
  })

  const crown = new THREE.Group()
  crown.position.set(0, floorY + 2.25, centerZ)
  ;[2.25, 2.9].forEach((radius, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.025, 8, 96),
      additiveMaterial(index === 0 ? BRIGHT_GREEN : GREEN, 0.34)
    )
    ring.rotation.x = Math.PI / 2
    ring.rotation.y = index * 0.12
    crown.add(ring)
  })
  group.add(crown)

  return {
    group,
    update: (elapsed, surge) => {
      innerTicks.rotation.y = elapsed * 0.17
      outerTicks.rotation.y = -elapsed * 0.08
      crown.position.y = floorY + 2.25 + Math.sin(elapsed * 0.8) * 0.13
      crown.rotation.y = elapsed * 0.12
      circles.forEach((circle, index) => {
        const breath = 1 + Math.sin(elapsed * 1.1 - index * 0.52) * 0.018
        circle.scale.setScalar(breath + surge * 0.012)
      })
      runes.forEach((rune, index) => {
        rune.position.y =
          floorY +
          0.3 +
          Math.sin(elapsed * 1.3 + index * 0.55) * 0.12 +
          surge * 0.08
        if (rune.material instanceof THREE.SpriteMaterial)
          rune.material.opacity =
            0.38 + Math.sin(elapsed * 2 + index) * 0.12 + surge * 0.18
      })
    }
  }
}

export function createChamberArtifact(
  environment: ChamberEnvironment,
  floorY: number,
  centerZ: number
): ChamberArtifact | null {
  if (environment === 'relic') return createRelic(floorY, centerZ)
  if (environment === 'reactor') return createReactor(floorY, centerZ)
  if (environment === 'invocation') return createInvocation(floorY, centerZ)
  return null
}
