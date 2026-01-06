export interface Experience {
  company: string
  role: string
  type: 'contract' | 'full-time' | 'part-time'
  startDate: string
  endDate: string | null
  description: string
  technologies: string[]
  logo?: string
}

export const experiences: Experience[] = [
  {
    company: 'Apple',
    role: 'Senior Software Engineer',
    type: 'contract',
    startDate: '2022',
    endDate: null,
    description:
      'Building scalable backend services and developer tooling for internal platforms.',
    technologies: ['Node.js', 'React', 'TypeScript', 'AWS', 'Kubernetes'],
    logo: '/logos/apple.svg'
  },
  {
    company: 'Chick-Fil-A',
    role: 'Software Engineer',
    type: 'contract',
    startDate: '2021',
    endDate: '2022',
    description:
      'Developed high-performance backend microservices for restaurant operations.',
    technologies: ['Golang', 'Kubernetes', 'GCP', 'PostgreSQL'],
    logo: '/logos/cfa.svg'
  },
  {
    company: 'Apple',
    role: 'Full Stack Engineer',
    type: 'contract',
    startDate: '2020',
    endDate: '2021',
    description:
      'Built full-stack chatbot platform serving millions of customer interactions.',
    technologies: ['Node.js', 'TypeScript', 'React', 'MongoDB'],
    logo: '/logos/apple.svg'
  }
]
