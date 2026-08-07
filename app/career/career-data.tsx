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

/** The numbers that answer "should we talk to this person" in ten seconds. */
export const proofPoints: Array<{
  value: string
  label: string
  source: string
}> = [
  {
    value: '7 years',
    label: 'One firm, July 2018 to now, through an acquisition',
    source: 'Stellar Elements'
  },
  {
    value: '3 eras',
    label: 'Apple engagements across seven years, scope growing each time',
    source: 'Apple · 2018–present'
  },
  {
    value: '1M → 15M',
    label: 'Users carried at 100% uptime',
    source: 'Apple · 2018–2020'
  },
  {
    value: '60s → 2s',
    label: 'Page load on Apple’s chatbot platform',
    source: 'Apple · 2018–2020'
  },
  {
    value: '$1M → $5M',
    label: 'Delivery revenue per day, held through Covid',
    source: 'Chick-fil-A · 2020–2022'
  },
  {
    value: '2 years solo',
    label: 'Sole engineer owning an Apple internal product end to end',
    source: 'Apple · 2022–2024'
  }
]

export const factSheet: Array<[string, React.ReactNode]> = [
  [
    'Firm',
    <>
      Stellar Elements (formerly Big Nerd Ranch), an Amdocs company &middot;
      July 2018 &rarr; present
    </>
  ],
  [
    'Title',
    <>
      Solutions Architect &middot; <Todo>confirm current title and level</Todo>
    </>
  ],
  [
    'Clients',
    <>
      Apple (2018&ndash;2020, 2022&ndash;present) &middot; Chick-fil-A
      (2020&ndash;2022)
    </>
  ],
  [
    'Works on',
    <>
      Product surfaces and the systems under them &mdash; internal developer
      platforms, third-party integrations, and consumer-scale backends
    </>
  ],
  [
    'Builds with',
    <>
      React &middot; TypeScript &middot; Node &middot; Express &middot; Go
      &middot; Vue &middot; JavaScript
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
    id: 'apple-developer-portal',
    client: 'Apple — internal cloud & developer portal',
    kind: 'Client engagement · Apple, era 3',
    period: '2024 → present',
    role: (
      <>
        Product engineer &mdash; React &amp; TypeScript.{' '}
        <Todo>confirm current title and exact start month</Todo>
      </>
    ),
    team: <Todo>team size, and who you work with on the Apple side</Todo>,
    domain: 'Internal developer platform at Apple scale',
    headline: 'Developer platform',
    shipped: [
      <>
        Apple&rsquo;s internal cloud website: the place Apple engineers manage
        their clouds across{' '}
        <strong>Apple-internal resources and third-party providers</strong> in
        one interface.
      </>,
      <>
        Currently expanding it into a complete{' '}
        <strong>Developer Portal experience</strong> &mdash; the surface other
        engineers inside Apple use to get their work done.
      </>,
      <Todo key="dp1">
        one concrete number: teams onboarded, providers supported, steps removed
        from a workflow, time saved per request
      </Todo>
    ],
    hard: (
      <>
        Internal tools have the hardest users in the building: engineers who
        already know how the underlying system works and will route around you
        the moment the UI is slower than the CLI. Unifying Apple-internal
        infrastructure and third-party cloud providers behind one interface
        means every provider&rsquo;s model has to be reconciled without
        pretending the differences do not exist. And a developer portal is a
        product, not a page &mdash; it succeeds on whether someone finishes the
        task, not on whether the endpoint returned 200.
      </>
    ),
    stack: (
      <>
        React, TypeScript, multi-cloud provider APIs.{' '}
        <Todo>
          confirm the backend, build tooling, and design system in use
        </Todo>
      </>
    ),
    taught: (
      <>
        Developer experience is product work with a technical audience. The
        research, the flows, and the &ldquo;why did they abandon here&rdquo;
        questions are exactly the same &mdash; the users just have opinions
        about your API shape too.
      </>
    )
  },
  {
    id: 'apple-cloud-ui',
    client: 'Apple — third-party cloud resource UI',
    kind: 'Client engagement · Apple, era 2',
    period: '2022 → 2024',
    role: (
      <>
        Sole engineer &mdash; design, build, ship, maintain.{' '}
        <Todo>confirm exact start and end months</Todo>
      </>
    ),
    team: (
      <>
        One. Me. <Todo>who you reported to, and who the stakeholders were</Todo>
      </>
    ),
    domain: 'The UI Apple engineers used to manage third-party cloud resources',
    headline: '2 years, solo',
    shipped: [
      <>
        Owned Apple&rsquo;s React and TypeScript interface for managing
        third-party cloud resources as the{' '}
        <strong>only engineer on it, for two years</strong>.
      </>,
      <>
        Everything: requirements, architecture, implementation, release,
        support, and the follow-up work when a user said it was confusing.
      </>,
      <Todo key="ui1">
        the number that shows adoption &mdash; users, teams, resources managed,
        or tickets deflected
      </Todo>
    ],
    hard: (
      <>
        Being the only engineer removes every place to hide, and it changes what
        good engineering means. There is no one to review the clever solution,
        so you stop writing clever solutions. Scope has to be cut in public,
        with a reason. The bus factor is one, so the code has to read like
        documentation and the documentation has to actually exist. Two years of
        that is the most useful engineering discipline I have been through.
      </>
    ),
    stack: (
      <>
        React, TypeScript, third-party cloud provider APIs.{' '}
        <Todo>confirm state management, testing, and CI on this project</Todo>
      </>
    ),
    taught: (
      <>
        When you are the whole team, taste becomes a delivery mechanism. Every
        hour spent on a clever abstraction is an hour not spent on the thing a
        user actually asked for.
      </>
    )
  },
  {
    id: 'chick-fil-a',
    client: 'Chick-fil-A',
    kind: 'Client engagement · Big Nerd Ranch',
    period: '2020 → 2022',
    role: 'Project engineering lead — Third Party Delivery Integrations',
    team: <Todo>team size, and who you reported to</Todo>,
    domain:
      'DoorDash, UberEats, and Grubhub inside a national restaurant platform',
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
    id: 'apple-chatbot',
    client: 'Apple — chatbot platform',
    kind: 'Client engagement · Apple, era 1',
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
    year: '2018–now',
    title: 'Big Nerd Ranch → Stellar Elements',
    detail: (
      <>
        Seven years, one firm, through a rebrand and an acquisition by Amdocs.
        Backend lead, then engineering lead, then solo product owner, then
        developer platform work.
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
    title: 'Product engineer, properly defined',
    body: (
      <>
        A role where the same person decides what to build and builds it. I have
        done both ends &mdash; wrote a business plan and got a company into an
        accelerator; also took a page from sixty seconds to two. The interesting
        work lives where those two skills touch.
      </>
    )
  },
  {
    index: '02',
    title: 'Ownership of a surface, end to end',
    body: (
      <>
        I spent two years as the only engineer on an Apple internal product, and
        I would take that shape again: the UI, the services behind it, the
        release, and the conversation with the person who has to use it.
      </>
    )
  },
  {
    index: '03',
    title: 'Users who are hard to impress',
    body: (
      <>
        Developer platforms, internal tools, integration-heavy products.
        Engineers route around a bad interface instantly, which makes them the
        most honest feedback loop you can get.
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
