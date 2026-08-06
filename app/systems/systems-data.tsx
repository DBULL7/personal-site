import { Todo } from '@/components/dossier/todo'

export type Scenario = {
  id: string
  index: string
  situation: string
  moves: React.ReactNode[]
  evidence: React.ReactNode
}

export const scenarios: Scenario[] = [
  {
    id: 'slow-legacy',
    index: '01',
    situation:
      'A page takes a minute to load, the cause is six years of accumulated decisions, and you are not allowed to stop shipping.',
    moves: [
      <>
        Measure before touching anything. A sixty-second load is never one bad
        query, and the thing everyone blames is usually third on the list.
      </>,
      <>
        Fix the measured hot path first and bank the win. Users feel that in
        days; a rewrite would have taken quarters.
      </>,
      <>
        Only then migrate the framework, behind a stable interface, one surface
        at a time, with the old one still serving traffic.
      </>
    ],
    evidence: (
      <>
        Apple chatbot platform: page load <strong>60s &rarr; 2s</strong>, and a
        separate, slower AngularJS &rarr; Vue migration that never took the
        product down.
      </>
    )
  },
  {
    id: 'scale-surge',
    index: '02',
    situation:
      'Traffic is about to multiply and nobody can say which part gives first.',
    moves: [
      <>
        Find the ceiling on purpose &mdash; load test the path that carries
        money, not the endpoint that is easy to test.
      </>,
      <>
        Make the failure modes graceful before the surge: backpressure, queues,
        idempotent retries, and a degraded mode that still takes orders.
      </>,
      <>
        Watch the business metric next to the system metric. A dashboard that
        shows revenue per minute gets looked at; a CPU graph does not.
      </>
    ],
    evidence: (
      <>
        Chick-fil-A third-party delivery through Covid: under{' '}
        <strong>$1M/day to $5M/day</strong>. Apple chatbot:{' '}
        <strong>1M to 15M users at 100% uptime</strong>.
      </>
    )
  },
  {
    id: 'partner-apis',
    index: '03',
    situation:
      'Your product depends on three partner APIs you do not control, and each one fails differently.',
    moves: [
      <>
        Define one internal contract for the domain &mdash; an order is an order
        &mdash; and make every partner adapter translate into it. Never let a
        vendor schema leak into the core.
      </>,
      <>
        Assume each partner is independently degradable. One integration being
        down must not be an outage for the other two.
      </>,
      <>
        Get into the partner&rsquo;s engineering room. Some problems are only
        solvable on a shared call, not through a support portal.
      </>
    ],
    evidence: (
      <>
        DoorDash, UberEats, and Grubhub integrations at Chick-fil-A, including
        coordinating directly with DoorDash engineering to support DoorDash
        checkout inside the Chick-fil-A iOS app.
      </>
    )
  },
  {
    id: 'runtime-debt',
    index: '04',
    situation:
      'The runtime is seven major versions behind and the upgrade has been deferred four times.',
    moves: [
      <>
        Do it in steps with a real safety net. Node 5 to 12 is not one upgrade,
        it is seven, and each one has its own breakage profile.
      </>,
      <>
        Modernise the language in the same motion where it is cheap &mdash; ES5
        to ES6 in the services you are already touching, not as a separate
        campaign.
      </>,
      <>
        Tie it to something the business wants. &ldquo;Upgrade Node&rdquo; never
        gets prioritised; &ldquo;this is what unblocks the performance
        work&rdquo; does.
      </>
    ],
    evidence: (
      <>
        Apple: Node.js <strong>5 &rarr; 12</strong>, a critical service
        refactored ES5 &rarr; ES6, and the Apple Card integration shipped in the
        same period.
      </>
    )
  },
  {
    id: 'blind-production',
    index: '05',
    situation:
      'Production is degraded, several teams are on the call, and nobody can say which layer is lying.',
    moves: [
      <>
        Start from the symptom a customer feels. Most resource alerts are noise;
        error rate and latency at the edge are not.
      </>,
      <>
        Fix the observability gap the incident just revealed &mdash; a missing
        log line or trace is itself the finding.
      </>,
      <>
        Delete the monitors that did not help. An alert nobody acts on is worse
        than no alert.
      </>
    ],
    evidence: (
      <>
        Logging, monitoring, and observability work at Chick-fil-A across
        Datadog, Splunk, and OpsGenie.{' '}
        <Todo>one incident you led, with detection and resolution time</Todo>
      </>
    )
  }
]

export type Decision = {
  id: string
  code: string
  title: string
  context: React.ReactNode
  options: string[]
  call: React.ReactNode
  consequence: React.ReactNode
  again: React.ReactNode
}

export const decisions: Decision[] = [
  {
    id: 'dec-01',
    code: 'DEC-01',
    title: 'Profile the slow page before rewriting the frontend',
    context: (
      <>
        Apple chatbot platform, roughly 2018&ndash;2019. Page load was around
        sixty seconds. The obvious narrative was &ldquo;AngularJS is old,
        rewrite it&rdquo;.
      </>
    ),
    options: [
      'Rewrite the frontend first and hope the performance follows',
      'Profile the real request path and fix what is measurably slow',
      'Add caching in front and defer the diagnosis'
    ],
    call: (
      <>
        Measure first. Frameworks are rarely the reason a page takes a minute;
        accumulated request patterns, payload size, and blocking work usually
        are. The performance fix and the framework migration were kept as two
        separate projects with two separate risk profiles.
      </>
    ),
    consequence: (
      <>
        <strong>60s &rarr; 2s</strong> shipped far sooner than a rewrite could
        have, and the AngularJS &rarr; Vue migration afterwards was allowed to
        be slow and boring instead of urgent.
      </>
    ),
    again: (
      <>
        Yes. Coupling a performance emergency to a framework migration is how
        both of them fail.
      </>
    )
  },
  {
    id: 'dec-02',
    code: 'DEC-02',
    title: 'One internal order contract, one adapter per delivery partner',
    context: (
      <>
        Chick-fil-A third-party delivery. DoorDash, UberEats, and Grubhub each
        model menus, modifiers, and order lifecycle differently, and all three
        change without asking.
      </>
    ),
    options: [
      'Integrate each partner directly against the existing services',
      'One canonical internal order model with a thin adapter per partner',
      'A third-party aggregation vendor in the middle'
    ],
    call: (
      <>
        Canonical model, thin adapters. The core system speaks one language;
        each partner&rsquo;s quirks stay inside its own boundary, where they can
        be tested and degraded independently.
      </>
    ),
    consequence: (
      <>
        More upfront modelling, and a translation layer to maintain. In
        exchange, combo meals on UberEats shipped as a feature rather than a
        special case &mdash; and it lifted average revenue per order roughly{' '}
        <strong>10%</strong>.
      </>
    ),
    again: (
      <>
        Yes. The alternative is three partner schemas leaking into every service
        you own.
      </>
    )
  },
  {
    id: 'dec-03',
    code: 'DEC-03',
    title:
      'Move infrastructure to CloudFormation during the growth surge, not after',
    context: (
      <>
        Chick-fil-A delivery revenue was heading from under $1M a day toward $5M
        a day. Manually-shaped infrastructure was becoming the riskiest thing in
        the system.
      </>
    ),
    options: [
      'Freeze infrastructure work until the surge passes',
      'Migrate to AWS CloudFormation incrementally, during the growth',
      'Hand-manage and document it instead'
    ],
    call: (
      <>
        Migrate during. Waiting for a calm quarter is a plan that never
        executes, and the cost of an unreproducible environment goes up with
        every extra dollar of daily revenue behind it.
      </>
    ),
    consequence: (
      <>
        Real engineering time spent on something no customer sees, and pressure
        to defer it every sprint. What it bought was environments that could be
        rebuilt on purpose instead of remembered.
      </>
    ),
    again: <>Yes, and I would start it earlier.</>
  },
  {
    id: 'dec-04',
    code: 'DEC-04',
    title:
      'Upgrade the runtime in steps, tied to work the business already wanted',
    context: (
      <>
        Node 5 in production with a large surface area of dependencies, and a
        performance mandate that needed a modern runtime to land.
      </>
    ),
    options: [
      'Big-bang upgrade to the current LTS',
      'Stepwise upgrade with tests hardened at each hop',
      'Leave it and work around the constraints'
    ],
    call: (
      <>
        Stepwise, and attached to the performance work rather than proposed on
        its own. &ldquo;Upgrade Node&rdquo; loses every prioritisation
        conversation; &ldquo;this is what unblocks the thing you already
        approved&rdquo; wins it.
      </>
    ),
    consequence: (
      <>
        Slower calendar time and several boring intermediate releases. No
        rollback event, and <strong>Node 5 &rarr; 12</strong> landed on a
        platform that was not allowed to go down.
      </>
    ),
    again: (
      <>
        Yes. Big-bang runtime upgrades work right up until the one that does
        not.
      </>
    )
  },
  {
    id: 'dec-05',
    code: 'DEC-05',
    title: 'Buy observability, own the alert taxonomy',
    context: (
      <>
        Multiple tools already in play &mdash; Datadog, Splunk, OpsGenie &mdash;
        and an on-call rotation being paged by things that did not matter.
      </>
    ),
    options: [
      'Self-host Prometheus, Grafana, and log storage',
      'Standardise on the vendor tooling and spend the time on alert design',
      'Cloud-native tooling only'
    ],
    call: (
      <>
        Buy the platform. Spend the saved time on the part no vendor can do for
        you: every monitor that pages a human maps to a symptom a customer would
        actually feel. Everything else is a dashboard.
      </>
    ),
    consequence: (
      <>
        A real bill and a standing need to review ingest volume. In exchange,
        alerts people trust &mdash; the only kind that gets acted on.{' '}
        <Todo>alert volume before and after, if you kept the numbers</Todo>
      </>
    ),
    again: <>Yes, for any team that does not have a dedicated platform group.</>
  }
]

export type StackRow = {
  name: string
  depth: 'Primary' | 'Working' | 'Exploring'
  usedFor: React.ReactNode
  opinion: React.ReactNode
}

export type StackGroup = {
  id: string
  label: string
  blurb: string
  rows: StackRow[]
}

export const stackGroups: StackGroup[] = [
  {
    id: 'services',
    label: 'Services & integrations',
    blurb:
      'Where most of my work has been: backend systems carrying consumer traffic, and the partner APIs hanging off them.',
    rows: [
      {
        name: 'Node.js / Express',
        depth: 'Primary',
        usedFor: (
          <>
            Backend lead work on the Apple chatbot platform and the Chick-fil-A
            delivery integrations. Node 5 &rarr; 12 upgrade included.
          </>
        ),
        opinion: (
          <>
            Excellent for I/O-shaped work, which is what an integration platform
            is. I would not choose it again for anything CPU-bound, and I would
            pin and audit dependencies far earlier than most teams do.
          </>
        )
      },
      {
        name: 'JavaScript / TypeScript',
        depth: 'Primary',
        usedFor: (
          <>
            Seven years of production services and product surfaces, including
            an ES5 &rarr; ES6 refactor of a critical service.
          </>
        ),
        opinion: (
          <>
            Strict mode from the first commit, including{' '}
            <code>noUncheckedIndexedAccess</code>. Retrofitting strictness onto
            a mature codebase is a week nobody plans for &mdash; I have spent
            it.
          </>
        )
      },
      {
        name: 'Third-party API integration',
        depth: 'Primary',
        usedFor: (
          <>
            DoorDash, UberEats, Grubhub; Apple Card integration on the chatbot
            platform.
          </>
        ),
        opinion: (
          <>
            One canonical internal model, one thin adapter per partner, and each
            partner independently degradable. See DEC-02.
          </>
        )
      },
      {
        name: 'Go',
        depth: 'Working',
        usedFor: (
          <Todo>
            which project the Go work was on &mdash; it is on your
            r&eacute;sum&eacute; but not attached to an engagement
          </Todo>
        ),
        opinion: (
          <>
            One binary, one obvious way to do a thing, readable by a stranger at
            3am. The lack of expressiveness is the feature when the code is
            being handed to a client team.
          </>
        )
      }
    ]
  },
  {
    id: 'product',
    label: 'Product surface',
    blurb:
      'The part a customer touches, and the part that reveals whether the model underneath makes sense.',
    rows: [
      {
        name: 'Vue',
        depth: 'Working',
        usedFor: (
          <>
            Helped move the Apple chatbot frontend from AngularJS to Vue while
            it stayed live.
          </>
        ),
        opinion: (
          <>
            Migrate surface by surface behind a stable interface. A framework
            migration announced as a rewrite is a framework migration that gets
            cancelled at 60%.
          </>
        )
      },
      {
        name: 'React / Redux',
        depth: 'Primary',
        usedFor: (
          <>
            Product work, freelance builds (U-Hoops: WordPress &rarr;
            React/Redux + Express + MongoDB), and this site.
          </>
        ),
        opinion: (
          <>
            Most &ldquo;we need a state library&rdquo; problems are &ldquo;we
            fetch in the wrong place&rdquo; problems. Server components and
            plain state first.
          </>
        )
      },
      {
        name: 'Accessibility & semantics',
        depth: 'Working',
        usedFor: (
          <>
            Keyboard operability, focus management, and reduced-motion paths on
            interactive work.
          </>
        ),
        opinion: (
          <>
            Cheaper as a constraint than as a remediation project, and it makes
            the markup better anyway. This page ships zero client-side
            JavaScript for exactly that reason.
          </>
        )
      }
    ]
  },
  {
    id: 'data',
    label: 'Data',
    blurb:
      'State that has to survive a deploy, a partner outage, and a rewrite.',
    rows: [
      {
        name: 'MongoDB / Mongoose',
        depth: 'Primary',
        usedFor: <>Production services and freelance product work.</>,
        opinion: (
          <>
            Fine when the document really is the unit of work. The moment you
            are joining in application code, the model was wrong.
          </>
        )
      },
      {
        name: 'DynamoDB',
        depth: 'Working',
        usedFor: <>AWS-native services with known access patterns.</>,
        opinion: (
          <>
            Great when the query list is settled. Every &ldquo;can we also
            filter by&hellip;&rdquo; is a new index and a backfill.
          </>
        )
      },
      {
        name: 'PostgreSQL',
        depth: 'Working',
        usedFor: <>Relational domains and reporting-shaped problems.</>,
        opinion: (
          <>
            My default recommendation for a green field. Teams that pick a
            document store to avoid writing a migration usually pay for it for
            two years.
          </>
        )
      }
    ]
  },
  {
    id: 'runtime',
    label: 'Runtime & delivery',
    blurb:
      'Getting it out, keeping it up, and being able to rebuild it on purpose.',
    rows: [
      {
        name: 'AWS + CloudFormation',
        depth: 'Primary',
        usedFor: (
          <>
            Oversaw and helped implement the Chick-fil-A project infrastructure
            migration to CloudFormation.
          </>
        ),
        opinion: (
          <>
            Boring services first. And do the infrastructure-as-code migration
            during the growth, not after it &mdash; the calm quarter never
            arrives.
          </>
        )
      },
      {
        name: 'Docker',
        depth: 'Working',
        usedFor: (
          <>Service packaging and local parity with deployed environments.</>
        ),
        opinion: (
          <>
            The value is a build that behaves the same on a laptop and in CI. If
            it does not, the container is decoration.
          </>
        )
      },
      {
        name: 'Kubernetes',
        depth: 'Working',
        usedFor: <Todo>which engagement the Kubernetes work came from</Todo>,
        opinion: (
          <>
            I ask who owns it before I recommend it. Without a platform owner, a
            managed container runtime beats a cluster every time.
          </>
        )
      },
      {
        name: 'GitHub Actions / CI-CD',
        depth: 'Primary',
        usedFor: (
          <>Build, test, release, and environment promotion pipelines.</>
        ),
        opinion: (
          <>
            The pipeline is a product and the team is its user. Past ten
            minutes, people stop reading the output and start re-running it.
          </>
        )
      }
    ]
  },
  {
    id: 'operate',
    label: 'Operate',
    blurb:
      'The difference between shipping something and being responsible for it.',
    rows: [
      {
        name: 'Datadog',
        depth: 'Primary',
        usedFor: (
          <>
            Metrics, dashboards, and monitors on the Chick-fil-A delivery
            platform.
          </>
        ),
        opinion: (
          <>
            Put the business metric next to the system metric. A dashboard
            showing revenue per minute gets watched; a CPU graph does not.
          </>
        )
      },
      {
        name: 'Splunk',
        depth: 'Working',
        usedFor: <>Log search and investigation during and after incidents.</>,
        opinion: (
          <>
            Logging is a design decision, not an afterthought. If you cannot
            reconstruct one order&rsquo;s journey from the logs, you will not
            debug it at 2am.
          </>
        )
      },
      {
        name: 'OpsGenie / on-call',
        depth: 'Working',
        usedFor: (
          <>Alert routing and rotation on a revenue-critical platform.</>
        ),
        opinion: (
          <>
            Every page maps to a symptom a customer would feel. Everything else
            is a dashboard, and treating it otherwise is how teams learn to
            ignore alerts.
          </>
        )
      }
    ]
  },
  {
    id: 'applied-ai',
    label: 'Applied AI',
    blurb:
      'Explored deliberately and in public, held to the same standard as everything else.',
    rows: [
      {
        name: 'LLM & agent tooling',
        depth: 'Exploring',
        usedFor: (
          <>
            Development workflows, prototyping, and working out where a model
            genuinely beats a deterministic approach.
          </>
        ),
        opinion: (
          <>
            Treat the model as a component with a failure rate. Design the
            fallback before the demo.
          </>
        )
      },
      {
        name: 'Voice & generative media',
        depth: 'Exploring',
        usedFor: (
          <>
            Hands-on experiments &mdash; voice cloning from short samples,
            generative show control on real hardware.
          </>
        ),
        opinion: (
          <>
            The hard constraints are latency and consent, not model quality.
            Both are product problems before they are ML problems.
          </>
        )
      }
    ]
  }
]

export const seniority: Array<{
  index: string
  label: string
  body: React.ReactNode
}> = [
  {
    index: '01',
    label: 'Named ownership',
    body: (
      <>
        Backend lead on the Apple chatbot platform. Project engineering lead on
        Chick-fil-A third-party delivery. Both were the role, not a description
        of the vibe.
      </>
    )
  },
  {
    index: '02',
    label: 'Scale under pressure',
    body: (
      <>
        1M &rarr; 15M users at 100% uptime. Under $1M/day &rarr; $5M/day in
        delivery revenue through Covid. Neither was a planned, comfortable ramp.
      </>
    )
  },
  {
    index: '03',
    label: 'Working across org boundaries',
    body: (
      <>
        Coordinated directly with DoorDash engineering to ship checkout inside
        the Chick-fil-A iOS app, and coordinated the Apple Card integration
        launch.
      </>
    )
  },
  {
    index: '04',
    label: 'Modernisation without downtime',
    body: (
      <>
        AngularJS &rarr; Vue, ES5 &rarr; ES6, Node 5 &rarr; 12, and an
        infrastructure move to CloudFormation &mdash; all on systems that were
        not allowed to stop.
      </>
    )
  },
  {
    index: '05',
    label: 'Mentorship',
    body: (
      <>
        Consulting is teaching by default: you leave, and the client team keeps
        the code.{' '}
        <Todo>engineers you have onboarded, mentored, or promoted</Todo>
      </>
    )
  },
  {
    index: '06',
    label: 'Business fluency',
    body: (
      <>
        Economics degree, four years managing property, and a stint as COO who
        wrote the business plan and built the prototype. I can explain a
        tradeoff to someone who does not write code.
      </>
    )
  }
]
