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
  centerZ: number
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
  const mirror = new Reflector(new THREE.PlaneGeometry(27, 38), {
    color: 0x7c827e,
    textureWidth: reflectionSize,
    textureHeight: reflectionSize,
    clipBias: 0.0025,
    multisample: window.innerWidth < 700 ? 0 : 2,
    shader: blackGlassShader
  })
  mirror.rotation.x = -Math.PI / 2
  mirror.position.set(0, floorY, centerZ + 1)
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
  const roomCenterZ = centerZ + 1
  const roomCenterY = floorY + 7.55
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(38, 15.1),
    roomMaterial
  )
  leftWall.rotation.y = Math.PI / 2
  leftWall.position.set(-13.45, roomCenterY, roomCenterZ)
  const rightWall = leftWall.clone()
  rightWall.rotation.y = -Math.PI / 2
  rightWall.position.x = 13.45
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(27, 38), roomMaterial)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.set(0, floorY + 15.1, roomCenterZ)
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(27, 15.1),
    roomMaterial
  )
  backWall.position.set(0, roomCenterY, centerZ - 18)
  group.add(leftWall, rightWall, ceiling, backWall)

  const groutMaterial = new THREE.MeshStandardMaterial({
    color: 0x030504,
    emissive: 0x020503,
    emissiveIntensity: 0.35,
    metalness: 0.18,
    roughness: 0.94
  })
  const seamGeometryX = new THREE.BoxGeometry(0.052, 0.035, 38)
  const seamGeometryZ = new THREE.BoxGeometry(27, 0.035, 0.052)
  const seams = new THREE.Group()

  for (let x = -12; x <= 12; x += 3) {
    const seam = new THREE.Mesh(seamGeometryX, groutMaterial)
    seam.position.set(x, floorY + 0.018, centerZ + 1)
    seams.add(seam)
  }
  for (let z = centerZ - 17; z <= centerZ + 19; z += 3) {
    const seam = new THREE.Mesh(seamGeometryZ, groutMaterial)
    seam.position.set(0, floorY + 0.018, z)
    seams.add(seam)
  }
  group.add(seams)

  const edgeMaterial = new THREE.MeshBasicMaterial({
    color: 0x26342b,
    transparent: true,
    opacity: 0.17,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
  const edgeGeometry = new THREE.BoxGeometry(0.018, 0.018, 38)
  const edgeGlints = [-12, -9, -6, -3, 0, 3, 6, 9, 12].map((x) => {
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial.clone())
    edge.position.set(x + 0.055, floorY + 0.041, centerZ + 1)
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
  if (environment === 'cyber') return createCyberVault(floorY, centerZ)
  if (environment === 'black-glass')
    return createBlackGlassFloor(floorY, centerZ)
  return null
}
