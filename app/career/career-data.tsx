import { Todo } from '@/components/dossier/todo'

export type Engagement = {
  id: string
  client: string
  kind: string
  period: React.ReactNode
  role: React.ReactNode
  team: React.ReactNode
  domain: string
  shipped: React.ReactNode[]
  hard: React.ReactNode
  stack: React.ReactNode
  taught: React.ReactNode
}

export const factSheet: Array<[string, React.ReactNode]> = [
  [
    'Employer',
    <>
      One consulting firm since day one —{' '}
      <Todo>name of the firm, and whether you can name it publicly</Todo>
    </>
  ],
  [
    'Tenure',
    <>
      <Todo>start month/year</Todo> &rarr; present
    </>
  ],
  [
    'Clients',
    <>
      Apple &middot; Chick-fil-A &middot;{' '}
      <Todo>any other client you are contractually allowed to name</Todo>
    </>
  ],
  ['Discipline', <>Embedded engineering, plus full-stack and platform work</>],
  [
    'Ships in',
    <>
      <Todo>embedded language + toolchain: C, C++, Rust, Embedded Linux, RTOS?</Todo>{' '}
      &middot; TypeScript &middot; React &middot; Node &middot; Go
    </>
  ],
  [
    'Operates',
    <>
      Postgres &middot; DynamoDB &middot; MongoDB &middot; AWS &middot; GCP
      &middot; Kubernetes &middot; GitHub Actions &middot; Datadog
    </>
  ],
  [
    'Before engineering',
    <>
      Founder &mdash; <Todo>company name and what it sold</Todo>
    </>
  ],
  ['Based', <>Raleigh, North Carolina &middot; US Eastern</>]
]

export const engagements: Engagement[] = [
  {
    id: 'apple',
    client: 'Apple',
    kind: 'Client engagement',
    period: <Todo>start &rarr; end, month and year</Todo>,
    role: <Todo>your title on this engagement, and IC vs. lead</Todo>,
    team: <Todo>team size, and who you reported to</Todo>,
    domain: 'Embedded engineering',
    shipped: [
      <Todo key="a1">
        the deliverable in one sentence, at whatever level of detail the NDA
        allows &mdash; &ldquo;firmware for X&rdquo;, &ldquo;test harness for
        Y&rdquo;
      </Todo>,
      <Todo key="a2">
        one number: devices covered, tests added, build time cut, defects
        caught, latency moved
      </Todo>,
      <Todo key="a3">
        anything that outlived the engagement &mdash; a tool, a doc, a process
        the team kept using after you left
      </Todo>
    ],
    hard: (
      <>
        On embedded work at this scale the hardware and the software are being
        finished at the same time. You are writing against a spec that still
        moves, on a board that is still changing, with a test rig you often have
        to build yourself. The engineering judgement is deciding which
        assumptions you are allowed to bake in and which ones have to stay
        behind an interface &mdash; because the wrong call there is discovered
        late and costs a re-spin.{' '}
        <Todo>
          the specific tradeoff you remember arguing about, and which way it
          went
        </Todo>
      </>
    ),
    stack: (
      <Todo>
        languages, RTOS/OS, build system, debugger, CI, hardware-in-the-loop
        setup
      </Todo>
    ),
    taught: (
      <>
        A consultant&rsquo;s first job is to become useful before anyone has
        time to onboard them. Read the code, read the bug tracker, ship
        something small in week one.
      </>
    )
  },
  {
    id: 'chick-fil-a',
    client: 'Chick-fil-A',
    kind: 'Client engagement',
    period: <Todo>start &rarr; end, month and year</Todo>,
    role: <Todo>your title on this engagement, and IC vs. lead</Todo>,
    team: <Todo>team size, and who you reported to</Todo>,
    domain: 'Embedded systems in a live operational environment',
    shipped: [
      <Todo key="c1">
        what the system actually did in a restaurant, in one sentence a
        non-engineer would understand
      </Todo>,
      <Todo key="c2">
        scale: how many locations, devices, or transactions it touched
      </Todo>,
      <Todo key="c3">
        the operational win &mdash; downtime avoided, manual steps removed,
        support tickets reduced
      </Todo>
    ],
    hard: (
      <>
        Restaurant hardware lives in a room where nobody is paid to care about
        your software. It has to survive power cuts, an unreliable network, and
        staff turnover, and when it does fail it has to fail in a way a
        nineteen-year-old shift lead can recover from without calling anyone.
        That pushes the design toward local-first state, aggressive retries, and
        a physical UI you can read across a hot kitchen.{' '}
        <Todo>
          the failure mode you designed for, and how you proved it worked
        </Todo>
      </>
    ),
    stack: (
      <Todo>
        device platform, protocol (BLE/MQTT/serial/HTTP), backend services,
        deployment and OTA update path
      </Todo>
    ),
    taught: (
      <>
        Reliability is a product feature with a dollar value attached. In an
        operational environment you can put a number on an outage, which makes
        the argument for doing it properly much easier to win.
      </>
    )
  },
  {
    id: 'platform',
    client: 'Platform & product engagements',
    kind: 'Client engagements',
    period: <Todo>rough date range for the non-embedded work</Todo>,
    role: <Todo>title(s), and whether you owned architecture on any of them</Todo>,
    team: <Todo>typical team shape: engineers, PM, designer, client stakeholders</Todo>,
    domain: 'Full-stack product, services, cloud, delivery',
    shipped: [
      <>
        Product surfaces in TypeScript and React, backed by Node and Go
        services.
      </>,
      <>
        Persistence chosen per problem &mdash; Postgres where the relationships
        matter, DynamoDB where the access pattern is known and the scale is not,
        Mongo where the document is the unit of work.
      </>,
      <>
        Delivery on AWS and GCP with Kubernetes, GitHub Actions pipelines, and
        Datadog dashboards and monitors that someone other than me could read.
      </>,
      <Todo key="p1">
        one named system you can point at, plus the number that proved it worked
      </Todo>
    ],
    hard: (
      <>
        Consulting means inheriting other people&rsquo;s decisions. You rarely
        get a green field; you get a system with a history, a team with opinions
        about it, and a deadline that predates you. The work is figuring out
        which parts of the existing design are load-bearing and which are just
        old &mdash; and then changing the second kind without touching the
        first.
      </>
    ),
    stack: (
      <>
        TypeScript, React, Node.js, Go, Postgres, DynamoDB, MongoDB, AWS, Google
        Cloud, Kubernetes, GitHub Actions, Datadog
      </>
    ),
    taught: (
      <>
        The fastest way to earn architectural authority on a client team is to
        fix their worst piece of operational pain first, then propose the bigger
        change.
      </>
    )
  }
]

export const founder = {
  title: <Todo>company name</Todo>,
  period: <Todo>founded &rarr; exit or wind-down, years</Todo>,
  what: (
    <Todo>
      what the product was, who paid for it, and the one metric you watched
    </Todo>
  ),
  outcome: <Todo>how it ended: acquired, wound down, still running, sold</Todo>,
  scope: <Todo>headcount at peak, and what you personally owned</Todo>
}

export const lookingFor: Array<{
  index: string
  title: string
  body: React.ReactNode
}> = [
  {
    index: '01',
    title: 'Hard constraints, real users',
    body: (
      <>
        Products where the environment fights back: devices, latency budgets,
        flaky networks, physical failure modes. Embedded, edge, robotics,
        hardware-adjacent platforms.
      </>
    )
  },
  {
    index: '02',
    title: 'Ownership over a system, not a ticket queue',
    body: (
      <>
        A domain I can hold end to end &mdash; the firmware or the service, the
        deploy path, the dashboards, the on-call. I do my best work when I am
        accountable for whether it stays up.
      </>
    )
  },
  {
    index: '03',
    title: 'A team that writes things down',
    body: (
      <>
        Design docs, post-mortems, ADRs, code review with actual disagreement in
        it. I came from consulting; I know what a team looks like when the
        knowledge only lives in three people&rsquo;s heads.
      </>
    )
  }
]
