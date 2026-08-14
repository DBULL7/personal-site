import * as THREE from 'three'
import { Reflector } from 'three/addons/objects/Reflector.js'

export type ChamberEnvironment =
  | 'standard'
  | 'relic'
  | 'reactor'
  | 'invocation'
  | 'cyber'
  | 'castle'
  | 'black-glass'

export type BlackGlassBackWallStudy =
  | 'baseline'
  | 'lightning'
  | 'wall-lightning'
  | 'terminal'
  | 'matrix-rain'
  | 'server-wall'
  | 'aperture'
  | 'server-lightning'

export type ChamberArtifact = {
  group: THREE.Group
  update: (elapsed: number, surge: number) => void
  onGlyphEmerge?: (x: number, z: number) => void
  dispose?: () => void
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

function createCyberVault(floorY: number, centerZ: number): ChamberArtifact {
  const group = new THREE.Group()
  const architectureMaterial = new THREE.MeshStandardMaterial({
    color: 0x07130c,
    emissive: 0x062611,
    emissiveIntensity: 1.05,
    metalness: 0.92,
    roughness: 0.32
  })
  const secondaryMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a2115,
    emissive: 0x082e17,
    emissiveIntensity: 0.78,
    metalness: 0.82,
    roughness: 0.44
  })
  const stripMaterials: THREE.MeshBasicMaterial[] = []
  const makeStripMaterial = (opacity: number) => {
    const material = new THREE.MeshBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    stripMaterials.push(material)
    return material
  }

  const floorSlabs = new THREE.Group()
  for (let index = 0; index < 12; index += 1) {
    const z = 6.6 - index * 2.55
    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(18.8, 0.18, 2.38),
      index % 2 === 0 ? architectureMaterial : secondaryMaterial
    )
    slab.position.set(0, floorY - 0.08, z)
    floorSlabs.add(slab)

    const seam = new THREE.Mesh(
      new THREE.BoxGeometry(17.2, 0.025, 0.025),
      makeStripMaterial(index % 3 === 0 ? 0.34 : 0.12)
    )
    seam.position.set(0, floorY + 0.03, z - 1.2)
    floorSlabs.add(seam)
  }
  group.add(floorSlabs)

  const towers = new THREE.Group()
  const towerDepths = [4.5, -1.5, -7.5, -13.5, -19.5]
  towerDepths.forEach((z, depthIndex) => {
    ;[-1, 1].forEach((side) => {
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(2.35, 10.8, 3.55),
        depthIndex % 2 === 0 ? architectureMaterial : secondaryMaterial
      )
      tower.position.set(side * 9.5, floorY + 5.2, z)
      towers.add(tower)

      for (let slot = 0; slot < 4; slot += 1) {
        const light = new THREE.Mesh(
          new THREE.BoxGeometry(0.035, 1.15, 1.75),
          makeStripMaterial(0.26 + slot * 0.04)
        )
        light.position.set(
          side * 8.31,
          floorY + 2.05 + slot * 2.05,
          z + (slot % 2 === 0 ? -0.35 : 0.35)
        )
        towers.add(light)
      }
    })
  })
  group.add(towers)

  const overhead = new THREE.Group()
  towerDepths.forEach((z, index) => {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(17.8, 0.34, 0.56),
      architectureMaterial
    )
    beam.position.set(0, floorY + 11.15, z)
    overhead.add(beam)

    const light = new THREE.Mesh(
      new THREE.BoxGeometry(index % 2 === 0 ? 7.4 : 4.6, 0.05, 0.12),
      makeStripMaterial(index % 2 === 0 ? 0.34 : 0.2)
    )
    light.position.set(0, floorY + 10.93, z + 0.15)
    overhead.add(light)
  })
  ;[-5.8, 5.8].forEach((x) => {
    const conduit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 29, 12),
      secondaryMaterial
    )
    conduit.rotation.x = Math.PI / 2
    conduit.position.set(x, floorY + 10.55, -7.5)
    overhead.add(conduit)
  })
  group.add(overhead)

  const threshold = new THREE.Group()
  const thresholdZ = centerZ - 11.8
  ;[-6.6, 6.6].forEach((x) => {
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(1.25, 12.4, 1.15),
      architectureMaterial
    )
    pillar.position.set(x, floorY + 5.9, thresholdZ)
    threshold.add(pillar)
  })
  const lintel = new THREE.Mesh(
    new THREE.BoxGeometry(14.4, 1.15, 1.15),
    architectureMaterial
  )
  lintel.position.set(0, floorY + 11.55, thresholdZ)
  threshold.add(lintel)
  const thresholdLight = new THREE.Mesh(
    new THREE.BoxGeometry(11.6, 0.08, 0.08),
    makeStripMaterial(0.48)
  )
  thresholdLight.position.set(0, floorY + 10.82, thresholdZ + 0.6)
  threshold.add(thresholdLight)
  group.add(threshold)

  const scanMaterial = new THREE.MeshBasicMaterial({
    color: 0x42ff7f,
    transparent: true,
    opacity: 0.035,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  const scanPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(18.6, 12.8),
    scanMaterial
  )
  scanPlane.position.set(0, floorY + 5.7, -18)
  group.add(scanPlane)

  return {
    group,
    update: (elapsed, surge) => {
      scanPlane.position.z = -20 + ((elapsed * 2.35) % 27)
      scanMaterial.opacity = 0.018 + surge * 0.065
      stripMaterials.forEach((material, index) => {
        const pulse = Math.max(
          0,
          Math.sin(elapsed * (1.1 + (index % 5) * 0.14) + index * 0.78)
        )
        material.opacity =
          Math.min(0.58, material.opacity * 0.92 + pulse * 0.028) + surge * 0.08
      })
      threshold.position.y = Math.sin(elapsed * 0.34) * 0.025
    }
  }
}

function createBlackGlassFloor(
  floorY: number,
  centerZ: number,
  backWallStudy: BlackGlassBackWallStudy
): ChamberArtifact {
  const group = new THREE.Group()
  const reflectionSize = window.innerWidth < 700 ? 512 : 1024
  const blackGlassShader = {
    name: 'BlackGlassReflector',
    uniforms: {
      color: { value: null },
      tDiffuse: { value: null },
      textureMatrix: { value: null },
      time: { value: 0 },
      surge: { value: 0 }
    },
    vertexShader: /* glsl */ `
      uniform mat4 textureMatrix;
      varying vec4 vUv;

      #include <common>
      #include <logdepthbuf_pars_vertex>

      void main() {
        vUv = textureMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        #include <logdepthbuf_vertex>
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 color;
      uniform sampler2D tDiffuse;
      uniform float time;
      uniform float surge;
      varying vec4 vUv;

      #include <logdepthbuf_pars_fragment>

      float blendOverlay(float base, float blend) {
        return base < 0.5
          ? 2.0 * base * blend
          : 1.0 - 2.0 * (1.0 - base) * (1.0 - blend);
      }

      vec3 blendOverlay(vec3 base, vec3 blend) {
        return vec3(
          blendOverlay(base.r, blend.r),
          blendOverlay(base.g, blend.g),
          blendOverlay(base.b, blend.b)
        );
      }

      void main() {
        #include <logdepthbuf_fragment>

        vec2 projectedUv = vUv.xy / max(vUv.w, 0.0001);
        float viscosity = 0.35 + surge * 1.4;
        vec2 distortion = vec2(
          sin(projectedUv.y * 76.0 + time * 0.58),
          sin(projectedUv.x * 91.0 - time * 0.43)
        ) * 0.00065 * viscosity;
        vec4 distortedUv = vUv;
        distortedUv.xy += distortion * vUv.w;
        vec4 reflected = texture2DProj(tDiffuse, distortedUv);
        float movingSheen = 0.96 +
          sin((projectedUv.x + projectedUv.y) * 17.0 + time * 0.24) * 0.04;
        reflected.rgb *= movingSheen;
        gl_FragColor = vec4(blendOverlay(reflected.rgb, color), 1.0);

        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `
  }
  const isHorizonRailStudy = backWallStudy === 'wall-lightning'
  const roomDepth = isHorizonRailStudy ? 72 : 38
  const roomWidth = isHorizonRailStudy ? 64 : 27
  const roomNearZ = centerZ + 20
  const roomFarZ = roomNearZ - roomDepth
  const roomCenterZ = (roomNearZ + roomFarZ) / 2
  const mirror = new Reflector(new THREE.PlaneGeometry(roomWidth, roomDepth), {
    color: 0x7c827e,
    textureWidth: reflectionSize,
    textureHeight: reflectionSize,
    clipBias: 0.0025,
    multisample: window.innerWidth < 700 ? 0 : 2,
    shader: blackGlassShader
  })
  mirror.rotation.x = -Math.PI / 2
  mirror.position.set(0, floorY, roomCenterZ)
  group.add(mirror)
  const mirrorMaterial = mirror.material as THREE.ShaderMaterial

  const roomMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x010302,
    emissive: 0x010302,
    emissiveIntensity: 0.24,
    metalness: 0.96,
    roughness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    side: THREE.DoubleSide
  })
  const roomCenterY = floorY + 7.55
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(roomWidth, 15.1),
    roomMaterial
  )
  const backWallZ = roomFarZ
  backWall.position.set(0, roomCenterY, backWallZ)
  group.add(backWall)
  if (!isHorizonRailStudy) {
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDepth, 15.1),
      roomMaterial
    )
    leftWall.rotation.y = Math.PI / 2
    leftWall.position.set(-13.45, roomCenterY, roomCenterZ)
    const rightWall = leftWall.clone()
    rightWall.rotation.y = -Math.PI / 2
    rightWall.position.x = 13.45
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomDepth),
      roomMaterial
    )
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.set(0, floorY + 15.1, roomCenterZ)
    group.add(leftWall, rightWall, ceiling)
  }

  const studyWallZ = centerZ - 14
  if (backWallStudy !== 'baseline' && !isHorizonRailStudy) {
    const studyBacking = new THREE.Mesh(
      new THREE.PlaneGeometry(27, 15.1),
      roomMaterial.clone()
    )
    studyBacking.position.set(0, roomCenterY, studyWallZ - 0.08)
    group.add(studyBacking)
  }

  const wallUpdaters: Array<(elapsed: number, surge: number) => void> = []
  const wallTextures: THREE.CanvasTexture[] = []
  let wallSeed = 93017
  const wallRandom = () => {
    wallSeed = (wallSeed * 16807) % 2147483647
    return (wallSeed - 1) / 2147483646
  }

  const addTerminalWall = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const context = canvas.getContext('2d')
    if (!context) return
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    wallTextures.push(texture)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false
    })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(23.8, 12.8), material)
    plane.position.set(0, roomCenterY, studyWallZ + 0.08)
    group.add(plane)

    const terminalLines = [
      'devon@black-glass:~$ trace --field toolkit',
      '[ok] catalog mounted / 94 marks',
      '[ok] mirror plane synchronized',
      'devon@black-glass:~$ inspect --depth all',
      'near .............. active',
      'middle ............ active',
      'far ............... active',
      'devon@black-glass:~$ watch --breaches',
      'stream open_'
    ]
    let lastTerminalFrame = -1
    wallUpdaters.push((elapsed, surge) => {
      const frame = Math.floor(elapsed * 12)
      if (frame === lastTerminalFrame) return
      lastTerminalFrame = frame
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = 'rgba(0, 7, 2, .68)'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.strokeStyle = 'rgba(104, 255, 145, .16)'
      context.lineWidth = 2
      context.strokeRect(19, 19, canvas.width - 38, canvas.height - 38)
      context.font = '600 22px ui-monospace, SFMono-Regular, Menlo, monospace'
      context.fillStyle = 'rgba(125, 255, 158, .42)'
      context.fillText('BLACK_GLASS://SHELL', 48, 58)
      const activeLine = Math.floor(elapsed / 1.45) % terminalLines.length
      const typedCharacters = Math.floor((elapsed % 1.45) * 34)
      terminalLines.forEach((line, index) => {
        const active = index === activeLine
        context.fillStyle = active
          ? 'rgba(194, 255, 208, .88)'
          : 'rgba(108, 255, 143, .34)'
        const renderedLine = active ? line.slice(0, typedCharacters) : line
        const y = 86 + index * 45
        context.fillText(renderedLine, 48, y)
        if (active && Math.floor(elapsed * 2) % 2 === 0) {
          const cursorX = 48 + context.measureText(renderedLine).width + 4
          context.fillRect(cursorX, y - 18, 10, 3)
        }
      })
      texture.needsUpdate = true
      material.opacity = 0.46 + surge * 0.1
    })
  }

  const addMatrixRainWall = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 768
    canvas.height = 512
    const context = canvas.getContext('2d')
    if (!context) return
    context.fillStyle = '#000301'
    context.fillRect(0, 0, canvas.width, canvas.height)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    wallTextures.push(texture)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false
    })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(24.2, 13.6), material)
    plane.position.set(0, roomCenterY, studyWallZ + 0.07)
    group.add(plane)

    const fontSize = 18
    const columns = Math.floor(canvas.width / fontSize)
    const drops = Array.from({ length: columns }, () =>
      Math.floor(wallRandom() * (canvas.height / fontSize))
    )
    const rainGlyphs = Array.from(
      '01<>[]{}アイウエオカキクケコサシスセソタチツテト'
    )
    let lastRainFrame = -1
    wallUpdaters.push((elapsed, surge) => {
      const frame = Math.floor(elapsed * 9)
      if (frame === lastRainFrame) return
      lastRainFrame = frame
      context.fillStyle = 'rgba(0, 3, 1, .13)'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`
      context.textAlign = 'center'
      drops.forEach((drop, index) => {
        const glyph = rainGlyphs[Math.floor(wallRandom() * rainGlyphs.length)]
        const x = index * fontSize + fontSize / 2
        const y = drop * fontSize
        context.shadowColor = 'rgba(71, 255, 116, .35)'
        context.shadowBlur = index % 7 === 0 ? 8 : 2
        context.fillStyle =
          index % 11 === 0
            ? 'rgba(190, 255, 205, .72)'
            : 'rgba(65, 224, 103, .46)'
        context.fillText(glyph, x, y)
        drops[index] += index % 5 === 0 ? 0.48 : 0.3
        if (y > canvas.height && wallRandom() > 0.972) drops[index] = 0
      })
      texture.needsUpdate = true
      material.opacity = 0.36 + surge * 0.12
    })
  }

  const addServerWall = () => {
    const shellMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x061009,
      emissive: 0x06150b,
      emissiveIntensity: 0.52,
      metalness: 0.94,
      roughness: 0.18,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12
    })
    const insetMaterial = new THREE.MeshStandardMaterial({
      color: 0x010201,
      emissive: 0x0a3216,
      emissiveIntensity: 0.52,
      metalness: 0.72,
      roughness: 0.46
    })
    const ledMaterial = new THREE.MeshBasicMaterial({
      color: 0x68ff91,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    const serverWash = new THREE.PointLight(0x67ff91, 24, 13, 1.7)
    serverWash.position.set(0, roomCenterY + 0.4, studyWallZ + 3.8)
    group.add(serverWash)
    const bayGeometry = new THREE.BoxGeometry(2.85, 12.7, 0.42)
    const bayEdgeGeometry = new THREE.EdgesGeometry(bayGeometry)
    const bayEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0x50b86d,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false
    })
    const ventGeometry = new THREE.BoxGeometry(2.25, 0.075, 0.035)
    const ledGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.04)
    const ventCount = 7 * 9
    const vents = new THREE.InstancedMesh(
      ventGeometry,
      insetMaterial,
      ventCount
    )
    const leds = new THREE.InstancedMesh(ledGeometry, ledMaterial, ventCount)
    const matrix = new THREE.Matrix4()
    let instance = 0
    for (let bay = 0; bay < 7; bay += 1) {
      const x = (bay - 3) * 3.45
      const shell = new THREE.Mesh(bayGeometry, shellMaterial)
      shell.position.set(x, roomCenterY, studyWallZ + 0.25)
      const bayEdge = new THREE.LineSegments(
        bayEdgeGeometry,
        bayEdgeMaterial.clone()
      )
      bayEdge.position.copy(shell.position)
      group.add(shell, bayEdge)
      const crown = new THREE.Mesh(
        new THREE.BoxGeometry(2.45, 0.16, 0.08),
        ledMaterial.clone()
      )
      crown.position.set(x, floorY + 13.25, studyWallZ + 0.5)
      group.add(crown)
      for (let slot = 0; slot < 9; slot += 1) {
        const y = floorY + 1.4 + slot * 1.27
        matrix.makeTranslation(x, y, studyWallZ + 0.49)
        vents.setMatrixAt(instance, matrix)
        matrix.makeTranslation(x + 0.93, y + 0.28, studyWallZ + 0.52)
        leds.setMatrixAt(instance, matrix)
        instance += 1
      }
    }
    vents.instanceMatrix.needsUpdate = true
    leds.instanceMatrix.needsUpdate = true
    group.add(vents, leds)
    wallUpdaters.push((elapsed, surge) => {
      ledMaterial.opacity =
        0.26 + Math.max(0, Math.sin(elapsed * 1.7)) * 0.18 + surge * 0.22
      insetMaterial.emissiveIntensity = 0.5 + surge * 0.65
      serverWash.intensity = 18 + surge * 22
    })
  }

  const addSignalAperture = () => {
    const haloMaterial = additiveMaterial(0x39ff77, 0.14)
    const coreMaterial = additiveMaterial(0xb8ffca, 0.7)
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 14.1),
      haloMaterial
    )
    halo.position.set(0, roomCenterY, studyWallZ + 0.055)
    const core = new THREE.Mesh(
      new THREE.PlaneGeometry(0.48, 13.35),
      coreMaterial
    )
    core.position.set(0, roomCenterY, studyWallZ + 0.09)
    group.add(halo, core)

    const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x010302,
      metalness: 0.96,
      roughness: 0.12,
      clearcoat: 1
    })
    const frameGeometry = new THREE.BoxGeometry(0.58, 14.25, 0.34)
    const leftFrame = new THREE.Mesh(frameGeometry, frameMaterial)
    leftFrame.position.set(-0.64, roomCenterY, studyWallZ + 0.23)
    const rightFrame = leftFrame.clone()
    rightFrame.position.x = 0.64
    group.add(leftFrame, rightFrame)

    const signalMaterial = new THREE.MeshBasicMaterial({
      color: 0x001606,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    })
    const signals = Array.from({ length: 7 }, (_, index) => {
      const signal = new THREE.Mesh(
        new THREE.PlaneGeometry(0.34, 0.025 + (index % 3) * 0.035),
        signalMaterial.clone()
      )
      signal.position.set(0, floorY + index * 2.1, studyWallZ + 0.12)
      group.add(signal)
      return signal
    })
    wallUpdaters.push((elapsed, surge) => {
      const pulse = 0.5 + Math.sin(elapsed * 0.8) * 0.5
      coreMaterial.opacity = 0.58 + pulse * 0.18 + surge * 0.16
      haloMaterial.opacity = 0.08 + pulse * 0.08 + surge * 0.12
      core.scale.x = 0.9 + pulse * 0.22
      signals.forEach((signal, index) => {
        signal.position.y =
          floorY + ((elapsed * (0.38 + index * 0.015) + index * 2.4) % 14.2)
        const material = signal.material as THREE.MeshBasicMaterial
        material.opacity = 0.45 + Math.sin(elapsed * 1.4 + index) * 0.22
      })
    })
  }

  type LightningActor = {
    group: THREE.Group
    coreMaterial: THREE.MeshBasicMaterial
    branchMaterial: THREE.MeshBasicMaterial
    glowMaterial: THREE.MeshBasicMaterial
    flashLight: THREE.PointLight
    meshes: THREE.Mesh[]
    startedAt: number
    nextStrikeAt: number
    duration: number
    depth: number
  }

  const createLightningActor = (): LightningActor => {
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: BRIGHT_GREEN,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      toneMapped: false
    })
    const branchMaterial = new THREE.MeshBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      toneMapped: false
    })
    const glowMaterial = branchMaterial.clone()
    const boltGroup = new THREE.Group()
    const flashLight = new THREE.PointLight(GREEN, 0, 18, 1.7)
    group.add(boltGroup, flashLight)
    return {
      group: boltGroup,
      coreMaterial,
      branchMaterial,
      glowMaterial,
      flashLight,
      meshes: [],
      startedAt: -100,
      nextStrikeAt: 0,
      duration: 1.5,
      depth: 0
    }
  }

  const clearLightningActor = (actor: LightningActor) => {
    actor.meshes.forEach((mesh) => {
      actor.group.remove(mesh)
      mesh.geometry.dispose()
    })
    actor.meshes = []
  }

  const addLightningPath = (
    actor: LightningActor,
    points: THREE.Vector3[],
    radius: number,
    material: THREE.MeshBasicMaterial
  ) => {
    const path = new THREE.CurvePath<THREE.Vector3>()
    for (let index = 1; index < points.length; index += 1) {
      path.add(new THREE.LineCurve3(points[index - 1], points[index]))
    }
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(path, Math.max(8, points.length * 3), radius, 4),
      material
    )
    actor.group.add(mesh)
    actor.meshes.push(mesh)
  }

  const setLightningEnergy = (
    actor: LightningActor,
    energy: number,
    reveal: number,
    lightScale = 1
  ) => {
    actor.group.scale.y = Math.max(0.01, reveal)
    actor.group.visible = energy > 0.002
    actor.coreMaterial.opacity = energy
    actor.glowMaterial.opacity = energy * 0.22
    actor.branchMaterial.opacity = energy * 0.7
    actor.flashLight.intensity = energy * lightScale
  }

  const addDepthLightning = ({
    count,
    farOnly = false,
    restrained = false
  }: {
    count: number
    farOnly?: boolean
    restrained?: boolean
  }) => {
    const actorCount =
      window.innerWidth < 700 && !restrained ? Math.min(count, 10) : count
    const actors = Array.from({ length: actorCount }, () =>
      createLightningActor()
    )
    let lastSurgeStrike = -100

    const prepareStrike = (
      actor: LightningActor,
      elapsed: number,
      actorIndex: number
    ) => {
      clearLightningActor(actor)
      const randomDepth = wallRandom()
      const depth = farOnly
        ? randomDepth * 0.24
        : THREE.MathUtils.clamp(
            (actorIndex + randomDepth * 1.8) / Math.max(1, actorCount - 0.5),
            0,
            1
          )
      const height = THREE.MathUtils.lerp(3.1, 14.35, Math.pow(depth, 0.78))
      const z = THREE.MathUtils.lerp(studyWallZ + 0.32, centerZ + 11.2, depth)
      const side = wallRandom() < 0.5 ? -1 : 1
      const edgeBias = THREE.MathUtils.lerp(8.5, 9.8, depth)
      const startX = side * (edgeBias + wallRandom() * (2.4 - depth * 0.7))
      const radius = THREE.MathUtils.lerp(0.022, 0.105, depth)
      const mainPoints: THREE.Vector3[] = []
      let x = 0
      const segments = 12 + Math.round(depth * 11)
      for (let index = 0; index <= segments; index += 1) {
        const progress = index / segments
        x +=
          (wallRandom() - 0.5) *
          THREE.MathUtils.lerp(0.26, 0.72, depth) *
          (1 - progress * 0.34)
        mainPoints.push(
          new THREE.Vector3(
            x,
            progress * height,
            (wallRandom() - 0.5) * THREE.MathUtils.lerp(0.03, 0.18, depth)
          )
        )
      }
      actor.group.position.set(startX, floorY + 0.12, z)
      addLightningPath(actor, mainPoints, radius * 2.7, actor.glowMaterial)
      addLightningPath(actor, mainPoints, radius, actor.coreMaterial)

      const branchCount = 1 + Math.round(depth * 3)
      Array.from({ length: branchCount }, (_, branchIndex) => {
        const originIndex = Math.min(
          segments - 2,
          4 + Math.floor(((branchIndex + 1) / (branchCount + 1)) * segments)
        )
        const origin = mainPoints[originIndex]
        const direction = branchIndex % 2 === 0 ? -1 : 1
        const branchPoints = [origin.clone()]
        const steps = 3 + Math.round(depth * 3)
        for (let step = 1; step <= steps; step += 1) {
          branchPoints.push(
            new THREE.Vector3(
              origin.x +
                direction *
                  step *
                  THREE.MathUtils.lerp(0.18, 0.44, depth) *
                  (0.72 + wallRandom() * 0.5),
              origin.y + step * THREE.MathUtils.lerp(0.16, 0.38, depth),
              (wallRandom() - 0.5) * 0.08
            )
          )
        }
        addLightningPath(
          actor,
          branchPoints,
          radius * 0.48,
          actor.branchMaterial
        )
      })

      actor.depth = depth
      actor.duration = restrained
        ? THREE.MathUtils.lerp(1.05, 1.75, depth)
        : THREE.MathUtils.lerp(1.7, 2.8, depth)
      actor.startedAt = elapsed
      actor.nextStrikeAt =
        elapsed +
        (restrained ? 8.5 : 3.1) +
        wallRandom() * (restrained ? 6.5 : 2.7)
      actor.group.scale.y = 0.01
      actor.group.visible = true
      actor.flashLight.position.set(
        startX,
        floorY + height * 0.44,
        z + THREE.MathUtils.lerp(0.4, 1.8, depth)
      )
      actor.flashLight.distance = THREE.MathUtils.lerp(7, 22, depth)
    }

    actors.forEach((actor, index) => {
      actor.nextStrikeAt = restrained
        ? 0.18 + index * 1.45
        : 0.18 + ((index * 7) % actorCount) * 0.2
    })

    wallUpdaters.push((elapsed, surge) => {
      const shouldSurge = surge > 0.82 && elapsed - lastSurgeStrike > 2.2
      actors.forEach((actor, index) => {
        if (elapsed >= actor.nextStrikeAt || (shouldSurge && index % 2 === 0))
          prepareStrike(actor, elapsed, index)

        const age = elapsed - actor.startedAt
        const active = age >= 0 && age < actor.duration
        const energy = active
          ? Math.exp(
              -age *
                (restrained
                  ? THREE.MathUtils.lerp(2.35, 1.15, actor.depth)
                  : THREE.MathUtils.lerp(1.28, 0.68, actor.depth))
            ) *
            (0.68 + Math.abs(Math.sin(age * 31 + index)) * 0.32)
          : 0
        const reveal = THREE.MathUtils.clamp(
          age / THREE.MathUtils.lerp(0.1, 0.22, actor.depth),
          0,
          1
        )
        setLightningEnergy(
          actor,
          energy,
          reveal,
          THREE.MathUtils.lerp(12, 52, actor.depth)
        )
      })
      if (shouldSurge) lastSurgeStrike = elapsed
    })
  }

  const addHazardLightning = () => {
    const actorCount = window.innerWidth < 700 ? 3 : 6
    const actors = Array.from({ length: actorCount }, () =>
      createLightningActor()
    )
    let actorCursor = 0
    let nextStrikeAt = 0.65
    let lastStrikeAt = -100
    let lastSide = wallRandom() < 0.5 ? -1 : 1
    let lastZ = centerZ

    const buildFractalPath = (
      start: THREE.Vector3,
      end: THREE.Vector3,
      iterations: number,
      displacement: number
    ) => {
      let points = [start, end]
      let amplitude = displacement
      for (let iteration = 0; iteration < iterations; iteration += 1) {
        const displaced: THREE.Vector3[] = [points[0]]
        for (let index = 1; index < points.length; index += 1) {
          const previous = points[index - 1]
          const current = points[index]
          const midpoint = previous.clone().lerp(current, 0.5)
          midpoint.x += (wallRandom() - 0.5) * amplitude
          midpoint.z += (wallRandom() - 0.5) * amplitude * 0.46
          midpoint.y += (wallRandom() - 0.5) * amplitude * 0.12
          displaced.push(midpoint, current)
        }
        points = displaced
        amplitude *= 0.52
      }
      return points
    }

    const selectStrikePosition = () => {
      const side = wallRandom() < 0.82 ? -lastSide : lastSide
      const distanceSample = Math.pow(wallRandom(), 1.28)
      let z = THREE.MathUtils.lerp(roomFarZ + 18, centerZ + 10, distanceSample)
      if (side === lastSide && Math.abs(z - lastZ) < 7) {
        z += z < lastZ ? -8 : 8
        z = THREE.MathUtils.clamp(z, roomFarZ + 15, centerZ + 10)
      }
      const proximity = THREE.MathUtils.clamp(
        (z - (roomFarZ + 18)) / (centerZ + 10 - (roomFarZ + 18)),
        0,
        1
      )
      const x =
        side *
        THREE.MathUtils.lerp(
          18.5 + wallRandom() * 8,
          16.5 + wallRandom() * 3.5,
          proximity
        )
      lastSide = side
      lastZ = z
      return { side, x, z, proximity }
    }

    const prepareHazardStrike = (actor: LightningActor, elapsed: number) => {
      clearLightningActor(actor)
      const { side, x, z, proximity } = selectStrikePosition()
      const height = THREE.MathUtils.lerp(9.5, 17.5, proximity)
      const radius = THREE.MathUtils.lerp(0.025, 0.095, proximity)
      const ground = new THREE.Vector3(0, 0, 0)
      const leader = new THREE.Vector3(
        side * (0.9 + wallRandom() * THREE.MathUtils.lerp(2.2, 4.8, proximity)),
        height,
        (wallRandom() - 0.5) * 2.4
      )
      const mainPoints = buildFractalPath(
        leader,
        ground,
        proximity > 0.5 ? 5 : 4,
        THREE.MathUtils.lerp(1.25, 2.5, proximity)
      )
      actor.group.position.set(x, floorY + 0.1, z)
      actor.group.scale.set(1, 1, 1)
      addLightningPath(actor, mainPoints, radius * 3.8, actor.glowMaterial)
      addLightningPath(actor, mainPoints, radius, actor.coreMaterial)

      const majorForks = 1 + Math.floor(wallRandom() * 3)
      for (let forkIndex = 0; forkIndex < majorForks; forkIndex += 1) {
        const originIndex = Math.floor(
          mainPoints.length * (0.24 + wallRandom() * 0.38)
        )
        const origin = mainPoints[originIndex]
        const forkEnd = new THREE.Vector3(
          origin.x + side * (2.4 + wallRandom() * (4.2 + proximity * 3)),
          Math.max(0.65, origin.y - (2.4 + wallRandom() * 6.2)),
          origin.z + (wallRandom() - 0.5) * (4.5 + proximity * 3)
        )
        const forkPoints = buildFractalPath(
          origin.clone(),
          forkEnd,
          3 + (forkIndex % 2),
          THREE.MathUtils.lerp(0.8, 1.65, proximity)
        )
        addLightningPath(actor, forkPoints, radius * 1.7, actor.glowMaterial)
        addLightningPath(actor, forkPoints, radius * 0.46, actor.branchMaterial)
      }

      const branchCount = 4 + Math.floor(wallRandom() * 5)
      for (let branchIndex = 0; branchIndex < branchCount; branchIndex += 1) {
        const originIndex =
          3 + Math.floor(wallRandom() * Math.max(2, mainPoints.length - 7))
        const origin = mainPoints[originIndex]
        const branchEnd = new THREE.Vector3(
          origin.x + side * (0.8 + wallRandom() * (2.4 + proximity * 2)),
          Math.max(0.45, origin.y - (1.1 + wallRandom() * 4.2)),
          origin.z + (wallRandom() - 0.5) * (2.2 + proximity * 1.8)
        )
        const branchPoints = buildFractalPath(
          origin.clone(),
          branchEnd,
          2 + (branchIndex % 2),
          THREE.MathUtils.lerp(0.4, 1.05, proximity)
        )
        addLightningPath(
          actor,
          branchPoints,
          radius * THREE.MathUtils.lerp(0.28, 0.52, wallRandom()),
          actor.branchMaterial
        )
      }

      const groundForks = 2 + Math.floor(wallRandom() * 3)
      for (let forkIndex = 0; forkIndex < groundForks; forkIndex += 1) {
        const forkEnd = new THREE.Vector3(
          side * (1.4 + wallRandom() * 3.8),
          0.035,
          (wallRandom() - 0.5) * 5.5
        )
        const floorPoints = buildFractalPath(
          new THREE.Vector3(0, 0.035, 0),
          forkEnd,
          2,
          0.65
        )
        addLightningPath(
          actor,
          floorPoints,
          radius * 0.38,
          actor.branchMaterial
        )
      }

      actor.depth = proximity
      actor.duration = 1.05 + wallRandom() * 0.45
      actor.startedAt = elapsed
      actor.group.visible = true
      actor.flashLight.position.set(x, floorY + 1.1, z)
      actor.flashLight.distance = THREE.MathUtils.lerp(9, 27, proximity)
      lastStrikeAt = elapsed
      nextStrikeAt = elapsed + 1.35 + wallRandom() * 2.9
    }

    const flashPulse = (age: number, center: number, width: number) =>
      Math.exp(-Math.pow((age - center) / width, 2))

    wallUpdaters.push((elapsed, surge) => {
      const forcedStrike = surge > 0.82 && elapsed - lastStrikeAt > 1.05
      if (elapsed >= nextStrikeAt || forcedStrike) {
        prepareHazardStrike(actors[actorCursor], elapsed)
        actorCursor = (actorCursor + 1) % actors.length
      }

      actors.forEach((actor, index) => {
        const age = elapsed - actor.startedAt
        const active = age >= 0 && age < actor.duration
        const energy = active
          ? Math.min(
              1,
              flashPulse(age, 0.025, 0.022) +
                flashPulse(age, 0.13, 0.035) * 0.72 +
                flashPulse(age, 0.29, 0.055) * 0.42 +
                Math.exp(-age * 1.9) * 0.28
            )
          : 0
        actor.group.visible = energy > 0.004
        actor.coreMaterial.opacity = energy
        actor.glowMaterial.opacity = energy * 0.26
        actor.branchMaterial.opacity = energy * 0.68
        actor.flashLight.intensity =
          energy * THREE.MathUtils.lerp(28, 95, actor.depth)
        actor.group.rotation.y = Math.sin(index * 2.17) * 0.018
      })
    })
  }

  const addHorizonRails = () => {
    const railLength = roomDepth - 0.8
    const railCenterZ = roomCenterZ + 0.25
    const railMaterials: THREE.ShaderMaterial[] = []

    const createRailMaterial = ({
      opacity,
      brightness,
      falloff,
      phase
    }: {
      opacity: number
      brightness: number
      falloff: number
      phase: number
    }) => {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          surge: { value: 0 },
          color: { value: new THREE.Color(BRIGHT_GREEN) },
          opacity: { value: opacity },
          brightness: { value: brightness },
          falloff: { value: falloff },
          phase: { value: phase }
        },
        vertexShader: /* glsl */ `
          uniform float falloff;
          varying float vFade;
          varying float vRailPosition;

          void main() {
            vRailPosition = clamp(position.z / ${railLength.toFixed(2)} + 0.5, 0.0, 1.0);
            vFade = pow(smoothstep(0.0, 1.0, vRailPosition), falloff);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float time;
          uniform float surge;
          uniform vec3 color;
          uniform float opacity;
          uniform float brightness;
          uniform float phase;
          varying float vFade;
          varying float vRailPosition;

          void main() {
            float breath = 0.91 + sin(time * 0.42 + phase + vRailPosition * 3.2) * 0.09;
            float current = fract(time * 0.035 + phase * 0.07);
            float runner = exp(-pow((vRailPosition - current) * 9.0, 2.0));
            float energy = breath + runner * (0.1 + surge * 0.42) + surge * 0.22;
            float alpha = opacity * max(0.006, vFade) * energy;
            gl_FragColor = vec4(color * brightness * energy, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      })
      railMaterials.push(material)
      return material
    }

    ;[-1, 1].forEach((side, sideIndex) => {
      const railX = side * 13.32
      const core = new THREE.Mesh(
        new THREE.BoxGeometry(0.075, 0.075, railLength),
        createRailMaterial({
          opacity: 0.8,
          brightness: 0.62,
          falloff: 0.72,
          phase: sideIndex * Math.PI
        })
      )
      core.position.set(railX, floorY + 0.082, railCenterZ)

      const floorBloom = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.02, railLength),
        createRailMaterial({
          opacity: 0.11,
          brightness: 0.4,
          falloff: 0.92,
          phase: sideIndex * Math.PI + 0.7
        })
      )
      floorBloom.position.set(railX - side * 0.33, floorY + 0.045, railCenterZ)

      const wallBloom = new THREE.Mesh(
        new THREE.BoxGeometry(0.022, 0.44, railLength),
        createRailMaterial({
          opacity: 0.085,
          brightness: 0.34,
          falloff: 1.02,
          phase: sideIndex * Math.PI + 1.4
        })
      )
      wallBloom.position.set(railX + side * 0.075, floorY + 0.36, railCenterZ)
      group.add(core, floorBloom, wallBloom)
      ;[
        { z: roomNearZ - 7, intensity: 15, distance: 11 },
        { z: centerZ - 5, intensity: 7, distance: 9 },
        { z: roomFarZ + 22, intensity: 2.5, distance: 7 }
      ].forEach(({ z, intensity, distance }, lightIndex) => {
        const light = new THREE.PointLight(GREEN, intensity, distance, 2)
        light.position.set(side * 12.65, floorY + 0.5, z)
        group.add(light)
        wallUpdaters.push((elapsed, surge) => {
          light.intensity =
            intensity *
            (0.86 + Math.sin(elapsed * 0.38 + sideIndex + lightIndex) * 0.08) *
            (1 + surge * 0.3)
        })
      })
    })

    wallUpdaters.push((elapsed, surge) => {
      railMaterials.forEach((material) => {
        material.uniforms.time.value = elapsed
        material.uniforms.surge.value = surge
      })
    })
  }

  if (backWallStudy === 'terminal') addTerminalWall()
  if (backWallStudy === 'matrix-rain') addMatrixRainWall()
  if (backWallStudy === 'server-wall') addServerWall()
  if (backWallStudy === 'aperture') addSignalAperture()
  if (backWallStudy === 'lightning') addDepthLightning({ count: 15 })
  if (backWallStudy === 'wall-lightning') {
    addHorizonRails()
    addHazardLightning()
  }
  if (backWallStudy === 'server-lightning') {
    addServerWall()
    addDepthLightning({ count: 4, restrained: true })
  }

  const groutMaterial = new THREE.MeshStandardMaterial({
    color: 0x030504,
    emissive: 0x020503,
    emissiveIntensity: 0.35,
    metalness: 0.18,
    roughness: 0.94
  })
  const seamGeometryX = new THREE.BoxGeometry(0.052, 0.035, roomDepth)
  const seamGeometryZ = new THREE.BoxGeometry(roomWidth, 0.035, 0.052)
  const seams = new THREE.Group()

  for (let x = -12; x <= 12; x += 3) {
    const seam = new THREE.Mesh(seamGeometryX, groutMaterial)
    seam.position.set(x, floorY + 0.018, roomCenterZ)
    seams.add(seam)
  }
  const seamFarZ = isHorizonRailStudy ? roomFarZ + 1 : centerZ - 17
  const seamNearZ = isHorizonRailStudy ? roomNearZ - 1 : centerZ + 19
  for (let z = seamFarZ; z <= seamNearZ; z += 3) {
    const seam = new THREE.Mesh(seamGeometryZ, groutMaterial)
    seam.position.set(0, floorY + 0.018, z)
    seams.add(seam)
  }
  if (!isHorizonRailStudy) group.add(seams)

  const edgeMaterial = new THREE.MeshBasicMaterial({
    color: 0x26342b,
    transparent: true,
    opacity: 0.17,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  const edgeGeometry = new THREE.BoxGeometry(0.018, 0.018, roomDepth)
  const edgeGlints = isHorizonRailStudy
    ? []
    : [-12, -9, -6, -3, 0, 3, 6, 9, 12].map((x) => {
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial.clone())
        edge.position.set(x + 0.055, floorY + 0.041, roomCenterZ)
        group.add(edge)
        return edge
      })

  const chargeCanvas = document.createElement('canvas')
  chargeCanvas.width = 128
  chargeCanvas.height = 128
  const chargeContext = chargeCanvas.getContext('2d')
  if (chargeContext) {
    const chargeGradient = chargeContext.createRadialGradient(
      64,
      64,
      2,
      64,
      64,
      78
    )
    chargeGradient.addColorStop(0, 'rgba(132, 255, 164, .9)')
    chargeGradient.addColorStop(0.28, 'rgba(54, 255, 108, .34)')
    chargeGradient.addColorStop(0.72, 'rgba(16, 116, 48, .07)')
    chargeGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    chargeContext.fillStyle = chargeGradient
    chargeContext.fillRect(0, 0, 128, 128)
  }
  const chargeTexture = new THREE.CanvasTexture(chargeCanvas)
  chargeTexture.colorSpace = THREE.SRGBColorSpace
  const chargeGeometry = new THREE.PlaneGeometry(2.86, 2.86)
  const tileCharges = Array.from({ length: 18 }, () => {
    const material = new THREE.MeshBasicMaterial({
      map: chargeTexture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(chargeGeometry, material)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set(0, floorY + 0.052, centerZ)
    group.add(mesh)
    return { mesh, material, bornAt: -100 }
  })
  let elapsedTime = 0

  const chargeTile = (x: number, z: number) => {
    const charge = tileCharges.reduce((oldest, candidate) =>
      candidate.bornAt < oldest.bornAt ? candidate : oldest
    )
    const tileX = THREE.MathUtils.clamp(
      Math.floor((x + 12) / 3) * 3 - 10.5,
      -10.5,
      10.5
    )
    const gridStartZ = centerZ - 17
    const tileZ = THREE.MathUtils.clamp(
      gridStartZ + Math.floor((z - gridStartZ) / 3) * 3 + 1.5,
      centerZ - 15.5,
      centerZ + 17.5
    )
    charge.mesh.position.set(tileX, floorY + 0.052, tileZ)
    charge.mesh.rotation.z = (Math.round(tileX + tileZ) % 2) * Math.PI
    charge.bornAt = elapsedTime
  }

  return {
    group,
    update: (elapsed, surge) => {
      elapsedTime = elapsed
      mirrorMaterial.uniforms.time.value = elapsed
      mirrorMaterial.uniforms.surge.value = surge
      wallUpdaters.forEach((updateWall) => updateWall(elapsed, surge))
      edgeGlints.forEach((edge, index) => {
        if (Array.isArray(edge.material)) return
        edge.material.opacity =
          0.08 +
          Math.max(0, Math.sin(elapsed * 0.34 + index * 0.72)) * 0.09 +
          surge * 0.12
      })
      tileCharges.forEach((charge, index) => {
        const age = elapsed - charge.bornAt
        const energy = Math.exp(-Math.max(0, age) * 1.85)
        charge.material.opacity =
          energy * (0.18 + surge * 0.1) * (0.92 + (index % 3) * 0.04)
        const scale = 0.94 + energy * 0.06
        charge.mesh.scale.setScalar(scale)
      })
    },
    onGlyphEmerge: chargeTile,
    dispose: () => {
      mirror.dispose()
      chargeTexture.dispose()
      wallTextures.forEach((texture) => texture.dispose())
    }
  }
}

export function createChamberArtifact(
  environment: ChamberEnvironment,
  floorY: number,
  centerZ: number,
  blackGlassBackWall: BlackGlassBackWallStudy = 'baseline'
): ChamberArtifact | null {
  if (environment === 'relic') return createRelic(floorY, centerZ)
  if (environment === 'reactor') return createReactor(floorY, centerZ)
  if (environment === 'invocation') return createInvocation(floorY, centerZ)
  if (environment === 'cyber') return createCyberVault(floorY, centerZ)
  if (environment === 'black-glass')
    return createBlackGlassFloor(floorY, centerZ, blackGlassBackWall)
  return null
}
