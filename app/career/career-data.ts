// Career content for /career. Every fact here comes from Devon's own resumes and
// his own follow-up corrections.
// TODO(devon): exact start/end months for the two most recent Apple eras (SLOT 06, SLOT 07).
// TODO(devon): current title at Stellar Elements (the 2022 resume said Solutions Architect).
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
    body: 'B.A. Economics from the University of Kansas in 2015, property management before that, a startup after it, then Turing School of Software and Design in 2017. I came into engineering through the business door, which is why I still ask what a feature is worth before I ask how it should be built. In parallel I freelanced: rewriting U-Hoops from a WordPress site into React/Redux with an Express and MongoDB backend, plus accounts, tour management and a message board.',
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
    net: ['firm'],
    wave: 'clock'
  },
  {
    id: 'firm',
    slot: '03',
    org: 'Stellar Elements',
    window: 'Jul 2018 → present',
    role: 'Host frame · one firm, seven years',
    face: ['STELLAR ELEMENTS', 'EX BIG NERD RANCH'],
    headline: 'One firm for seven years, and the work kept getting harder.',
    body: 'Stellar Elements — formerly Big Nerd Ranch, now an Amdocs company — has been my employer since July 2018, through a rebrand and an acquisition. Every unit above slot 03 is a client engagement that ran through this frame: backend lead at consumer scale, then engineering lead through a hypergrowth integration crisis, then sole owner of an internal product at Apple, then platform and developer-experience work. Same firm, escalating scope. Being handed the next hard thing repeatedly is the part of the résumé I am proudest of.',
    meter: {
      label: 'Years at one firm',
      from: 0,
      to: 7,
      note: 'July 2018 to present, through the Big Nerd Ranch → Stellar Elements transition.'
    },
    metrics: [
      {
        label: 'Employer',
        value: 'Stellar Elements (formerly Big Nerd Ranch), an Amdocs company'
      },
      { label: 'Since', value: 'July 2018 — present' },
      {
        label: 'Last stated title',
        value: 'Solutions Architect (2022 résumé)'
      },
      {
        label: 'Clients',
        value: 'Apple (2018–present, three eras) · Chick-fil-A (2020–2022)'
      }
    ],
    stack: [
      'Architecture',
      'Product engineering',
      'Client teams',
      'Code review'
    ],
    net: ['apple1', 'patch'],
    wave: 'rail'
  },
  {
    id: 'apple1',
    slot: '04',
    org: 'Apple · chatbot',
    window: '2018 → 2020',
    role: 'Apple era 1 · backend lead',
    face: ['APPLE / CHATBOT', 'BACKEND LEAD'],
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
    role: 'Client channel · project engineering lead',
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
    net: ['apple2'],
    wave: 'packet'
  },
  {
    id: 'apple2',
    slot: '06',
    org: 'Apple · cloud resources UI',
    window: '~2022 → ~2024',
    role: 'Apple era 2 · sole engineer',
    face: ['APPLE / CLOUD UI', 'SOLO · 2 YEARS'],
    headline: 'Two years as the only engineer on the product.',
    body: 'Sole engineer owning Apple’s React and TypeScript UI for managing third-party cloud resources: design decisions, build, ship, maintain, support — no team to hide behind and no one else to hand the ambiguous part to. Two years of being the person who decides what the interface should do, then makes it do that, inside a company with a very specific bar for what shipped software feels like.',
    meter: {
      label: 'Engineers on the product',
      from: 0,
      to: 1,
      note: 'One. Me, for roughly two years, on a real internal product at Apple.'
    },
    metrics: [
      { label: 'Ownership', value: 'Sole engineer, end to end' },
      {
        label: 'Surface',
        value: 'UI for managing third-party cloud resources'
      },
      { label: 'Stack', value: 'React · TypeScript' },
      { label: 'Duration', value: '≈ 2 years' }
    ],
    stack: ['React', 'TypeScript', 'Design systems', 'Cloud APIs'],
    net: ['apple3'],
    wave: 'pwm'
  },
  {
    id: 'apple3',
    slot: '07',
    org: 'Apple · developer portal',
    window: '~2024 → present',
    role: 'Apple era 3 · product + platform',
    face: ['APPLE / DEV PORTAL', 'CURRENT WORK'],
    headline: 'The place Apple engineers go to manage their clouds.',
    body: 'Building Apple’s internal cloud website: where users manage their clouds across Apple-internal resources and third-party providers, in React and TypeScript. It is now expanding into a complete Developer Portal experience — the surface other engineers work through every day, which is the kind of product where a bad decision costs everybody an hour a week and a good one is invisible. Developer-experience product work at Apple scale, and the current job.',
    meter: {
      label: 'Years with Apple as a client',
      from: 0,
      to: 7,
      note: 'Three eras since 2018: chatbot backend, solo cloud UI, now the developer portal.'
    },
    metrics: [
      {
        label: 'Product',
        value: 'Apple internal cloud website → Developer Portal'
      },
      {
        label: 'Scope',
        value: 'Apple-internal and third-party cloud providers'
      },
      { label: 'Stack', value: 'React · TypeScript' },
      { label: 'Status', value: 'Current engagement' }
    ],
    stack: ['React', 'TypeScript', 'Developer experience', 'Internal platform'],
    net: ['patch'],
    wave: 'clock'
  },
  {
    id: 'patch',
    slot: '08',
    org: 'Patch field',
    window: 'Current',
    role: 'Stack · chosen by access pattern',
    face: ['PATCH FIELD', 'STACK'],
    headline: 'The stack, as actually used in production.',
    body: 'React and TypeScript on the product side, with Vue and JavaScript in the history and Node, Express and Go behind it. MongoDB, DynamoDB and Postgres on the data side, picked by access pattern rather than by preference. AWS, Docker, Kubernetes and GitHub Actions to ship it; Datadog, Splunk and OpsGenie to watch it; Jira and Confluence because client work is also a paperwork job.',
    meter: {
      label: 'Datastores run in production',
      from: 0,
      to: 3,
      note: 'MongoDB, DynamoDB, Postgres — three different access-pattern bets.'
    },
    metrics: [
      { label: 'Front end', value: 'React · TypeScript · Vue' },
      { label: 'Back end', value: 'Node · Express · Go · Mongoose' },
      { label: 'Data', value: 'MongoDB · DynamoDB · Postgres' },
      { label: 'Ship', value: 'AWS · Docker · Kubernetes · GitHub Actions' },
      { label: 'Watch', value: 'Datadog · Splunk · OpsGenie' }
    ],
    stack: [
      'React',
      'TypeScript',
      'JavaScript',
      'Go',
      'Node',
      'Vue',
      'MongoDB',
      'DynamoDB',
      'Postgres',
      'AWS',
      'Kubernetes',
      'Datadog'
    ],
    net: ['out'],
    wave: 'rail'
  },
  {
    id: 'out',
    slot: '09',
    org: 'Output',
    window: 'Open',
    role: 'Output jack · product engineer',
    face: ['OUTPUT', 'PATCH IN'],
    headline: 'Product engineer. Patch in.',
    body: 'Raleigh, North Carolina. The work I want is the work this rack is made of: product engineering where somebody has to hold the interface, the service behind it and the question of whether it was worth building — internal platforms and developer experience, consumer products at scale, or the integration problem between systems that were never designed to talk.',
    meter: {
      label: 'Open channels',
      from: 0,
      to: 1,
      note: 'devjbull@gmail.com — usually a same-day reply.'
    },
    metrics: [
      { label: 'Target role', value: 'Product engineer / senior full-stack' },
      { label: 'Location', value: 'Raleigh, North Carolina' },
      { label: 'Email', value: 'devjbull@gmail.com' },
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
export const RACK_HEIGHT = 10.4
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
