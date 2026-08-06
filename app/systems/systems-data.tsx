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
    id: 'hardware-cloud-seam',
    index: '01',
    situation:
      'The firmware team and the cloud team have different ideas about the contract, and nobody notices until integration week.',
    moves: [
      <>
        Write the interface down first &mdash; payload, units, error cases,
        what happens when the device has been offline for three days &mdash; and
        make both sides review it before either writes code.
      </>,
      <>
        Build the fake early: a device simulator for the cloud team, a stub
        service for the firmware team. Integration stops being an event.
      </>,
      <>
        Version the contract from day one. Devices in the field update on their
        own schedule; the server has to speak to every version still out there.
      </>
    ],
    evidence: (
      <Todo>
        the engagement where you did this, and what integration week looked like
        as a result
      </Todo>
    )
  },
  {
    id: 'field-failure',
    index: '02',
    situation:
      'It works on the bench and fails in the field, and the only report you get is “it stopped working.”',
    moves: [
      <>
        Assume you will never reproduce it. Instrument first: persist enough
        local state and event history that the device can explain its own last
        hour when it reconnects.
      </>,
      <>
        Design for the environment you actually have &mdash; brownouts, a
        network that disappears, a person who unplugs it. Local-first state,
        idempotent retries, safe restart.
      </>,
      <>
        Give the failure a human-recoverable path. If a shift lead can fix it by
        power-cycling one thing, you have removed a truck roll.
      </>
    ],
    evidence: (
      <Todo>
        the specific field failure you chased down, and how you finally caught
        it
      </Todo>
    )
  },
  {
    id: 'blind-production',
    index: '03',
    situation:
      'Production is degraded, three teams are on the call, and nobody can say which layer is lying.',
    moves: [
      <>
        Start from the symptom the user feels, not the dashboard that is red.
        Most resource alerts are noise; latency and error rate at the edge are
        not.
      </>,
      <>
        Trace one real request end to end. Missing spans are themselves the
        finding &mdash; you have just located the part of the system nobody
        owns.
      </>,
      <>
        Write the post-mortem with the boring detail in it, then delete the
        monitors that did not help. An alert nobody acts on is worse than no
        alert.
      </>
    ],
    evidence: (
      <Todo>
        an incident you led or were on point for &mdash; detection time,
        resolution, what changed afterwards
      </Todo>
    )
  },
  {
    id: 'slow-delivery',
    index: '04',
    situation:
      'The team ships slowly and every explanation is a different one.',
    moves: [
      <>
        Measure the loop, not the people: commit to green build, green build to
        deployed, deployed to observed. The bottleneck is almost always one of
        those three and it is almost never the one people name.
      </>,
      <>
        Make the paved road faster than the workaround. Nobody follows a process
        that costs them twenty minutes.
      </>,
      <>
        Delete tests that only fail for flaky reasons and replace them with ones
        that would have caught the last real bug.
      </>
    ],
    evidence: (
      <Todo>
        the before/after numbers on a pipeline or release process you fixed
      </Todo>
    )
  },
  {
    id: 'ai-reality-check',
    index: '05',
    situation:
      'Someone wants AI in the product and there is no way to tell whether it would actually help.',
    moves: [
      <>
        Find the workflow first. A model is a component with a failure rate; it
        only earns a place if the workflow can absorb being wrong sometimes.
      </>,
      <>
        Build the smallest honest prototype and evaluate it against a fixed set
        of real inputs. Vibes are not an evaluation.
      </>,
      <>
        Decide the fallback before shipping. What the user sees when the model
        is unavailable, slow, or confidently wrong is the actual product
        decision.
      </>
    ],
    evidence: (
      <>
        Applied experiments in public &mdash; voice cloning, generative
        toolchains &mdash; written up in the field notes.
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
    title: 'Postgres by default; DynamoDB only when the access pattern is settled',
    context: (
      <>
        A service with an unknown growth curve and a product team still changing
        its mind about the domain model every sprint.{' '}
        <Todo>which engagement this was, and the traffic shape</Todo>
      </>
    ),
    options: [
      'Postgres and accept operating a relational database',
      'DynamoDB for scale headroom and no capacity planning',
      'Mongo because the payloads were already documents'
    ],
    call: (
      <>
        Postgres, unless someone can write the access patterns on a whiteboard
        and defend them. DynamoDB is an excellent key-value store and a
        punishing place to change your mind &mdash; a new query pattern means a
        new index, a backfill, and a migration you did not plan.
      </>
    ),
    consequence: (
      <>
        Slower ceiling, far cheaper iteration. Two ad-hoc reporting requests
        that would have been multi-day work in a key-value store were answered
        with SQL the same afternoon.
      </>
    ),
    again: (
      <>
        Yes. I would flip the default only for a workload that is genuinely
        write-heavy, uniform, and known &mdash; telemetry ingest, session state,
        device shadows.
      </>
    )
  },
  {
    id: 'dec-02',
    code: 'DEC-02',
    title: 'Go for services the client’s team has to maintain after I leave',
    context: (
      <>
        Consulting hands the code back. The question is not what I write fastest
        &mdash; it is what a stranger can read at 3am eighteen months from now.
      </>
    ),
    options: [
      'Node/TypeScript to match the frontend and share types',
      'Go for one binary, one obvious way to do things',
      'Whatever the existing team already knew'
    ],
    call: (
      <>
        The existing team&rsquo;s language wins if they have one. If it is a
        green field, Go: a single static binary, a standard library that covers
        most of what a service needs, and very little room for a clever
        abstraction that only the author understands.
      </>
    ),
    consequence: (
      <>
        Less shared code with the frontend and some duplicated types. Worth it
        &mdash; a handoff that needs me to explain the framework is a failed
        handoff.
      </>
    ),
    again: (
      <>
        Yes for services. No for anything where sharing a type with the browser
        is the whole point &mdash; that is TypeScript on both ends.
      </>
    )
  },
  {
    id: 'dec-03',
    code: 'DEC-03',
    title: 'Local-first on the device; the cloud is not the source of truth',
    context: (
      <>
        Embedded systems in an operational environment where the network is
        unreliable and the business does not stop when it drops.{' '}
        <Todo>the deployment this describes, and the offline duration you designed for</Todo>
      </>
    ),
    options: [
      'Cloud-authoritative with a thin device',
      'Local-first with reconciliation on reconnect',
      'Local-only with manual export'
    ],
    call: (
      <>
        Local-first. The device keeps working when the link is gone, buffers
        what it must, and reconciles on reconnect with idempotent writes so a
        replay is harmless.
      </>
    ),
    consequence: (
      <>
        Real complexity moves onto the device: clock skew, storage limits,
        conflict rules. That complexity is worth paying because the alternative
        failure is visible to a customer standing at a counter.
      </>
    ),
    again: (
      <>
        Yes, and earlier. The retrofit from cloud-authoritative to local-first
        is one of the most expensive changes you can make to a fleet.
      </>
    )
  },
  {
    id: 'dec-04',
    code: 'DEC-04',
    title: 'No Kubernetes without someone whose job is Kubernetes',
    context: (
      <>
        Small teams keep reaching for the platform that large teams needed.{' '}
        <Todo>the engagement where this came up, and which way the client went</Todo>
      </>
    ),
    options: [
      'Managed Kubernetes (EKS/GKE) for portability',
      'Managed container runtime — ECS/Fargate, Cloud Run',
      'Plain VMs with a deploy script'
    ],
    call: (
      <>
        Kubernetes when there is a platform owner and more than a handful of
        services that genuinely need scheduling. Otherwise the managed container
        runtime, every time. I operate Kubernetes fine; I just do not think it
        is free.
      </>
    ),
    consequence: (
      <>
        Less portability on paper. In practice, a team that can deploy without
        asking anyone, and an on-call rotation that is not debugging the
        scheduler.
      </>
    ),
    again: <>Yes. This is the recommendation I have changed my mind about least.</>
  },
  {
    id: 'dec-05',
    code: 'DEC-05',
    title: 'Buy observability, own the alert taxonomy',
    context: (
      <>
        Every team wants dashboards. Very few want to be paged, and the two are
        not the same problem.
      </>
    ),
    options: [
      'Self-hosted Prometheus + Grafana + Loki',
      'Datadog and pay for it',
      'Cloud-native tooling only'
    ],
    call: (
      <>
        Buy the platform &mdash; Datadog &mdash; and spend the saved time on the
        part no vendor can do for you: deciding what actually wakes a person up.
        Every paging monitor maps to a symptom a user would notice. Everything
        else is a dashboard.
      </>
    ),
    consequence: (
      <>
        A real bill, and a rule that ingest volume gets reviewed. In exchange,
        alerts people trust, which is the only kind that gets acted on.{' '}
        <Todo>alert volume before/after, if you have the numbers</Todo>
      </>
    ),
    again: <>Yes, for any team under roughly thirty engineers.</>
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
    id: 'devices',
    label: 'Devices & firmware',
    blurb:
      'Where the software has to be right the first time, because you cannot hotfix a board in someone else’s building.',
    rows: [
      {
        name: 'Embedded C / C++',
        depth: 'Primary',
        usedFor: (
          <Todo>
            confirm the exact languages, RTOS or embedded Linux, and years on
            each
          </Todo>
        ),
        opinion: (
          <>
            Keep the hardware assumptions behind one thin abstraction layer.
            Every time I have skipped that, a board revision has cost a week.
          </>
        )
      },
      {
        name: 'Device ↔ cloud protocols',
        depth: 'Primary',
        usedFor: (
          <Todo>
            which protocols you actually shipped: BLE, MQTT, serial, gRPC, plain
            HTTPS
          </Todo>
        ),
        opinion: (
          <>
            Version the payload before the first device ships. Retrofitting a
            schema version onto a deployed fleet is a migration you run with no
            rollback.
          </>
        )
      },
      {
        name: 'Hardware-in-the-loop testing',
        depth: 'Working',
        usedFor: (
          <Todo>
            the test rig you used or built, and what it caught that a unit test
            would not
          </Todo>
        ),
        opinion: (
          <>
            The rig is the deliverable nobody budgets for and everybody uses.
            Build it in week two, not month six.
          </>
        )
      }
    ]
  },
  {
    id: 'product',
    label: 'Product surface',
    blurb:
      'The part a person touches, and the part that reveals whether the model underneath makes sense.',
    rows: [
      {
        name: 'TypeScript',
        depth: 'Primary',
        usedFor: (
          <>
            Product applications and the services around them; shared types
            across the network boundary.
          </>
        ),
        opinion: (
          <>
            Strict mode on the first commit, including{' '}
            <code>noUncheckedIndexedAccess</code>. Retrofitting strictness onto
            a mature codebase is a week nobody plans for.
          </>
        )
      },
      {
        name: 'React',
        depth: 'Primary',
        usedFor: <>Client applications, design-system work, this site.</>,
        opinion: (
          <>
            Most &ldquo;we need a state library&rdquo; problems are
            &ldquo;we fetch in the wrong place&rdquo; problems. Server
            components and plain state first; reach for the library when you can
            name the state that actually needs to be global.
          </>
        )
      },
      {
        name: 'Accessibility & semantics',
        depth: 'Working',
        usedFor: (
          <>
            Keyboard operability, focus management, reduced-motion paths on
            interactive work.
          </>
        ),
        opinion: (
          <>
            It is cheaper as a constraint than as a remediation project, and it
            makes the markup better anyway. This page has no client-side
            JavaScript for a reason.
          </>
        )
      }
    ]
  },
  {
    id: 'services',
    label: 'Services & data',
    blurb:
      'Boundaries, contracts, and the state that has to survive a deploy.',
    rows: [
      {
        name: 'Node.js',
        depth: 'Primary',
        usedFor: <>APIs, integrations, background jobs, tooling.</>,
        opinion: (
          <>
            Excellent for I/O-shaped work and for keeping one language across
            the stack. I would not choose it again for anything CPU-bound.
          </>
        )
      },
      {
        name: 'Go',
        depth: 'Working',
        usedFor: <>Services meant to be handed to a client team and operated.</>,
        opinion: (
          <>
            One binary, one obvious way to do a thing, readable by a stranger.
            The lack of expressiveness is the feature.
          </>
        )
      },
      {
        name: 'PostgreSQL',
        depth: 'Primary',
        usedFor: <>Default store for anything with relationships or reporting.</>,
        opinion: (
          <>
            Start here. Teams that pick a document store to avoid writing a
            migration usually pay for that choice for the next two years.
          </>
        )
      },
      {
        name: 'DynamoDB',
        depth: 'Working',
        usedFor: <>Known access patterns, high write volume, device state.</>,
        opinion: (
          <>
            Great when the query list is settled. Every &ldquo;can we also
            filter by…&rdquo; is a new index and a backfill.
          </>
        )
      },
      {
        name: 'MongoDB',
        depth: 'Working',
        usedFor: <>Document-shaped domains, existing client systems.</>,
        opinion: (
          <>
            Fine when the document really is the unit of work. The moment you
            are joining in application code, the model was wrong.
          </>
        )
      }
    ]
  },
  {
    id: 'runtime',
    label: 'Runtime & delivery',
    blurb: 'Getting it out, keeping it up, knowing when it is not.',
    rows: [
      {
        name: 'AWS',
        depth: 'Primary',
        usedFor: <>Primary cloud: compute, queues, managed data, IAM.</>,
        opinion: (
          <>
            Boring services first. The exciting one usually has a rough edge
            that becomes your problem at 2am.
          </>
        )
      },
      {
        name: 'Google Cloud',
        depth: 'Working',
        usedFor: <>Client environments already standardised on GCP.</>,
        opinion: (
          <>
            Cloud Run is the most underrated way to run a container if you do
            not need a scheduler.
          </>
        )
      },
      {
        name: 'Kubernetes',
        depth: 'Working',
        usedFor: <>Multi-service platforms with a dedicated platform owner.</>,
        opinion: (
          <>
            Powerful and expensive in attention. See DEC-04 &mdash; I ask who
            owns it before I recommend it.
          </>
        )
      },
      {
        name: 'GitHub Actions / CI-CD',
        depth: 'Primary',
        usedFor: <>Build, test, release, and environment promotion pipelines.</>,
        opinion: (
          <>
            The pipeline is a product and the team is its user. Past about ten
            minutes, people stop reading the output and start re-running it.
          </>
        )
      },
      {
        name: 'Datadog',
        depth: 'Working',
        usedFor: <>Metrics, traces, logs, SLO-shaped monitors, on-call.</>,
        opinion: (
          <>
            Buy the platform, own the taxonomy. If a monitor pages a human it
            must map to something a user would feel.
          </>
        )
      }
    ]
  },
  {
    id: 'applied-ai',
    label: 'Applied AI',
    blurb:
      'Explored deliberately and in public, with the same standard as everything else: does it make the work measurably better?',
    rows: [
      {
        name: 'LLM & agent tooling',
        depth: 'Exploring',
        usedFor: (
          <>
            Development workflows, prototyping, and evaluating where a model
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
            Hands-on experiments &mdash; voice cloning, generated show control
            &mdash; documented in the field notes.
          </>
        ),
        opinion: (
          <>
            The interesting constraint is latency and consent, not model
            quality. Both are product problems.
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
    label: 'Ownership',
    body: (
      <>
        I take systems end to end &mdash; the code, the deploy path, the
        dashboards, the pager.{' '}
        <Todo>the largest system you have been the named owner of</Todo>
      </>
    )
  },
  {
    index: '02',
    label: 'Mentorship',
    body: (
      <>
        Code review as teaching, not gatekeeping; pairing on the hard part
        rather than taking it.{' '}
        <Todo>engineers you have onboarded, mentored, or promoted</Todo>
      </>
    )
  },
  {
    index: '03',
    label: 'Incident response',
    body: (
      <>
        Calm on the call, blameless afterwards, and the post-mortem actually
        gets written.{' '}
        <Todo>an incident you led, with detection and resolution time</Todo>
      </>
    )
  },
  {
    index: '04',
    label: 'Architecture calls',
    body: (
      <>
        Written down before they are built, with the rejected options and the
        reason attached &mdash; the decision log above is how I work, not a
        page format.{' '}
        <Todo>a design doc or ADR you can share or paraphrase</Todo>
      </>
    )
  },
  {
    index: '05',
    label: 'Client-facing',
    body: (
      <>
        I have delivered under NDA to organisations that do not tolerate
        surprises, and I can explain a tradeoff to a stakeholder who does not
        write code.
      </>
    )
  }
]
