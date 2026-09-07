import approvedSignal from './signal.json'

type Signal = {
  publication: string
  approvedOn: string
  person: {
    name: string
    title: string
    employer: string
    tenure: string
    introduction: string
    contact: string
    github: string
    site: string
  }
  work: {
    id: string
    title: string
    client: string
    period: string
    role: string
    contribution: string
    highlights: string[]
    technologies: string[]
    caseStudy?: {
      heading: string
      paragraphs: string[]
    }[]
  }[]
  education: {
    school: string
    study: string
    year: string
  }[]
}

if (approvedSignal.publication !== 'approved') {
  throw new Error('Signal content must be approved before publication')
}

export const signal = approvedSignal satisfies Signal
