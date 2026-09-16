import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devon Bull - Solutions Architect',
  description: 'Solutions Architect at Big Nerd Ranch.'
}

export default function Home() {
  return (
    <main>
      <section className="identity">
        <h1>Devon Bull</h1>
        <p>Solutions Architect</p>
      </section>
    </main>
  )
}
