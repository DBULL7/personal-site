export const profile = {
  name: 'Devon Bull',
  role: 'Solutions Architect',
  firm: 'Big Nerd Ranch',
  location: 'Raleigh, North Carolina',
  timezone: 'US Eastern',
  email: 'devjbull@gmail.com',
  linkedin: 'https://www.linkedin.com/in/bulldevon',
  github: 'https://github.com/DBULL7',
  site: 'https://devonbull.com',
  // TODO(devon): drop the PDF at public/resume.pdf (or repoint this href).
  resume: '/resume.pdf',
  availability: {
    state: 'Open to senior, staff, and lead engineering roles',
    detail: 'Remote or Raleigh–Durham. Contract-to-hire considered.'
  },
  summary:
    'Solutions Architect at Big Nerd Ranch since 2018. Backend lead on Apple’s chatbot platform while it went from 1M to 15M users at 100% uptime. Project engineering lead on Chick-fil-A’s third-party delivery integrations through Covid, from under $1M a day to $5M a day. Economics degree, a startup, a bootcamp — then seven years of high-traffic consumer platforms.'
} as const

export type Profile = typeof profile
