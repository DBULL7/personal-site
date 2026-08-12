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

function makeFloorGlow(
  width: number,
  depth: number,
  floorY: number,
  centerZ: number,
  opacity = 0.2
) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const context = canvas.getContext('2d')
  if (!context) return new THREE.Group()
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128)
  gradient.addColorStop(0, 'rgba(113, 255, 153, .95)')
  gradient.addColorStop(0.22, 'rgba(49, 255, 105, .4)')
  gradient.addColorStop(0.65, 'rgba(16, 127, 52, .08)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 256, 256)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  )
  glow.rotation.x = -Math.PI / 2
  glow.position.set(0, floorY, centerZ)
  return glow
}

function makeFloorPolygon(
  sides: number,
  radius: number,
  floorY: number,
  centerZ: number,
  rotation = 0,
  opacity = 0.5
) {
  const points = Array.from({ length: sides + 1 }, (_, index) => {
    const angle = (index / sides) * Math.PI * 2 + rotation
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      floorY,
      centerZ + Math.sin(angle) * radius
    )
  })
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  )
}

function makeFloorSegments(positions: number[], opacity = 0.4) {
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

function makeFloorStar(
  points: number,
  outerRadius: number,
  innerRadius: number,
  floorY: number,
  centerZ: number,
  opacity = 0.55
) {
  const vertices = Array.from({ length: points * 2 + 1 }, (_, index) => {
    const radius = index % 2 === 0 ? outerRadius : innerRadius
    const angle = (index / (points * 2)) * Math.PI * 2 - Math.PI / 2
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      floorY,
      centerZ + Math.sin(angle) * radius
    )
  })
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(vertices),
    new THREE.LineBasicMaterial({
      color: BRIGHT_GREEN,
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

  const underlight = makeFloorGlow(7.6, 4.6, floorY + 0.03, centerZ, 0.16)
  group.add(underlight)
  const frame = makeFloorSegments(
    [
      -3.2,
      floorY + 0.06,
      centerZ - 1.55,
      -2.25,
      floorY + 0.06,
      centerZ - 1.55,
      2.25,
      floorY + 0.06,
      centerZ - 1.55,
      3.2,
      floorY + 0.06,
      centerZ - 1.55,
      -3.2,
      floorY + 0.06,
      centerZ + 1.55,
      -2.25,
      floorY + 0.06,
      centerZ + 1.55,
      2.25,
      floorY + 0.06,
      centerZ + 1.55,
      3.2,
      floorY + 0.06,
      centerZ + 1.55
    ],
    0.38
  )
  group.add(frame)

  return {
    group,
    update: (elapsed, surge) => {
      keyboard.position.y =
        floorY + 2.35 + Math.sin(elapsed * 1.25) * 0.11 + surge * 0.12
      keyboard.rotation.y = Math.sin(elapsed * 0.42) * 0.075
      keyMaterial.opacity = 0.52 + Math.sin(elapsed * 3.6) * 0.08 + surge * 0.32
      beam.material.opacity = 0.06 + surge * 0.16
      if (
        underlight instanceof THREE.Mesh &&
        !Array.isArray(underlight.material)
      )
        underlight.material.opacity =
          0.12 + Math.sin(elapsed * 1.5) * 0.025 + surge * 0.16
    }
  }
}

function createReactor(floorY: number, centerZ: number): ChamberArtifact {
  const group = new THREE.Group()
  const underlight = makeFloorGlow(10, 7.2, floorY + 0.015, centerZ, 0.18)
  group.add(underlight)

  const aperture = new THREE.Mesh(
    new THREE.CircleGeometry(3.1, 8),
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

  const apertureEdge = makeFloorPolygon(
    8,
    3.22,
    floorY + 0.075,
    centerZ,
    Math.PI / 8,
    0.8
  )
  group.add(apertureEdge)

  const shutterMaterial = additiveMaterial(DARK_GREEN, 0.56)
  const shutters = new THREE.Group()
  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2 + Math.PI / 8
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.14, 0.78),
      shutterMaterial.clone()
    )
    panel.position.set(
      Math.cos(angle) * 4.02,
      floorY + 0.08,
      centerZ + Math.sin(angle) * 4.02
    )
    panel.rotation.y = -angle
    shutters.add(panel)
  }
  group.add(shutters)

  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(2.35, 3.05, 0.38, 8, 1, true),
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

  const trenches: number[] = []
  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2 + Math.PI / 8
    trenches.push(
      Math.cos(angle) * 4.55,
      floorY + 0.06,
      centerZ + Math.sin(angle) * 4.55,
      Math.cos(angle) * 8.2,
      floorY + 0.06,
      centerZ + Math.sin(angle) * 8.2
    )
  }
  const trenchLines = makeFloorSegments(trenches, 0.22)
  group.add(trenchLines)

  return {
    group,
    update: (elapsed, surge) => {
      const heartbeat = Math.pow(Math.max(0, Math.sin(elapsed * 0.78)), 14)
      shutters.rotation.y = Math.sin(elapsed * 0.32) * 0.018
      core.material.opacity = 0.2 + heartbeat * 0.23 + surge * 0.12
      plume.material.opacity = 0.045 + heartbeat * 0.085 + surge * 0.08
      shutters.children.forEach((panel, index) => {
        if (panel instanceof THREE.Mesh && !Array.isArray(panel.material))
          panel.material.opacity =
            0.42 + heartbeat * 0.28 + Math.sin(elapsed * 2 + index) * 0.06
      })
      if (
        underlight instanceof THREE.Mesh &&
        !Array.isArray(underlight.material)
      )
        underlight.material.opacity = 0.12 + heartbeat * 0.18 + surge * 0.1
    }
  }
}

function createInvocation(floorY: number, centerZ: number): ChamberArtifact {
  const group = new THREE.Group()
  const underlight = makeFloorGlow(10, 7.8, floorY + 0.015, centerZ, 0.12)
  const star = makeFloorStar(8, 5.15, 2.05, floorY + 0.06, centerZ, 0.55)
  const diamond = makeFloorPolygon(
    4,
    3.55,
    floorY + 0.065,
    centerZ,
    Math.PI / 4,
    0.42
  )
  const axes = makeFloorSegments(
    [
      -6.2,
      floorY + 0.055,
      centerZ,
      6.2,
      floorY + 0.055,
      centerZ,
      0,
      floorY + 0.055,
      centerZ - 6.2,
      0,
      floorY + 0.055,
      centerZ + 6.2,
      -4.2,
      floorY + 0.055,
      centerZ - 4.2,
      4.2,
      floorY + 0.055,
      centerZ + 4.2,
      4.2,
      floorY + 0.055,
      centerZ - 4.2,
      -4.2,
      floorY + 0.055,
      centerZ + 4.2
    ],
    0.22
  )
  group.add(underlight, star, diamond, axes)

  const runes = 'アカサタナハマヤラワ零壱'.split('').map((character, index) => {
    const rune = makeRuneSprite(character)
    const angle = (index / 12) * Math.PI * 2
    rune.position.set(
      Math.cos(angle) * 4.2,
      floorY + 0.3,
      centerZ + Math.sin(angle) * 4.2
    )
    group.add(rune)
    return rune
  })

  const crown = new THREE.Group()
  crown.position.set(0, floorY + 2.25, centerZ)
  const diamondPoints = [
    new THREE.Vector3(-2.6, 0, 0),
    new THREE.Vector3(0, 1.15, 0),
    new THREE.Vector3(2.6, 0, 0),
    new THREE.Vector3(0, -1.15, 0),
    new THREE.Vector3(-2.6, 0, 0)
  ]
  const crownMaterial = new THREE.LineBasicMaterial({
    color: BRIGHT_GREEN,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const frontDiamond = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(diamondPoints),
    crownMaterial
  )
  const crossDiamond = frontDiamond.clone()
  crossDiamond.rotation.y = Math.PI / 2
  crown.add(frontDiamond, crossDiamond)
  group.add(crown)

  return {
    group,
    update: (elapsed, surge) => {
      crown.position.y = floorY + 2.25 + Math.sin(elapsed * 0.8) * 0.13
      crown.rotation.y = elapsed * 0.12
      const breath = 1 + Math.sin(elapsed * 1.1) * 0.018 + surge * 0.014
      star.scale.setScalar(breath)
      diamond.scale.setScalar(2 - breath)
      if (
        underlight instanceof THREE.Mesh &&
        !Array.isArray(underlight.material)
      )
        underlight.material.opacity =
          0.08 + Math.sin(elapsed * 1.1) * 0.02 + surge * 0.12
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
