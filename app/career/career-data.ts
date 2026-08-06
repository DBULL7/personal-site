// Career content for /career. Every fact here comes from Devon's own resumes.
// TODO(devon): the resume of record ends in 2022. Confirm current title/level and
// what client work has happened since Chick-fil-A, then extend SLOT 03 and add slots.
// TODO(devon): confirm there is no NDA problem naming Apple and Chick-fil-A here.
// TODO(devon): decide whether to link a current resume PDF from the OUTPUT slot.

export type Meter = {
  label: string
  from: number
  to: number
  prefix?: string
  suffix?: string
  decimals?: number
  note: string
}

export type RackUnit = {
  id: string
  slot: string
  org: string
  window: string
  role: string
  face: string[]
  headline: string
  body: string
  meter: Meter
  metrics: { label: string; value: string }[]
  stack: string[]
  /** Patch cables out of this unit. */
  net: string[]
  links?: { label: string; href: string }[]
  wave: 'ramp' | 'clock' | 'burst' | 'packet' | 'rail' | 'handshake' | 'pwm'
}

export const rackUnits: RackUnit[] = [
  {
    id: 'haller',
    slot: '01',
    org: 'Haller',
    window: '2015',
    role: 'Founder unit · COO',
    face: ['HALLER', 'COO / FOUNDER'],
    headline: 'I built the prototype before I could build software.',
    body: 'Haller started as a business plan I wrote and pitched into a startup accelerator — and got in. There was no engineer on the team, so I taught myself Sketch and enough Swift to build the prototype myself. That is where the operator became the builder: the fastest way to learn whether an idea is real is to make the thing and put it in front of someone.',
    meter: {
      label: 'Engineers on staff',
      from: 0,
      to: 1,
      note: 'Zero, then me. Accepted into a business accelerator.'
    },
    metrics: [
      { label: 'Role', value: 'COO, co-founder' },
      { label: 'Outcome', value: 'Accepted into a business accelerator' },
      { label: 'Built', value: 'Prototype, self-taught Sketch + Swift' },
      { label: 'Year', value: '2015' }
    ],
    stack: ['Sketch', 'Swift (basic)', 'Business plan', 'Pitching'],
    net: ['turing'],
    wave: 'ramp'
  },
  {
    id: 'turing',
    slot: '02',
    org: 'Turing School',
    window: '2017',
    role: 'Retune · economics → engineering',
    face: ['TURING SCHOOL', 'FE DEV'],
    headline: 'No CS degree. That is a feature.',
    body: 'B.A. Economics from the University of Kansas in 2015, property management before that, a startup after it, then Turing School of Software and Design in 2017 for front-end development. I came into engineering through the business door, which is why I still ask what a feature is worth before I ask how it should be built. In parallel I freelanced: rewriting U-Hoops from a WordPress site into React/Redux with an Express and MongoDB backend, plus accounts, tour management and a message board.',
    meter: {
      label: 'Computer science degrees',
      from: 0,
      to: 0,
      note: 'Meter reads zero on purpose. B.A. Economics, Kansas 2015 · Turing 2017.'
    },
    metrics: [
      { label: 'Program', value: 'Turing School of Software and Design, 2017' },
      { label: 'Degree', value: 'B.A. Economics, University of Kansas, 2015' },
      {
        label: 'Freelance',
        value: 'U-Hoops — WordPress → React/Redux + Express + MongoDB'
      },
      {
        label: 'Earlier',
        value: 'Project manager, JDB Capital (four properties)'
      }
    ],
    stack: ['React', 'Redux', 'Express', 'MongoDB', 'JavaScript'],
    net: ['bnr'],
    wave: 'clock'
  },
  {
    id: 'bnr',
    slot: '03',
    org: 'Big Nerd Ranch',
    window: 'Jul 2018 → present',
    role: 'Host frame · Solutions Architect',
    face: ['BIG NERD RANCH', 'SOLUTIONS ARCH'],
    headline: 'One firm. Every client system patched through it.',
    body: 'Big Nerd Ranch is the one consulting firm on my résumé — Solutions Architect since July 2018. Consulting means being dropped into a codebase other people have lived in for years and being useful inside the first sprint: read the system, find the seam, ship one small correct change, earn the larger one. Both client channels below run through this frame.',
    meter: {
      label: 'Consulting firms on my résumé',
      from: 0,
      to: 1,
      note: 'Big Nerd Ranch, July 2018 to present. Two long client engagements.'
    },
    metrics: [
      { label: 'Title', value: 'Solutions Architect' },
      { label: 'Since', value: 'July 2018' },
      { label: 'Mode', value: 'Embedded in client engineering teams' },
      {
        label: 'Channels',
        value: 'Apple (2018–2020) · Chick-fil-A (2020–2022)'
      }
    ],
    stack: ['Architecture', 'Client teams', 'Code review', 'Estimation'],
    net: ['apple', 'patch'],
    wave: 'rail'
  },
  {
    id: 'apple',
    slot: '04',
    org: 'Apple',
    window: '2018 → 2020',
    role: 'Client channel 01 · backend lead',
    face: ['APPLE', 'BACKEND LEAD'],
    headline: 'One million users to fifteen million, and a 30× faster page.',
    body: 'Backend lead on Apple’s chatbot platform. I implemented the Apple Card integration and helped coordinate its launch, helped move the front end from Angular 1 to Vue, refactored a critical service from ES5 to ES6, and helped drag the runtime from Node 5 to Node 12 — the unglamorous modernisation that has to happen underneath a product nobody is allowed to take offline. Page load went from sixty seconds to two. Traffic went from one million users to fifteen million with 100% uptime.',
    meter: {
      label: 'Users on the platform',
      from: 1,
      to: 15,
      suffix: 'M',
      decimals: 1,
      note: '1M → 15M users with 100% uptime maintained.'
    },
    metrics: [
      { label: 'Users', value: '1M → 15M' },
      { label: 'Page load', value: '60s → 2s' },
      { label: 'Uptime', value: '100% through the growth' },
      { label: 'Runtime', value: 'Node 5 → Node 12, ES5 → ES6' },
      { label: 'Front end', value: 'Angular 1 → Vue rewrite' },
      {
        label: 'Shipped',
        value: 'Apple Card integration + launch coordination'
      }
    ],
    stack: ['Node', 'JavaScript', 'Vue', 'Express', 'MongoDB', 'AWS'],
    net: ['cfa'],
    wave: 'burst'
  },
  {
    id: 'cfa',
    slot: '05',
    org: 'Chick-fil-A',
    window: '2020 → 2022',
    role: 'Client channel 02 · project engineering lead',
    face: ['CHICK-FIL-A', 'ENG LEAD · 3PD'],
    headline: 'Under $1M a day to $5M a day, without dropping the orders.',
    body: 'Project engineering lead for third-party delivery: DoorDash, UberEats and Grubhub patched into Chick-fil-A’s ordering platform. Covid turned a side channel into a main one, and the number that mattered was revenue per day — under one million to five million by 2022 — while every partner integration kept working. I shipped combo meals on UberEats, worth roughly ten percent more per order; worked with DoorDash’s engineers to put DoorDash checkout inside the Chick-fil-A iOS app; oversaw migrating the project’s infrastructure to AWS CloudFormation; and rebuilt logging, monitoring and alerting so we saw a partner outage before the partner called us.',
    meter: {
      label: 'Delivery revenue per day',
      from: 1,
      to: 5,
      prefix: '$',
      suffix: 'M',
      decimals: 1,
      note: 'Under $1M/day in 2020 to $5M/day by 2022, through Covid demand.'
    },
    metrics: [
      { label: 'Revenue', value: '<$1M/day → $5M/day (2022)' },
      { label: 'Partners', value: 'DoorDash · UberEats · Grubhub' },
      {
        label: 'Combo meals',
        value: 'UberEats combos → ~10% higher revenue per order'
      },
      { label: 'iOS', value: 'DoorDash checkout inside the Chick-fil-A app' },
      {
        label: 'Infrastructure',
        value: 'Migrated the project to AWS CloudFormation'
      },
      { label: 'Operations', value: 'Logging, monitoring, alerting rebuilt' }
    ],
    stack: [
      'Node',
      'Go',
      'TypeScript',
      'AWS',
      'CloudFormation',
      'DynamoDB',
      'Datadog'
    ],
    net: ['patch'],
    wave: 'packet'
  },
  {
    id: 'patch',
    slot: '06',
    org: 'Patch field',
    window: 'Current',
    role: 'Stack · chosen by access pattern',
    face: ['PATCH FIELD', 'STACK'],
    headline: 'The stack, as actually used in production.',
    body: 'JavaScript, TypeScript, Go, Node, Express, Vue and React on the application side. MongoDB, DynamoDB and Postgres on the data side, picked by access pattern rather than by preference. AWS, Docker, Kubernetes and GitHub Actions to ship it; Datadog, Splunk and OpsGenie to watch it; Jira and Confluence because consulting is also a paperwork job.',
    meter: {
      label: 'Datastores run in production',
      from: 0,
      to: 3,
      note: 'MongoDB, DynamoDB, Postgres — three different access-pattern bets.'
    },
    metrics: [
      { label: 'Languages', value: 'JavaScript · TypeScript · Go' },
      { label: 'Frameworks', value: 'Node · Express · Vue · React · Mongoose' },
      { label: 'Data', value: 'MongoDB · DynamoDB · Postgres' },
      { label: 'Ship', value: 'AWS · Docker · Kubernetes · GitHub Actions' },
      { label: 'Watch', value: 'Datadog · Splunk · OpsGenie' }
    ],
    stack: [
      'JavaScript',
      'TypeScript',
      'Go',
      'Node',
      'Vue',
      'React',
      'MongoDB',
      'DynamoDB',
      'Postgres',
      'AWS',
      'Kubernetes',
      'Datadog'
    ],
    net: ['out'],
    wave: 'pwm'
  },
  {
    id: 'out',
    slot: '07',
    org: 'Output',
    window: 'Open',
    role: 'Output jack · contact',
    face: ['OUTPUT', 'PATCH IN'],
    headline: 'Patch in.',
    body: 'Raleigh, North Carolina. Interested in high-traffic consumer platforms, integration work between systems that were never designed to talk to each other, and legacy modernisation that has to happen while the thing stays up.',
    meter: {
      label: 'Open channels',
      from: 0,
      to: 1,
      note: 'devjbull@gmail.com — usually a same-day reply.'
    },
    metrics: [
      { label: 'Location', value: 'Raleigh, North Carolina' },
      { label: 'Email', value: 'devjbull@gmail.com' },
      {
        label: 'Looking for',
        value: 'Platform, integrations, modernisation at scale'
      },
      { label: 'Status', value: 'Open to conversations' }
    ],
    stack: [],
    net: [],
    links: [
      { label: 'Email', href: 'mailto:devjbull@gmail.com' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bulldevon' },
      { label: 'GitHub', href: 'https://github.com/DBULL7' },
      { label: 'Run the system', href: '/systems' }
    ],
    wave: 'handshake'
  }
]

export const unitsById = Object.fromEntries(
  rackUnits.map((unit) => [unit.id, unit])
) as Record<string, RackUnit>

export const RACK_WIDTH = 12
export const RACK_HEIGHT = 8
export const UNIT_PITCH = RACK_HEIGHT / rackUnits.length

export function unitCenterY(index: number) {
  return RACK_HEIGHT / 2 - (index + 0.5) * UNIT_PITCH
}

export type Patch = {
  from: string
  to: string
  fromIndex: number
  toIndex: number
}

export const patches: Patch[] = rackUnits.flatMap((unit, index) =>
  unit.net
    .map((targetId) => ({
      from: unit.id,
      to: targetId,
      fromIndex: index,
      toIndex: rackUnits.findIndex((entry) => entry.id === targetId)
    }))
    .filter((patch) => patch.toIndex >= 0)
)

export function formatMeter(meter: Meter, value: number) {
  const decimals = meter.decimals ?? 0
  return `${meter.prefix ?? ''}${value.toFixed(decimals)}${meter.suffix ?? ''}`
}
