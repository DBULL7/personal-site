'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import styles from './systems.module.css'

const SpaceScene = dynamic(
  () =>
    import('@/components/space/space-scene').then(
      (module) => module.SpaceScene
    ),
  {
    ssr: false,
    loading: () => <div className={styles.sceneFallback} aria-hidden="true" />
  }
)

const layers = {
  interface: {
    number: '01',
    short: 'Interface',
    title: 'Product interface',
    tools: 'TypeScript · React',
    role: 'Turn complex product behavior into a clear, accessible interaction model.',
    question: 'Can a person understand and trust what the system is doing?',
    inputs: 'Product intent · user context',
    output: 'Usable product surface'
  },
  services: {
    number: '02',
    short: 'Services',
    title: 'Application services',
    tools: 'Node.js · Go',
    role: 'Shape APIs, integrations, background work, and production services for clarity and change.',
    question: 'Can the system evolve without making every change risky?',
    inputs: 'Requests · events · integrations',
    output: 'Legible system behavior'
  },
  data: {
    number: '03',
    short: 'Data',
    title: 'Data model',
    tools: 'Postgres · DynamoDB · MongoDB',
    role: 'Choose pragmatic relational, document, or key-value models around the shape of the problem.',
    question:
      'Does the model preserve the information the product actually needs?',
    inputs: 'Domain rules · access patterns',
    output: 'Durable system state'
  },
  runtime: {
    number: '04',
    short: 'Runtime',
    title: 'Cloud runtime',
    tools: 'AWS · Google Cloud · Kubernetes',
    role: 'Create infrastructure and operating environments that support safe delivery without hiding production.',
    question: 'Can the team understand, operate, and recover the system?',
    inputs: 'Services · configuration · traffic',
    output: 'Operable production system'
  },
  feedback: {
    number: '05',
    short: 'Feedback',
    title: 'Delivery feedback',
    tools: 'CI/CD · GitHub Actions · Datadog',
    role: 'Build paved roads, automated checks, and production feedback loops that let teams move with confidence.',
    question: 'Will the team know quickly when reality diverges from intent?',
    inputs: 'Code changes · runtime signals',
    output: 'Safer, faster iteration'
  },
  exploration: {
    number: '06',
    short: 'AI',
    title: 'AI exploration',
    tools: 'Voice · agents · applied tooling',
    role: 'Explore useful AI interfaces and tools that expand creative leverage while staying grounded in a real workflow.',
    question: 'Does the new capability make the work meaningfully better?',
    inputs: 'Model capability · human workflow',
    output: 'Useful creative leverage'
  }
} as const

type LayerId = keyof typeof layers

const paths = {
  product: {
    label: 'Ship a product',
    description:
      'Trace intent from the interface through services, state, runtime, and production feedback.',
    sequence: [
      'interface',
      'services',
      'data',
      'runtime',
      'feedback'
    ] as LayerId[]
  },
  operate: {
    label: 'Operate safely',
    description:
      'Start with production feedback, then follow the loop back through runtime and service behavior.',
    sequence: ['feedback', 'runtime', 'services', 'data'] as LayerId[]
  },
  explore: {
    label: 'Explore AI',
    description:
      'Connect a new model capability to an interface, a service boundary, useful state, and a feedback loop.',
    sequence: [
      'exploration',
      'interface',
      'services',
      'data',
      'feedback'
    ] as LayerId[]
  }
} as const

type PathId = keyof typeof paths

const sceneNodeToLayer: Record<string, LayerId> = {
  typescript: 'interface',
  react: 'interface',
  node: 'services',
  go: 'services',
  data: 'data',
  cloud: 'runtime',
  platform: 'feedback',
  ai: 'exploration'
}

export function SystemsExperience() {
  const [activeLayer, setActiveLayer] = useState<LayerId>('interface')
  const [activePath, setActivePath] = useState<PathId>('product')
  const layer = layers[activeLayer]
  const path = paths[activePath]

  const selectSceneNode = useCallback((id: string) => {
    const nextLayer = sceneNodeToLayer[id]
    if (nextLayer) setActiveLayer(nextLayer)
  }, [])

  const choosePath = (id: PathId) => {
    setActivePath(id)
    setActiveLayer(paths[id].sequence[0])
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="systems-title">
        <SpaceScene mode="systems" onNodeSelect={selectSceneNode} />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroHeading}>
          <p className={styles.eyebrow}>Systems atlas · 003</p>
          <h1 id="systems-title">Breadth is useful when the parts connect.</h1>
          <p>
            My toolkit spans interfaces, services, data, cloud, delivery, and AI
            exploration. This atlas shows the handoffs between them—not just the
            names of the tools.
          </p>
        </div>

        <div className={styles.pathExplorer}>
          <div className={styles.pathHeader}>
            <div>
              <span className={styles.pathKicker}>Select an outcome path</span>
              <div
                className={styles.pathTabs}
                role="group"
                aria-label="Engineering outcome paths"
              >
                {Object.entries(paths).map(([id, item]) => (
                  <button
                    key={id}
                    type="button"
                    className={
                      activePath === id ? styles.pathTabActive : styles.pathTab
                    }
                    onClick={() => choosePath(id as PathId)}
                    aria-pressed={activePath === id}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <p>{path.description}</p>
          </div>

          <div
            className={styles.signalPath}
            aria-label={`${path.label} capability sequence`}
          >
            {Object.entries(layers).map(([id, item]) => {
              const layerId = id as LayerId
              const sequenceIndex = path.sequence.indexOf(layerId)
              const isInPath = sequenceIndex >= 0
              const isActive = activeLayer === layerId

              return (
                <button
                  key={id}
                  type="button"
                  className={`${styles.layerNode} ${isInPath ? styles.layerNodeInPath : ''} ${isActive ? styles.layerNodeActive : ''}`}
                  onClick={() => setActiveLayer(layerId)}
                  aria-pressed={isActive}
                >
                  <span className={styles.layerOrder}>
                    {isInPath
                      ? String(sequenceIndex + 1).padStart(2, '0')
                      : '—'}
                  </span>
                  <strong>{item.short}</strong>
                  <small>{item.tools}</small>
                </button>
              )
            })}
          </div>

          <article
            className={styles.activeLayer}
            aria-live="polite"
            aria-atomic="true"
          >
            <div className={styles.activeLayerHeading}>
              <span>{layer.number}</span>
              <div>
                <p>Active capability</p>
                <h2>{layer.title}</h2>
              </div>
              <strong>{layer.tools}</strong>
            </div>
            <div className={styles.activeLayerBody}>
              <p>{layer.role}</p>
              <dl>
                <div>
                  <dt>Input</dt>
                  <dd>{layer.inputs}</dd>
                </div>
                <div>
                  <dt>Output</dt>
                  <dd>{layer.output}</dd>
                </div>
              </dl>
              <blockquote>{layer.question}</blockquote>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.index} aria-labelledby="index-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Capability index · plain text</p>
            <h2 id="index-title">The whole system, one layer at a time.</h2>
          </div>
          <p>
            No single tool is the point. The value is being able to follow a
            product decision down through implementation and operations—and
            bring what production teaches back to the next decision.
          </p>
        </div>

        <div className={styles.indexGrid}>
          {Object.entries(layers).map(([id, item]) => (
            <article key={id} className={styles.indexCard}>
              <div className={styles.indexTopline}>
                <span>{item.number}</span>
                <span>{item.tools}</span>
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.role}</p>
              </div>
              <dl>
                <div>
                  <dt>System question</dt>
                  <dd>{item.question}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.model} aria-labelledby="model-title">
        <div className={styles.modelIntro}>
          <p className={styles.eyebrow}>Systems model</p>
          <h2 id="model-title">A loop, not a stack.</h2>
          <p>
            Product intent moves toward production. Runtime evidence moves back
            toward the product. Good engineering keeps both directions visible.
          </p>
        </div>
        <ol className={styles.loop}>
          <li>
            <span>01</span>
            <strong>Frame</strong>
            <small>Understand the product and operating context.</small>
          </li>
          <li>
            <span>02</span>
            <strong>Connect</strong>
            <small>Design the boundaries and handoffs between layers.</small>
          </li>
          <li>
            <span>03</span>
            <strong>Deliver</strong>
            <small>Make change safe enough to move with confidence.</small>
          </li>
          <li>
            <span>04</span>
            <strong>Learn</strong>
            <small>Use production feedback to improve the next decision.</small>
          </li>
        </ol>
      </section>

      <section className={styles.next} aria-labelledby="systems-next-title">
        <div>
          <p className={styles.eyebrow}>Context behind the toolkit</p>
          <h2 id="systems-next-title">See where the range came from.</h2>
        </div>
        <div>
          <p>
            The career map connects these capabilities to consulting, embedded
            client work, and an approach to engineering leadership.
          </p>
          <Link href="/career">
            Explore the career map <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
