export type ProfileLinks = {
  linkedin: string
  github: string
  twitter: string
}

export type Engagement = {
  id: string
  product: string
  client: string
  employer: string
  role: string
  period: string
  summary: string
  highlights: string[]
  embeddedLine: string
  logoSrc?: string
}

export type Profile = {
  name: string
  title: string
  employer: string
  introduction: string
  links: ProfileLinks
  engagements: Engagement[]
}

const bnr = 'Big Nerd Ranch'
const appleEmbedded =
  "Embedded full-time with Apple's engineering team through Big Nerd Ranch."
const cfaEmbedded =
  "Embedded full-time with Chick-fil-A's engineering team through Big Nerd Ranch."

export const profile: Profile = {
  name: 'Devon Bull',
  title: 'Solutions Architect',
  employer: bnr,
  introduction:
    'I take software from architecture through delivery and support. My work includes a solo cloud-console migration for Apple and engineering leadership on Chick-fil-A delivery integrations.',
  links: {
    linkedin: 'https://www.linkedin.com/in/bulldevon',
    github: 'https://github.com/DBULL7',
    twitter: 'https://twitter.com/Devon_Bull'
  },
  engagements: [
    {
      id: 'cloud-portal',
      product: 'Cloud Portal',
      client: 'Apple',
      employer: bnr,
      role: 'Solutions Architect',
      period: 'October 2024 to present',
      summary:
        'Frontend engineer on Apple Cloud Portal, a destination for Apple engineers to manage infrastructure. Porting Third Party Cloud Console into the portal so third-party cloud management sits with the rest of Apple tooling.',
      highlights: [
        'Porting Third Party Cloud Console into Portal.',
        'Implemented an LLM chat interface.',
        'React and TypeScript with React Query in an Nx monorepo.'
      ],
      embeddedLine: appleEmbedded
    },
    {
      id: 'cloud-console',
      product: 'Third Party Cloud Console',
      client: 'Apple',
      employer: bnr,
      role: 'Solo engineer',
      period: 'July 2022 to October 2024',
      summary:
        'Sole engineer on a React portal for Apple teams using AWS, GCP, and AliCloud. Owned architecture, implementation, delivery, and support, including an Angular-to-React port.',
      highlights: [
        'Built workflows for access management, VPC configuration, and account details.',
        'Ported the Angular application to React while adding features.',
        'Supported legacy applications through the migration.'
      ],
      embeddedLine: appleEmbedded
    },
    {
      id: 'delivery-integrations',
      product: 'Third-party delivery',
      client: 'Chick-fil-A',
      employer: bnr,
      role: 'Project engineering lead',
      period: '2020 to 2022',
      summary:
        'Led engineering for DoorDash, Uber Eats, and Grubhub integrations through Covid growth, from under $1M a day to $5M a day by 2022.',
      highlights: [
        'Implemented combo meals on Uber Eats.',
        'Coordinated with DoorDash engineering on checkout in the Chick-fil-A iOS app.',
        'Moved project infrastructure to AWS CloudFormation.',
        'Improved logging, monitoring, and observability.'
      ],
      embeddedLine: cfaEmbedded
    },
    {
      id: 'chatbot',
      product: 'Chatbot',
      client: 'Apple',
      employer: bnr,
      role: 'Backend lead',
      period: '2018 to 2020',
      summary:
        'Backend lead on the Apple chatbot while it grew from 1M to 15M users at 100% uptime. Implemented Apple Card integration and helped coordinate launch.',
      highlights: [
        'Helped rewrite the frontend from Angular 1 to Vue.',
        'Improved page load time from 60s to 2s.',
        'Helped upgrade Node.js from 5 to 12.'
      ],
      embeddedLine: appleEmbedded
    }
  ]
}
