export const profile = {
  name: 'Devon Bull',
  role: 'Product engineer — full-stack',
  firm: 'Stellar Elements, an Amdocs company',
  firmFormerly: 'Big Nerd Ranch',
  location: 'Raleigh, North Carolina',
  timezone: 'US Eastern',
  email: 'devjbull@gmail.com',
  linkedin: 'https://www.linkedin.com/in/bulldevon',
  github: 'https://github.com/DBULL7',
  site: 'https://devonbull.com',
  // TODO(devon): drop the PDF at public/resume.pdf (or repoint this href).
  resume: '/resume.pdf',
  availability: {
    state: 'Open to product engineer, senior, and staff roles',
    detail: 'Remote or Raleigh–Durham. Contract-to-hire considered.'
  },
  summary:
    'Seven years at one firm, most of it building for Apple. Backend lead on Apple’s chatbot while it went from 1M to 15M users at 100% uptime. Engineering lead on Chick-fil-A’s delivery integrations through Covid, from under $1M a day to $5M a day. Then two years as the sole engineer on an Apple internal product, and now Apple’s internal cloud site as it grows into a full developer portal. Economics degree, a startup, a bootcamp — then the hard thing, repeatedly.'
} as const

export type Profile = typeof profile
