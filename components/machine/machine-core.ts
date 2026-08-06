'use client'

import { useEffect, useState } from 'react'
import * as THREE from 'three'

export type MachineTheme = 'dark' | 'light'

export type MachinePalette = {
  clear: number
  board: number
  boardEdge: number
  silk: string
  silkFaint: string
  soldermask: string
  copper: string
  copperLit: string
  pour: string
  chip: number
  chipMark: string
  chipBody: string
  metal: number
  gold: number
  signal: number
  signalCss: string
  warn: number
  fault: number
  ok: number
  labelBg: string
  labelInk: string
}

export const machinePalettes: Record<MachineTheme, MachinePalette> = {
  dark: {
    clear: 0x080d0f,
    board: 0x0e2a27,
    boardEdge: 0x1d2b26,
    silk: 'rgba(226, 240, 235, 0.92)',
    silkFaint: 'rgba(226, 240, 235, 0.34)',
    soldermask: '#0d2b28',
    copper: 'rgba(190, 146, 74, 0.55)',
    copperLit: 'rgba(134, 240, 210, 0.9)',
    pour: 'rgba(120, 200, 180, 0.07)',
    chip: 0x14191b,
    chipMark: 'rgba(214, 232, 226, 0.86)',
    chipBody: '#14191b',
    metal: 0x8d9a9c,
    gold: 0xd6ac5e,
    signal: 0x86f0d2,
    signalCss: '#86f0d2',
    warn: 0xf0b45a,
    fault: 0xff6b57,
    ok: 0x6fe0a8,
    labelBg: 'rgba(8, 13, 15, 0.82)',
    labelInk: '#dcebe6'
  },
  light: {
    clear: 0xf1ebe0,
    board: 0x123c37,
    boardEdge: 0x2b3a33,
    silk: 'rgba(240, 246, 242, 0.95)',
    silkFaint: 'rgba(240, 246, 242, 0.4)',
    soldermask: '#123c37',
    copper: 'rgba(219, 176, 100, 0.62)',
    copperLit: 'rgba(150, 255, 222, 0.95)',
    pour: 'rgba(150, 220, 200, 0.09)',
    chip: 0x1b2224,
    chipMark: 'rgba(226, 238, 233, 0.9)',
    chipBody: '#1b2224',
    metal: 0x9aa6a6,
    gold: 0xc99a45,
    signal: 0x0e7f68,
    signalCss: '#0e7f68',
    warn: 0xb5691a,
    fault: 0xb8402c,
    ok: 0x1c7a52,
    labelBg: 'rgba(246, 241, 232, 0.9)',
    labelInk: '#16211f'
  }
}

/**
 * Tracks the document theme class written by next-themes (`.dark` / `.light`),
 * falling back to the OS preference when no class is present.
 */
export function useMachineTheme(): MachineTheme {
  const [theme, setTheme] = useState<MachineTheme>('dark')

  useEffect(() => {
    const root = document.documentElement
    const read = (): MachineTheme => {
      if (root.classList.contains('dark')) return 'dark'
      if (root.classList.contains('light')) return 'light'
      return window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
    }
    setTheme(read())
    const observer = new MutationObserver(() => setTheme(read()))
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return theme
}

/** True when the visitor asked for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const handle = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', handle)
    return () => query.removeEventListener('change', handle)
  }, [])

  return reduced
}

/** Cheap WebGL capability probe, evaluated once after mount. */
export function useWebglSupported(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      setSupported(
        Boolean(
          canvas.getContext('webgl2') ||
            canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl')
        )
      )
    } catch {
      setSupported(false)
    }
  }, [])

  return supported
}

export function makeCanvasTexture(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D) => void
) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (context) draw(context)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export function monoFont(size: number, weight = 600) {
  return `${weight} ${size}px ui-monospace, SFMono-Regular, Menlo, monospace`
}

/** Recursively disposes geometries, materials and their textures. */
export function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as Partial<THREE.Mesh> & Partial<THREE.Sprite>
    if (mesh.geometry) mesh.geometry.dispose()
    const material = mesh.material
    if (!material) return
    const list = Array.isArray(material) ? material : [material]
    list.forEach((entry) => {
      Object.values(entry).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose()
      })
      entry.dispose()
    })
  })
}

/** Deterministic RNG so silkscreen art and instanced parts always match. */
export function seededRandom(seed: number) {
  let value = seed % 2147483647
  if (value <= 0) value += 2147483646
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}
