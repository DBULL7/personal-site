import type { ChamberEnvironment } from '@/components/space/chamber-artifacts'

export type ChamberVariant = Exclude<ChamberEnvironment, 'standard'>

type ChamberConfig = {
  index: string
  code: string
  name: string
  artifact: string
  status: string
  instruction: string
  description: string
}

export const chamberConfigs: Record<ChamberVariant, ChamberConfig> = {
  relic: {
    index: 'A',
    code: 'RELIC_TERMINAL',
    name: 'The Relic Terminal',
    artifact: 'LEGENDARY_CONSOLE',
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
    status: 'SELF_SUSTAINING',
    instruction: 'CLICK THE FLOOR TO SURGE',
    description:
      'The chamber is powered from below. Symbols rise as visible exhaust from a core that pulses through the architecture.'
  },
  invocation: {
    index: 'C',
    code: 'INVOCATION_RING',
    name: 'The Invocation Ring',
    artifact: 'ACTIVE_SIGIL',
    status: 'FIELD_OPEN',
    instruction: 'CLICK THE FIELD TO INVOKE',
    description:
      'A precise floor language turns identity into ritual. The ring gathers energy, releases it, and keeps the room alive.'
  }
}
