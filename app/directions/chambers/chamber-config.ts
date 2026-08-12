import type { ChamberEnvironment } from '@/components/space/chamber-artifacts'

export type ChamberVariant = Exclude<ChamberEnvironment, 'standard'>

type ChamberConfig = {
  index: string
  code: string
  name: string
  artifact: string
  setting: string
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
  }
}
