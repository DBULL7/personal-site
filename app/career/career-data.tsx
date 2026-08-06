import { Todo } from '@/components/dossier/todo'

export type Engagement = {
  id: string
  client: string
  kind: string
  period: string
  role: React.ReactNode
  team: React.ReactNode
  domain: string
  headline?: string
  shipped: React.ReactNode[]
  hard: React.ReactNode
  stack: React.ReactNode
  taught: React.ReactNode
}

/** The four numbers that answer "should we talk to this person" in ten seconds. */
export const proofPoints: Array<{
  value: string
  label: string
  source: string
}> = [
  {
    value: '60s → 2s',
    label: 'Page load on Apple’s chatbot platform',
    source: 'Apple · 2018–2020'
  },
  {
    value: '1M → 15M',
    label: 'Users carried at 100% uptime',
    source: 'Apple · 2018–2020'
  },
  {
    value: '$1M → $5M',
    label: 'Delivery revenue per day, held through Covid',
    source: 'Chick-fil-A · 2020–2022'
  },
  {
    value: '+10%',
    label: 'Average order value from combo meals on UberEats',
    source: 'Chick-fil-A · 2020–2022'
  }
]

export const factSheet: Array<[string, React.ReactNode]> = [
  [
    'Firm',
    <>
      Big Nerd Ranch &mdash; Solutions Architect, July 2018 &rarr; present.{' '}
      <Todo>confirm current title and level</Todo>
    </>
  ],
  [
    'Clients',
    <>
      Apple (2018&ndash;2020) &middot; Chick-fil-A (2020&ndash;2022) &middot;{' '}
      <Todo>what you have been building since 2022</Todo>
    </>
  ],
  [
    'Works on',
    <>
      High-traffic consumer platforms, third-party integrations, and legacy
      modernisation that has to happen without downtime
    </>
  ],
  [
    'Builds with',
    <>
      JavaScript &middot; TypeScript &middot; Node &middot; Express &middot; Go
      &middot; Vue &middot; React
    </>
  ],
  ['Stores in', <>MongoDB &middot; DynamoDB &middot; Postgres</>],
  [
    'Runs on',
    <>
      AWS &middot; CloudFormation &middot; Docker &middot; Kubernetes &middot;
      GitHub Actions
    </>
  ],
  ['Watches with', <>Datadog &middot; Splunk &middot; OpsGenie</>],
  [
    'Before engineering',
    <>
      COO of Haller (2015) &middot; freelance developer, U-Hoops &middot;
      property manager, JDB Capital
    </>
  ],
  [
    'Education',
    <>
      Turing School of Software &amp; Design, 2017 &middot; B.A. Economics,
      University of Kansas, 2015
    </>
  ],
  ['Based', <>Raleigh, North Carolina &middot; US Eastern</>]
]

export const engagements: Engagement[] = [
  {
    id: 'current',
    client: '2022 → present',
    kind: 'Current work',
    period: '2022 → now',
    role: <Todo>current title, and whether you are still at Big Nerd Ranch</Todo>,
    team: <Todo>team size and reporting line</Todo>,
    domain: 'The most important entry on this page, and the one I cannot write for you',
    headline: 'Unwritten',
    shipped: [
      <Todo key="n1">
        the client or product you have been on since the Chick-fil-A engagement
        ended
      </Todo>,
      <Todo key="n2">
        what shipped, and the number that proves it &mdash; same shape as the
        two records below
      </Todo>,
      <Todo key="n3">
        anything that changed about how you work: scope, ownership, people
      </Todo>
    ],
    hard: (
      <>
        Four years is the freshest and most scrutinised part of any
        r&eacute;sum&eacute;, and right now it is the only part of this page
        with nothing in it. Everything else here is verified from the record.{' '}
        <Todo>
          fill this record first &mdash; it is worth more than every other
          placeholder combined
        </Todo>
      </>
    ),
    stack: <Todo>what you have actually been writing since 2022</Todo>,
    taught: <Todo>one honest sentence about what the last four years taught you</Todo>
  },
  {
    id: 'chick-fil-a',
    client: 'Chick-fil-A',
    kind: 'Client engagement · Big Nerd Ranch',
    period: '2020 → 2022',
    role: 'Project engineering lead — Third Party Delivery Integrations',
    team: <Todo>team size, and who you reported to</Todo>,
    domain: 'DoorDash, UberEats, and Grubhub inside a national restaurant platform',
    headline: '$1M → $5M per day',
    shipped: [
      <>
        Led the third-party delivery integrations &mdash; DoorDash, UberEats,
        Grubhub &mdash; through the Covid surge, from under{' '}
        <strong>$1M a day</strong> in delivery revenue to{' '}
        <strong>$5M a day</strong> by 2022.
      </>,
      <>
        Shipped combo meals on UberEats, which raised average revenue per order
        roughly <strong>10%</strong>.
      </>,
      <>
        Coordinated directly with DoorDash engineering to support checking out
        with DoorDash from inside the Chick-fil-A iOS app.
      </>,
      <>
        Oversaw and helped implement the migration of project infrastructure to
        AWS CloudFormation.
      </>,
      <>
        Improved logging, monitoring, and overall observability; shipped
        delivery-efficiency work that cut several minutes off the average
        delivery.
      </>
    ],
    hard: (
      <>
        Three partners, three APIs, three sets of failure semantics, and none of
        them under our control &mdash; against one menu, one order lifecycle,
        and one customer who does not care whose fault it was. Covid then
        multiplied the volume by five in months, so every rough edge that used
        to be a rounding error turned into a support queue. The work was
        building an internal order contract the partners had to translate into,
        rather than letting three vendor APIs leak all the way through the
        platform.
      </>
    ),
    stack: (
      <>
        Node.js, JavaScript/TypeScript, AWS with CloudFormation, Datadog,
        Splunk, OpsGenie.{' '}
        <Todo>confirm the datastore and whether Go was in this codebase</Todo>
      </>
    ),
    taught: (
      <>
        When revenue is measured per day, reliability stops being an engineering
        preference and becomes a number you can put in a sentence. That makes
        every argument for doing it properly much easier to win.
      </>
    )
  },
  {
    id: 'apple',
    client: 'Apple',
    kind: 'Client engagement · Big Nerd Ranch',
    period: '2018 → 2020',
    role: 'Backend lead — Apple chatbot platform',
    team: <Todo>team size, and who you reported to</Todo>,
    domain: 'Conversational commerce and support at consumer scale',
    headline: '1M → 15M users, 100% uptime',
    shipped: [
      <>
        Backend lead on Apple&rsquo;s chatbot platform. Implemented the{' '}
        <strong>Apple Card integration</strong> and helped coordinate its
        launch.
      </>,
      <>
        Took page load from <strong>60 seconds to 2 seconds</strong>.
      </>,
      <>
        Helped hold <strong>100% uptime</strong> while the platform grew from{' '}
        <strong>1M to 15M users</strong>.
      </>,
      <>
        Helped rewrite the frontend from AngularJS to Vue, refactored a critical
        service from ES5 to ES6, and helped upgrade Node.js from 5 to 12.
      </>
    ],
    hard: (
      <>
        None of it could stop. A sixty-second page load is not one bad query
        &mdash; it is years of accumulated decisions, and you cannot fix it with
        a rewrite when millions of people are using the thing every day. Node 5
        to 12 skips seven majors of breaking changes; AngularJS to Vue is a
        framework migration with a live product on top of it. The judgement
        being tested is sequencing: what you measure first, what you replace
        behind a stable interface, and what you leave alone because it is
        load-bearing and boring.
      </>
    ),
    stack: (
      <>
        Node.js (5 &rarr; 12), JavaScript ES5 &rarr; ES6, AngularJS &rarr; Vue,
        Express.{' '}
        <Todo>confirm datastore, hosting, and CI on this engagement</Todo>
      </>
    ),
    taught: (
      <>
        Measure before you rewrite. The 60-to-2 result came from finding what
        was actually slow, not from a new framework &mdash; the framework
        migration was a separate, slower, deliberately boring project.
      </>
    )
  }
]

/** The path here was not a computer science degree. That is the interesting part. */
export const path: Array<{
  year: string
  title: string
  detail: React.ReactNode
}> = [
  {
    year: '2010–13',
    title: 'Project manager, JDB Capital',
    detail: (
      <>
        Ran four properties: contractor selection and oversight, tenant
        screening, collections. First job where being wrong cost money.
      </>
    )
  },
  {
    year: '2015',
    title: 'B.A. Economics, University of Kansas',
    detail: (
      <>
        Not a CS degree. It is where the habit of asking what a decision costs
        before asking whether it is elegant came from.
      </>
    )
  },
  {
    year: '2015',
    title: 'COO, Haller',
    detail: (
      <>
        Wrote the business plan and got the company accepted into a business
        accelerator. Then taught myself Sketch and enough Swift to build the
        prototype myself, because there was nobody else to build it.
      </>
    )
  },
  {
    year: '2017',
    title: 'Turing School of Software & Design',
    detail: (
      <>
        Front-end web development, full time. Third place in the Turing
        hackathon with Unavee, a people-search and networking tool.
      </>
    )
  },
  {
    year: '2017–18',
    title: 'Freelance developer, U-Hoops',
    detail: (
      <>
        Rewrote a WordPress site into React/Redux, Express, and MongoDB, and
        added accounts, tour management, and a message board.
      </>
    )
  },
  {
    year: '2018',
    title: 'Big Nerd Ranch',
    detail: (
      <>
        Hired as an engineer, ended up leading backend work for Apple within the
        first engagement.
      </>
    )
  }
]

export const lookingFor: Array<{
  index: string
  title: string
  body: React.ReactNode
}> = [
  {
    index: '01',
    title: 'Scale that is already real',
    body: (
      <>
        I am most useful on products with live traffic and something to lose.
        The two engagements above were both &ldquo;this is growing fast and
        cannot go down&rdquo; problems, and that is the work I want more of.
      </>
    )
  },
  {
    index: '02',
    title: 'Ownership of a system, not a ticket queue',
    body: (
      <>
        Backend lead and project engineering lead are the roles I have actually
        held. I want the domain end to end &mdash; the services, the deploy
        path, the dashboards, the pager.
      </>
    )
  },
  {
    index: '03',
    title: 'Legacy worth modernising',
    body: (
      <>
        Framework migrations, runtime upgrades, and performance work on systems
        that cannot stop serving traffic. Most engineers avoid this. It is the
        thing I have the most evidence for.
      </>
    )
  }
]

export const sideProjects: Array<{
  name: string
  href?: string
  detail: React.ReactNode
}> = [
  {
    name: 'EnzoJS',
    href: 'https://www.npmjs.com/package/enzojs',
    detail: (
      <>
        Open-source npm tool that automates JavaScript project setup, in the
        spirit of <code>rails new</code>.{' '}
        <Todo>confirm the link and whether it is still worth featuring</Todo>
      </>
    )
  },
  {
    name: 'Unavee',
    detail: (
      <>
        People-search and networking tool with personality insights. Third place
        at the Turing hackathon.
      </>
    )
  },
  {
    name: 'U-Hoops',
    detail: (
      <>
        Network for basketball professionals to connect and apply for overseas
        tours. React/Redux, Express, MongoDB.
      </>
    )
  }
]
