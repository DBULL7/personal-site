'use client'

import { useState } from 'react'
import { experiences, Experience } from '@/config/experience'
import { ChevronDown } from 'lucide-react'

const TechBadge = ({ tech }: { tech: string }) => (
  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
    {tech}
  </span>
)

const AccordionItem = ({
  experience,
  isOpen,
  onToggle,
  index
}: {
  experience: Experience
  isOpen: boolean
  onToggle: () => void
  index: number
}) => {
  const dateRange = experience.endDate
    ? `${experience.startDate} - ${experience.endDate}`
    : `${experience.startDate} - Present`

  return (
    <div
      className={`overflow-hidden rounded-xl border transition-all duration-300 ${
        isOpen
          ? 'border-blue-300 bg-white shadow-lg dark:border-blue-700 dark:bg-slate-900'
          : 'border-gray-200 bg-white/50 hover:border-gray-300 dark:border-gray-800 dark:bg-slate-900/50 dark:hover:border-gray-700'
      }`}
    >
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          {/* Company initial or logo placeholder */}
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold transition-colors ${
              isOpen
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {experience.company.charAt(0)}
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              {experience.company}
              {!experience.endDate && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                  Current
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {experience.role}
              <span className="mx-2 text-gray-400">·</span>
              <span className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400">
                {experience.type}
              </span>
              <span className="mx-2 text-gray-400">·</span>
              <span className="text-gray-500">{dateRange}</span>
            </p>
          </div>
        </div>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expandable content */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 px-5 pb-5 pt-4 dark:border-gray-800">
            <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-400">
              {experience.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <TechBadge key={tech} tech={tech} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ExperienceAccordion = () => {
  // Default to first item (current role) being open
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
        Experience
      </h2>

      <div className="space-y-3">
        {experiences.map((experience, index) => (
          <AccordionItem
            key={`${experience.company}-${experience.startDate}`}
            experience={experience}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
