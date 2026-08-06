'use client'

import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import * as THREE from 'three'

import type { SignalMask, SignalState } from './signal-types'
import styles from './signal-field.module.css'

/* ------------------------------------------------------------------ */
/* shaders                                                            */
/* ------------------------------------------------------------------ */

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                 + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                          dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * snoise(p);
    p = p * 2.03 + 17.3;
    a *= 0.5;
  }
  return v;
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
`

/**
 * Advection / feedback pass. Each frame the previous frame is dragged along a
 * curl-noise flow field, decayed, and re-lit by the mask texture. The mask is
 * sampled through a noise displacement scaled by (1 - reveal), so at reveal = 0
 * the text is smeared into pure static and at reveal = 1 it locks into place.
 */
const SIM_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform sampler2D uPrev;
uniform sampler2D uMask;
uniform vec2  uRes;
uniform float uAspect;
uniform float uTime;
uniform float uDt;
uniform float uReveal;
uniform float uEnergy;
uniform float uSeed;
uniform int   uAttrCount;
uniform vec3  uAttr[8];

${NOISE}

vec2 curl(vec2 p, float t) {
  float e = 0.06;
  float n1 = fbm(vec2(p.x, p.y + e) * 1.15 + vec2(0.0, t * 0.05));
  float n2 = fbm(vec2(p.x, p.y - e) * 1.15 + vec2(0.0, t * 0.05));
  float n3 = fbm(vec2(p.x + e, p.y) * 1.15 + vec2(0.0, t * 0.05));
  float n4 = fbm(vec2(p.x - e, p.y) * 1.15 + vec2(0.0, t * 0.05));
  return vec2(n1 - n2, -(n3 - n4)) / (2.0 * e);
}

void main() {
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);

  float calm = uReveal;
  float chaos = 1.0 - calm;

  vec2 flow = curl(p + uSeed, uTime) * (0.030 + 0.105 * chaos + 0.07 * uEnergy);
  flow += vec2(0.008 + 0.026 * chaos, -0.004);

  for (int i = 0; i < 8; i++) {
    if (i >= uAttrCount) break;
    vec3 a = uAttr[i];
    vec2 ap = (a.xy - 0.5) * vec2(uAspect, 1.0);
    vec2 d = ap - p;
    float r = max(length(d), 0.0015);
    float w = a.z * exp(-r * r * 9.0);
    vec2 dir = d / r;
    flow += (dir * 0.55 + vec2(-dir.y, dir.x) * 1.15) * w * (0.4 + 0.6 * uEnergy);
  }

  vec2 src = uv - flow * uDt / vec2(uAspect, 1.0);
  vec4 prev = texture2D(uPrev, clamp(src, vec2(0.001), vec2(0.999)));

  float v = prev.r * (0.9405 + 0.0245 * chaos);
  float hue = prev.g;

  /* mask emission, displaced while unresolved */
  vec2 warp = vec2(
    fbm(p * 2.1 + uSeed + uTime * 0.06),
    fbm(p * 2.1 - uSeed - uTime * 0.05)
  );
  float jitter = hash21(uv * uRes + floor(uTime * 24.0)) - 0.5;
  vec2 muv = uv + warp * chaos * 0.16 + jitter * chaos * 0.03;
  float m = texture2D(uMask, clamp(muv, vec2(0.0), vec2(1.0))).r;
  float emit = m * (0.05 + 0.235 * calm);
  v += emit;
  hue = mix(hue, 0.0, min(emit * 6.0, 0.9));

  /* attractor emission */
  for (int i = 0; i < 8; i++) {
    if (i >= uAttrCount) break;
    vec3 a = uAttr[i];
    vec2 ap = (a.xy - 0.5) * vec2(uAspect, 1.0);
    float r = length(ap - p);
    float glow = a.z * exp(-r * r * 260.0) * 0.42;
    v += glow;
    hue = mix(hue, 0.35, min(glow * 5.0, 0.8));
  }

  /* noise floor: the carrier before it is tuned in */
  float st = hash21(uv * uRes * 0.5 + floor(uTime * 30.0) * 1.37 + uSeed);
  float sparkle = step(0.9968 - 0.016 * chaos, st);
  v += sparkle * (0.07 + 0.44 * chaos);
  hue = mix(hue, 1.0, sparkle * 0.85);

  gl_FragColor = vec4(clamp(v, 0.0, 1.0), clamp(hue, 0.0, 1.0), 0.0, 1.0);
}
`

const PRESENT_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;

uniform sampler2D uSim;
uniform vec2 uTexel;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uCore;
uniform float uOpacity;
uniform float uGamma;
uniform float uVignette;
uniform float uCoreLo;

void main() {
  vec2 o = uTexel * 1.5;
  vec4 c = texture2D(uSim, vUv) * 0.36;
  c += texture2D(uSim, vUv + vec2( o.x, 0.0)) * 0.16;
  c += texture2D(uSim, vUv + vec2(-o.x, 0.0)) * 0.16;
  c += texture2D(uSim, vUv + vec2(0.0,  o.y)) * 0.16;
  c += texture2D(uSim, vUv + vec2(0.0, -o.y)) * 0.16;

  float v = clamp(c.r, 0.0, 1.0);
  float hue = clamp(c.g, 0.0, 1.0);

  vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 1.0, hue));
  col = mix(col, uCore, smoothstep(uCoreLo, 1.0, v));

  float d = distance(vUv, vec2(0.5, 0.48));
  float vig = mix(1.0, smoothstep(0.95, 0.18, d), uVignette);

  float a = pow(v, uGamma) * uOpacity * vig;
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
}
`

/* ------------------------------------------------------------------ */
/* mask rasteriser — typography becomes the emitter                    */
/* ------------------------------------------------------------------ */

const MASK_W = 900

function drawMask(canvas: HTMLCanvasElement, mask: SignalMask, aspect: number) {
  const w = MASK_W
  const h = Math.max(180, Math.round(MASK_W / Math.max(aspect, 0.35)))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, w, h)

  if (mask.nodes?.length) {
    ctx.lineCap = 'round'
    for (const [a, b] of mask.links ?? []) {
      const na = mask.nodes[a]
      const nb = mask.nodes[b]
      if (!na || !nb) continue
      const strength = Math.min(na.weight, nb.weight)
      ctx.strokeStyle = `rgba(255,255,255,${0.16 + strength * 0.55})`
      ctx.lineWidth = 1.8 + strength * 3.2
      ctx.beginPath()
      ctx.moveTo(na.x * w, na.y * h)
      ctx.lineTo(nb.x * w, nb.y * h)
      ctx.stroke()
    }
    for (const node of mask.nodes) {
      const r = 7 + node.weight * 30
      const grad = ctx.createRadialGradient(
        node.x * w,
        node.y * h,
        0,
        node.x * w,
        node.y * h,
        r
      )
      grad.addColorStop(0, `rgba(255,255,255,${0.65 + node.weight * 0.35})`)
      grad.addColorStop(0.32, `rgba(255,255,255,${0.22 + node.weight * 0.4})`)
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(node.x * w, node.y * h, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const word = mask.text?.trim()
  if (word) {
    const family =
      '"Helvetica Neue", Helvetica, Arial, "Segoe UI", system-ui, sans-serif'
    let size = Math.round(h * 0.34 * (mask.scale ?? 1))
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(ctx as any).letterSpacing = '0.07em'
    } catch {
      /* letterSpacing unsupported — tracking is cosmetic */
    }
    for (let i = 0; i < 14; i++) {
      ctx.font = `800 ${size}px ${family}`
      const measured = ctx.measureText(word).width
      if (measured <= w * 0.84 || size <= 14) break
      size = Math.round(size * Math.min(0.94, (w * 0.84) / measured))
    }
    const cx = w * (0.5 + (mask.ox ?? 0))
    const cy = h * (0.5 + (mask.oy ?? 0)) - (mask.caption ? h * 0.04 : 0)
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.fillText(word, cx, cy)

    if (mask.caption) {
      ctx.font = `500 ${Math.max(11, Math.round(size * 0.13))}px ui-monospace, "SF Mono", Menlo, monospace`
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.fillText(mask.caption.toUpperCase(), cx, cy + size * 0.72)
    }
  }
}

/* ------------------------------------------------------------------ */
/* palettes                                                            */
/* ------------------------------------------------------------------ */

const rgb = (hex: string) =>
  new THREE.Vector3(
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255
  )

type Palette = {
  a: THREE.Vector3
  b: THREE.Vector3
  core: THREE.Vector3
  opacity: number
  gamma: number
  vignette: number
  coreLo: number
}

const PALETTE: Record<'dark' | 'light', Palette> = {
  dark: {
    a: rgb('#3ad0bd'),
    b: rgb('#6f63f0'),
    core: rgb('#ecfffb'),
    opacity: 0.92,
    gamma: 1.05,
    vignette: 0.55,
    coreLo: 0.42
  },
  light: {
    a: rgb('#0a7f6c'),
    b: rgb('#3a32ab'),
    core: rgb('#101c26'),
    opacity: 0.52,
    gamma: 1.3,
    vignette: 0.22,
    coreLo: 0.66
  }
}

/* ------------------------------------------------------------------ */
/* component                                                           */
/* ------------------------------------------------------------------ */

type Props = {
  stateRef: MutableRefObject<SignalState>
  mask: SignalMask
  className?: string
  /** multiplies the presented opacity, for quieter sections */
  gain?: number
}

export default function SignalField({
  stateRef,
  mask,
  className,
  gain = 1
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const maskRef = useRef<SignalMask>(mask)
  const gainRef = useRef(gain)
  const apiRef = useRef<{
    redrawMask: () => void
    setGain: (g: number) => void
  } | null>(null)

  maskRef.current = mask
  gainRef.current = gain

  useEffect(() => {
    apiRef.current?.redrawMask()
  }, [mask])

  useEffect(() => {
    apiRef.current?.setGain(gain)
  }, [gain])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
      })
    } catch {
      host.dataset.failed = 'true'
      return
    }
    if (!renderer.getContext()) {
      host.dataset.failed = 'true'
      return
    }

    renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    const canvas = renderer.domElement
    canvas.className = styles.canvas
    canvas.setAttribute('aria-hidden', 'true')
    host.appendChild(canvas)
    host.dataset.ready = 'true'

    const maskCanvas = document.createElement('canvas')
    const maskTexture = new THREE.CanvasTexture(maskCanvas)
    maskTexture.colorSpace = THREE.NoColorSpace
    maskTexture.minFilter = THREE.LinearFilter
    maskTexture.magFilter = THREE.LinearFilter
    maskTexture.wrapS = THREE.ClampToEdgeWrapping
    maskTexture.wrapT = THREE.ClampToEdgeWrapping

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new THREE.PlaneGeometry(2, 2)

    const attrs = Array.from({ length: 8 }, () => new THREE.Vector3())

    const simMaterial = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: SIM_FRAG,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uPrev: { value: null as THREE.Texture | null },
        uMask: { value: maskTexture },
        uRes: { value: new THREE.Vector2(1, 1) },
        uAspect: { value: 1 },
        uTime: { value: 0 },
        uDt: { value: 1 },
        uReveal: { value: 0 },
        uEnergy: { value: 0 },
        uSeed: { value: Math.random() * 40 },
        uAttrCount: { value: 0 },
        uAttr: { value: attrs }
      }
    })

    const presentMaterial = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: PRESENT_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uSim: { value: null as THREE.Texture | null },
        uTexel: { value: new THREE.Vector2(1, 1) },
        uColorA: { value: PALETTE.dark.a.clone() },
        uColorB: { value: PALETTE.dark.b.clone() },
        uCore: { value: PALETTE.dark.core.clone() },
        uOpacity: { value: PALETTE.dark.opacity },
        uGamma: { value: PALETTE.dark.gamma },
        uVignette: { value: PALETTE.dark.vignette },
        uCoreLo: { value: PALETTE.dark.coreLo }
      }
    })

    const simScene = new THREE.Scene()
    simScene.add(new THREE.Mesh(geometry, simMaterial))
    const presentScene = new THREE.Scene()
    presentScene.add(new THREE.Mesh(geometry, presentMaterial))

    const makeTarget = (w: number, h: number) =>
      new THREE.WebGLRenderTarget(w, h, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        depthBuffer: false,
        stencilBuffer: false,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping
      })

    let targets: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget] = [
      makeTarget(2, 2),
      makeTarget(2, 2)
    ]
    let ping = 0
    let aspect = 1
    let baseOpacity = PALETTE.dark.opacity

    const redrawMask = () => {
      drawMask(maskCanvas, maskRef.current, aspect)
      maskTexture.needsUpdate = true
    }

    const applyTheme = () => {
      const isLight = !document.documentElement.classList.contains('dark')
      const p = isLight ? PALETTE.light : PALETTE.dark
      presentMaterial.uniforms.uColorA.value.copy(p.a)
      presentMaterial.uniforms.uColorB.value.copy(p.b)
      presentMaterial.uniforms.uCore.value.copy(p.core)
      presentMaterial.uniforms.uGamma.value = p.gamma
      presentMaterial.uniforms.uVignette.value = p.vignette
      presentMaterial.uniforms.uCoreLo.value = p.coreLo
      baseOpacity = p.opacity
      presentMaterial.uniforms.uOpacity.value = baseOpacity * gainRef.current
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width))
      const h = Math.max(1, Math.round(rect.height))
      aspect = w / h

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      renderer.setPixelRatio(dpr)
      renderer.setSize(w, h, false)

      // the feedback buffer runs well below display resolution: silky, cheap
      const simW = Math.max(240, Math.min(760, Math.round(w * 0.5)))
      const simH = Math.max(160, Math.round(simW / Math.max(aspect, 0.35)))
      if (targets[0].width !== simW || targets[0].height !== simH) {
        targets.forEach((t) => t.dispose())
        targets = [makeTarget(simW, simH), makeTarget(simW, simH)]
      }
      simMaterial.uniforms.uRes.value.set(simW, simH)
      simMaterial.uniforms.uAspect.value = aspect
      presentMaterial.uniforms.uTexel.value.set(1 / simW, 1 / simH)
      redrawMask()
    }

    apiRef.current = {
      redrawMask: () => {
        redrawMask()
      },
      setGain: (g: number) => {
        presentMaterial.uniforms.uOpacity.value = baseOpacity * g
      }
    }

    applyTheme()
    resize()

    const themeObserver = new MutationObserver(applyTheme)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)

    let visible = true
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting)
      },
      { rootMargin: '120px' }
    )
    io.observe(host)

    let raf = 0
    let last = performance.now()
    let clock = 0
    let smoothReveal = 0
    let smoothEnergy = 0
    let warm = reduced ? 0 : 0

    const step = (dtSeconds: number) => {
      const state = stateRef.current
      const dt = Math.min(dtSeconds, 1 / 30)
      clock += dt
      smoothReveal += (state.reveal - smoothReveal) * Math.min(1, dt * 3.2)
      smoothEnergy += (state.energy - smoothEnergy) * Math.min(1, dt * 4.5)

      simMaterial.uniforms.uTime.value = clock
      simMaterial.uniforms.uDt.value = dt * 60 * 0.016
      simMaterial.uniforms.uReveal.value = smoothReveal
      simMaterial.uniforms.uEnergy.value = smoothEnergy

      const list = state.attractors
      const count = Math.min(list.length, 8)
      for (let i = 0; i < count; i++) {
        attrs[i].set(list[i].x, 1 - list[i].y, list[i].strength)
      }
      simMaterial.uniforms.uAttrCount.value = count

      const read = targets[ping]
      const write = targets[1 - ping]
      simMaterial.uniforms.uPrev.value = read.texture
      renderer.setRenderTarget(write)
      renderer.render(simScene, camera)
      renderer.setRenderTarget(null)
      ping = 1 - ping

      presentMaterial.uniforms.uSim.value = write.texture
      renderer.render(presentScene, camera)
    }

    if (reduced) {
      // Settle to a still, fully-resolved frame — no animation loop at all.
      stateRef.current.reveal = 1
      smoothReveal = 1
      for (let i = 0; i < 90; i++) step(1 / 60)
      const settle = () => {
        smoothReveal = 1
        for (let i = 0; i < 40; i++) step(1 / 60)
      }
      apiRef.current = {
        redrawMask: () => {
          redrawMask()
          settle()
        },
        setGain: (g: number) => {
          presentMaterial.uniforms.uOpacity.value = baseOpacity * g
          renderer.render(presentScene, camera)
        }
      }
    } else {
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop)
        const dt = (now - last) / 1000
        last = now
        if (!visible || document.hidden) return
        if (warm < 45) {
          warm += 1
          step(1 / 60)
        }
        step(dt || 1 / 60)
      }
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      resizeObserver.disconnect()
      themeObserver.disconnect()
      apiRef.current = null
      targets.forEach((t) => t.dispose())
      geometry.dispose()
      simMaterial.dispose()
      presentMaterial.dispose()
      maskTexture.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={hostRef}
      className={`${styles.host} ${className ?? ''}`}
      aria-hidden="true"
    />
  )
}
