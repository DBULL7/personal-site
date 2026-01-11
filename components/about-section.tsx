import React from 'react'

export const AboutSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:px-8 lg:px-16">
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
        About Me
      </h2>
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-900">
          <p className="mb-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            I&apos;m a passionate Software Engineer with a deep love for building innovative
            solutions. My journey in tech has taken me through diverse projects, from embedded
            systems to full-stack web applications.
          </p>
          <p className="mb-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            I thrive on solving complex problems and continuously learning new technologies.
            Whether it&apos;s optimizing backend performance, crafting intuitive user interfaces,
            or diving into low-level embedded code, I bring curiosity and dedication to every
            project.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            When I&apos;m not coding, you can find me exploring the latest in AI, contributing
            to open-source projects, or tinkering with new development tools.
          </p>
        </div>
      </div>
    </section>
  )
}
