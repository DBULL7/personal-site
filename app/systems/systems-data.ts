// /systems content. Grounded in Devon's real engagements (Apple chatbot 2018-2020,
// Chick-fil-A third-party delivery 2020-2022). No invented metrics.

export type Stage = {
  id: string
  index: number
  code: string
  name: string
  strap: string
  what: string
  decision: string
  faultLine: string
  faultDetail: string
  tools: string[]
  evidence: { label: string; value: string }[]
}

export const stages: Stage[] = [
  {
    id: 'edge',
    index: 0,
    code: '01',
    name: 'Edge',
    strap: 'The interface nobody else has to keep stable',
    what: 'Three delivery partners push orders in — DoorDash, UberEats, Grubhub — and the Chick-fil-A iOS app pulls checkout back out. Four clients, four contracts, none of them versioned on my schedule.',
    decision:
      'The most interesting edge decision was letting somebody else own part of the flow: we worked with DoorDash’s engineers to put DoorDash checkout inside the Chick-fil-A app. More coordination, but the order never left the customer’s funnel.',
    faultLine: 'partner endpoint refusing connections',
    faultDetail:
      'A partner going down is not an outage you can fix — it is an outage you have to absorb. Orders queue at the door, the app tells the truth about what it can do, and nothing silently disappears.',
    tools: ['DoorDash', 'UberEats', 'Grubhub', 'iOS app', 'REST/JSON'],
    evidence: [
      { label: 'Scale', value: '<$1M/day → $5M/day in delivery revenue' },
      {
        label: 'Shipped',
        value: 'DoorDash checkout inside the Chick-fil-A app'
      }
    ]
  },
  {
    id: 'service',
    index: 1,
    code: '02',
    name: 'Service',
    strap: 'Translate, then refuse to trust',
    what: 'The integration service turns three partner order shapes into one internal order and then answers for it. Node and Express, Go where throughput and a single binary helped, TypeScript for the contracts.',
    decision:
      'Every partner retries, so every write is idempotent and the partner order id is the natural key. The second copy of an order is a no-op, not a second lunch. Modelling combo meals properly for UberEats was worth roughly ten percent more revenue per order — a data-modelling decision, not a growth hack.',
    faultLine: 'service instance terminated mid-request',
    faultDetail:
      'Losing an instance should be boring. Requests retry onto a healthy one and idempotency keeps the order single — the failure is only visible in the graph, not on the receipt.',
    tools: ['Node', 'Express', 'Go', 'TypeScript', 'Mongoose'],
    evidence: [
      {
        label: 'Revenue per order',
        value: '~10% higher with UberEats combo meals'
      },
      {
        label: 'Contract rule',
        value: 'Idempotent writes keyed on partner order id'
      }
    ]
  },
  {
    id: 'data',
    index: 2,
    code: '03',
    name: 'Data',
    strap: 'Pick the access pattern before the database',
    what: 'MongoDB, DynamoDB and Postgres in production, each because of how the data is read rather than which one is fashionable.',
    decision:
      'Order state is written once and read by key, so DynamoDB. Menus are documents whose shape differs per partner, so Mongo. Anything that has to answer a question with a join stays in Postgres. Choosing the store by taste is how a team earns a migration nobody scheduled.',
    faultLine: 'write throttled, connection pool saturated',
    faultDetail:
      'Throttling is the honest failure: the store is telling you the truth about capacity. The order buffers, the breaker opens so we stop making it worse, and the queue drains once the write path recovers.',
    tools: ['DynamoDB', 'MongoDB', 'Postgres'],
    evidence: [
      { label: 'Rule', value: 'Access pattern first, engine second' },
      { label: 'Stores run', value: '3 in production' }
    ]
  },
  {
    id: 'runtime',
    index: 3,
    code: '04',
    name: 'Runtime',
    strap: 'Boring deploys, reviewable infrastructure',
    what: 'AWS, Docker, Kubernetes and GitHub Actions. The environment is an artifact somebody reviewed, not something a person remembers.',
    decision:
      'I oversaw migrating the delivery project’s infrastructure to AWS CloudFormation so the environment became a diffable file. On the Apple engagement the same instinct applied to the runtime itself: Node 5 to Node 12, ES5 to ES6, under a product that was never allowed to go offline — shipped in slices while the fleet stayed up.',
    faultLine: 'bad release detected, rolling back',
    faultDetail:
      'A rollback should be the cheapest action available. If rolling back is scary, every other decision in the system gets more expensive.',
    tools: ['AWS', 'CloudFormation', 'Docker', 'Kubernetes', 'GitHub Actions'],
    evidence: [
      {
        label: 'Migration',
        value: 'Project infrastructure → AWS CloudFormation'
      },
      { label: 'Apple runtime', value: 'Node 5 → 12, ES5 → ES6, zero downtime' }
    ]
  },
  {
    id: 'feedback',
    index: 4,
    code: '05',
    name: 'Feedback',
    strap: 'See it before the partner calls',
    what: 'Datadog, Splunk and OpsGenie, wired to the things a customer would feel: orders not acknowledged, partner latency climbing, queue depth growing.',
    decision:
      'Alerting on symptoms instead of resources is the difference between an on-call rotation and a fire drill. Through Covid the traffic curve changed every week; the only way to hold uptime while daily revenue went 5× — or while a platform goes from one million to fifteen million users, as Apple’s did — is to watch the thing the customer notices.',
    faultLine: 'telemetry pipeline silent',
    faultDetail:
      'The worst failure on this diagram. Everything keeps working and nobody can prove it. Blind systems feel fine right up until they are not.',
    tools: ['Datadog', 'Splunk', 'OpsGenie'],
    evidence: [
      { label: 'Apple', value: '1M → 15M users, 100% uptime' },
      { label: 'Chick-fil-A', value: 'Held uptime through Covid demand' }
    ]
  }
]

export const stagesById = Object.fromEntries(
  stages.map((stage) => [stage.id, stage])
) as Record<string, Stage>

export const SPEEDS = [0.5, 1, 2, 4] as const
