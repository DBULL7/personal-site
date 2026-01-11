import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'
import { faMicrochip, faBuilding } from '@fortawesome/free-solid-svg-icons'

interface ExperienceItem {
  company: string
  role: string
  period: string
  description: string
  icon: React.ReactNode
  highlights: string[]
}

const experiences: ExperienceItem[] = [
  {
    company: 'Apple',
    role: 'Embedded Systems Engineer',
    period: 'Contract via Consulting Firm',
    description: 'Worked on embedded engineering projects for Apple, contributing to innovative hardware-software integration solutions.',
    icon: <FontAwesomeIcon icon={faApple} className="h-8 w-8" />,
    highlights: [
      'Developed embedded systems firmware',
      'Collaborated with cross-functional hardware and software teams',
      'Contributed to product reliability and performance optimization'
    ]
  },
  {
    company: 'Chick-Fil-A',
    role: 'Embedded Systems Engineer',
    period: 'Contract via Consulting Firm',
    description: 'Engineered embedded solutions for Chick-Fil-A, focusing on operational technology and system integration.',
    icon: <FontAwesomeIcon icon={faMicrochip} className="h-8 w-8" />,
    highlights: [
      'Built embedded systems for operational efficiency',
      'Integrated hardware components with software solutions',
      'Delivered reliable, production-grade embedded code'
    ]
  }
]

const ExperienceCard = ({ experience }: { experience: ExperienceItem }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-slate-900">
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
          {experience.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {experience.company}
          </h3>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {experience.role}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {experience.period}
          </p>
        </div>
      </div>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        {experience.description}
      </p>
      <ul className="space-y-2">
        {experience.highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
            {highlight}
          </li>
        ))}
      </ul>
    </div>
  )
}

export const WorkExperienceSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:px-8 lg:px-16">
      <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
        Work Experience
      </h2>
      <p className="mx-auto mb-8 max-w-2xl text-center text-gray-600 dark:text-gray-400">
        I&apos;ve worked as a contractor through a consulting firm, contributing to embedded engineering
        projects for industry-leading companies.
      </p>
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {experiences.map((experience) => (
          <ExperienceCard key={experience.company} experience={experience} />
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All positions held through a contracting firm, working on-site with client engineering teams.
          </p>
        </div>
      </div>
    </section>
  )
}
