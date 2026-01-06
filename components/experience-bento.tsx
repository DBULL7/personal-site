'use client'

import { experiences, Experience } from '@/config/experience'

const TechBadge = ({ tech }: { tech: string }) => (
  <span className="inline-block rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
    {tech}
  </span>
)

const BentoCard = ({
  experience,
  size = 'normal'
}: {
  experience: Experience
  size?: 'large' | 'normal'
}) => {
  const dateRange = experience.endDate
    ? `${experience.startDate} - ${experience.endDate}`
    : `${experience.startDate} - Present`

  const isLarge = size === 'large'

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-xl dark:border-gray-800 dark:from-slate-900 dark:to-slate-800 ${
        isLarge ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

      {/* Current badge for active role */}
      {!experience.endDate && (
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            Current
          </span>
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="mb-4">
          <h3
            className={`font-bold text-gray-900 dark:text-white ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg'}`}
          >
            {experience.company}
          </h3>
          <p
            className={`text-gray-600 dark:text-gray-400 ${isLarge ? 'text-base' : 'text-sm'}`}
          >
            {experience.role}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {experience.type} · {dateRange}
          </p>
        </div>

        {/* Description - only show on large cards or when hovered */}
        <p
          className={`leading-relaxed text-gray-600 dark:text-gray-400 ${
            isLarge
              ? 'mb-6 text-sm md:text-base'
              : 'mb-4 line-clamp-2 text-sm'
          }`}
        >
          {experience.description}
        </p>

        {/* Tech stack - pushed to bottom */}
        <div className="mt-auto flex flex-wrap gap-2">
          {experience.technologies
            .slice(0, isLarge ? undefined : 3)
            .map((tech) => (
              <TechBadge key={tech} tech={tech} />
            ))}
          {!isLarge && experience.technologies.length > 3 && (
            <span className="text-xs text-gray-500">
              +{experience.technologies.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Decorative element */}
      <div
        className={`absolute -bottom-8 -right-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-2xl transition-transform duration-500 group-hover:scale-150 ${
          isLarge ? 'h-32 w-32' : 'h-20 w-20'
        }`}
      />
    </div>
  )
}

export const ExperienceBento = () => {
  const [currentRole, ...previousRoles] = experiences

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
        Experience
      </h2>

      {/* Bento Grid Layout */}
      <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
        {/* Large card for current role */}
        <BentoCard experience={currentRole} size="large" />

        {/* Smaller cards for previous roles */}
        {previousRoles.map((experience) => (
          <BentoCard
            key={`${experience.company}-${experience.startDate}`}
            experience={experience}
            size="normal"
          />
        ))}
      </div>
    </section>
  )
}
