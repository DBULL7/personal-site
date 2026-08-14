import type {
  BlackGlassBackWallStudy,
  ChamberEnvironment
} from '@/components/space/chamber-artifacts'

export type ChamberVariant = Exclude<ChamberEnvironment, 'standard'>

export type ChamberConfig = {
  index: string
  code: string
  name: string
  artifact: string
  setting: string
  status: string
  instruction: string
  description: string
}

export const blackGlassStudies = [
  'baseline',
  'lightning',
  'wall-lightning',
  'terminal',
  'matrix-rain',
  'server-wall',
  'aperture',
  'server-lightning'
] as const satisfies readonly BlackGlassBackWallStudy[]

export type BlackGlassStudy = (typeof blackGlassStudies)[number]

export const blackGlassStudyConfigs: Record<
  BlackGlassStudy,
  ChamberConfig & { shortLabel: string }
> = {
  baseline: {
    index: 'F',
    code: 'BLACK_GLASS',
    shortLabel: 'BASE',
    name: 'The Black Glass',
    artifact: 'SUBSURFACE_FIELD',
    setting: 'INFINITE BLACK GLASS',
    status: 'SURFACE_ONLINE',
    instruction: 'CLICK TO DISTURB THE GLASS',
    description:
      'The field exists twice: first beneath the glass, then in the room. Each breach charges the tile while the reflection mutates and bends below it.'
  },
  lightning: {
    index: 'F1',
    code: 'DEPTH_STORM',
    shortLabel: 'STORM',
    name: 'Depth Storm',
    artifact: 'SCALED_DISCHARGE_FIELD',
    setting: 'FULL DEPTH LIGHTNING',
    status: 'STORM_ACTIVE',
    instruction: 'CLICK TO SURGE THE STORM',
    description:
      'A field of green discharges maps the chamber in depth: short, narrow strikes break at the horizon while towering bolts ignite closer to the glass.'
  },
  'wall-lightning': {
    index: 'F2',
    code: 'HORIZON_RAILS',
    shortLabel: 'RAIL',
    name: 'Horizon Rails',
    artifact: 'ALIEN_GUIDE_ARRAY',
    setting: 'EXTENDED BLACK LANDSCAPE',
    status: 'HORIZON_LOCKED',
    instruction: 'CLICK TO CHARGE THE RAILS',
    description:
      'Two luminous rails hold the floor-wall seam, throwing green light across the glass before fading toward a remote vanishing point.'
  },
  terminal: {
    index: 'F3',
    code: 'GHOST_TERMINAL',
    shortLabel: 'TERM',
    name: 'Ghost Terminal',
    artifact: 'AUTONOMOUS_SHELL',
    setting: 'TERMINAL FAR WALL',
    status: 'SESSION_OPEN',
    instruction: 'WATCH THE SESSION RESTART',
    description:
      'A monumental terminal quietly inspects the field, types a sparse sequence, and restarts without taking over the chamber.'
  },
  'matrix-rain': {
    index: 'F4',
    code: 'RAIN_WALL',
    shortLabel: 'RAIN',
    name: 'Matrix Rain',
    artifact: 'VERTICAL_CODE_FIELD',
    setting: 'RAIN BEHIND GLASS',
    status: 'STREAMING',
    instruction: 'CLICK TO INTENSIFY THE FIELD',
    description:
      'A slow veil of code descends behind the far wall while the software glyphs continue rising through the floor in opposition.'
  },
  'server-wall': {
    index: 'F5',
    code: 'SERVER_MONOLITH',
    shortLabel: 'RACK',
    name: 'Server Monolith',
    artifact: 'MACHINE_ARCHITECTURE',
    setting: 'SEVEN SERVER BAYS',
    status: 'RACKS_ONLINE',
    instruction: 'CLICK TO SURGE THE RACKS',
    description:
      'Seven black server bays turn the far wall into physical infrastructure, using scale and restrained status light instead of spectacle.'
  },
  aperture: {
    index: 'F6',
    code: 'SIGNAL_APERTURE',
    shortLabel: 'SEAM',
    name: 'Signal Aperture',
    artifact: 'VERTICAL_THRESHOLD',
    setting: 'OPEN SIGNAL SEAM',
    status: 'THRESHOLD_OPEN',
    instruction: 'CLICK TO OPEN THE SIGNAL',
    description:
      'A narrow vertical seam suggests a much larger machine beyond the chamber, projecting one severe line into the glass floor.'
  },
  'server-lightning': {
    index: 'F7',
    code: 'STORM_RACK',
    shortLabel: 'DUAL',
    name: 'Storm Rack',
    artifact: 'CHARGED_INFRASTRUCTURE',
    setting: 'SERVER WALL / DISCHARGE',
    status: 'LOAD_UNSTABLE',
    instruction: 'CLICK TO OVERLOAD THE WALL',
    description:
      'The strongest intentional pairing: monolithic server architecture gains rare upward discharges that expose its scale for a fraction of a second.'
  }
}

export const chamberConfigs: Record<ChamberVariant, ChamberConfig> = {
  relic: {
    index: 'A',
    code: 'RELIC_TERMINAL',
    name: 'The Relic Terminal',
    artifact: 'LEGENDARY_CONSOLE',
    setting: 'DARK CHAMBER',
    status: 'AWAITING_INPUT',
    instruction: 'PRESS ANY KEY TO CHARGE',
    description:
      'A dormant instrument waits above the floor. Every command feeds the field and turns software into something physical.'
  },
  reactor: {
    index: 'B',
    code: 'GLYPH_REACTOR',
    name: 'The Glyph Reactor',
    artifact: 'SUBFLOOR_CORE',
    setting: 'POWER CHAMBER',
    status: 'SELF_SUSTAINING',
    instruction: 'CLICK THE FLOOR TO SURGE',
    description:
      'The chamber is powered from below. Symbols rise as visible exhaust from a core that pulses through the architecture.'
  },
  invocation: {
    index: 'C',
    code: 'INVOCATION_SIGIL',
    name: 'The Invocation Sigil',
    artifact: 'ACTIVE_SIGIL',
    setting: 'RITUAL CHAMBER',
    status: 'FIELD_OPEN',
    instruction: 'CLICK THE FIELD TO INVOKE',
    description:
      'A precise floor language turns identity into ritual. The sigil gathers energy, releases it, and keeps the room alive.'
  },
  cyber: {
    index: 'D',
    code: 'CYBER_VAULT',
    name: 'The Cyber Vault',
    artifact: 'LIVING_INFRASTRUCTURE',
    setting: 'MACHINE CORRIDOR',
    status: 'SYSTEMS_AWAKE',
    instruction: 'MOVE TO SHIFT PERSPECTIVE',
    description:
      'A machine-scale corridor turns the field into architecture: software rises between server monoliths, overhead conduits, and moving data planes.'
  },
  castle: {
    index: 'E',
    code: 'SWORD_COURT',
    name: 'The Sword Court',
    artifact: 'SWORD_IN_STONE',
    setting: 'CASTLE COURTYARD',
    status: 'RELIC_AWAKENING',
    instruction: 'CLICK THE FIELD TO AWAKEN',
    description:
      'An ancient courtyard makes the software field feel discovered rather than engineered. The sword waits while modern tools rise like dormant power.'
  },
  'black-glass': {
    index: 'F',
    code: 'BLACK_GLASS',
    name: 'The Black Glass',
    artifact: 'SUBSURFACE_FIELD',
    setting: 'INFINITE BLACK GLASS',
    status: 'SURFACE_ONLINE',
    instruction: 'CLICK TO DISTURB THE GLASS',
    description:
      'The field exists twice: first beneath the glass, then in the room. Each breach charges the tile while the reflection mutates and bends below it.'
  }
}
