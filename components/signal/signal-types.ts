export type SignalNode = {
  /** normalised 0..1 horizontal position within the field */
  x: number
  /** normalised 0..1 vertical position within the field */
  y: number
  /** 0..1 emission weight */
  weight: number
}

export type SignalMask = {
  /** big word burned into the field; the field emits from its glyphs */
  text?: string
  /** small caption burned under the word */
  caption?: string
  /** point emitters — used by the systems topology */
  nodes?: SignalNode[]
  /** index pairs describing links between nodes */
  links?: [number, number][]
  /** normalised offset of the burned word from centre, -0.5..0.5 */
  ox?: number
  oy?: number
  /** relative scale of the burned word */
  scale?: number
}

export type SignalAttractor = {
  x: number
  y: number
  /** pull + emission strength, 0..1 */
  strength: number
  /** rotational bias, -1..1 */
  spin: number
}

export type SignalState = {
  /** 0 = pure noise, 1 = fully locked signal */
  reveal: number
  /** extra turbulence injected by interaction, 0..1 */
  energy: number
  attractors: SignalAttractor[]
}

export const createSignalState = (): SignalState => ({
  reveal: 0,
  energy: 0,
  attractors: []
})
