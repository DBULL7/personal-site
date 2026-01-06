'use client'

import { experiences, Experience } from '@/config/experience'

const TechBadge = ({ tech }: { tech: string }) => (
  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
    {tech}
  </span>
)

const TimelineItem = ({
  experience,
  isLast
}: {
  experience: Experience
  isLast: boolean
}) => {
  const dateRange = experience.endDate
    ? `${experience.startDate} - ${experience.endDate}`
    : `${experience.startDate} - Present`

  return (
    <div className="relative flex gap-6 pb-8 last:pb-0">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-[28px] h-full w-0.5 bg-gradient-to-b from-blue-500 to-blue-500/20 dark:from-blue-400 dark:to-blue-400/20" />
      )}

      {/* Timeline dot */}
      <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
        <div className="h-3 w-3 rounded-full border-2 border-blue-500 bg-white dark:border-blue-400 dark:bg-slate-950" />
        <div className="absolute h-6 w-6 animate-ping rounded-full bg-blue-500/20 dark:bg-blue-400/20" />
      </div>

      {/* Content card */}
      <div className="group flex-1 rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-slate-900/80 dark:hover:border-blue-700">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {experience.company}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {experience.role}
              <span className="mx-2 text-gray-400 dark:text-gray-600">•</span>
              <span className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400">
                {experience.type}
              </span>
            </p>
          </div>
          <time className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-500 sm:mt-0">
            {dateRange}
          </time>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {experience.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const ExperienceTimeline = () => {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
        Experience
      </h2>
      <div className="relative">
        {experiences.map((experience, index) => (
          <TimelineItem
            key={`${experience.company}-${experience.startDate}`}
            experience={experience}
            isLast={index === experiences.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
