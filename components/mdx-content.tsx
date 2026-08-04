'use client'

import React from 'react'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'

// Define your custom MDX components.
const mdxComponents: MDXComponents = {
  // Override the default <a> element to use the next/link component.
  a: ({ href, children }) => {
    const isExternal = typeof href === 'string' && /^(https?:)?\/\//.test(href)
    return (
      <Link
        href={href as string}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer' : undefined}
      >
        {children}
        {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
      </Link>
    )
  }

  // Add a custom component.
}

interface MDXContentProps {
  code: string
  [key: string]: any
}

export function MDXContent({ code, ...props }: MDXContentProps) {
  const Component = useMDXComponent(code)
  return <Component components={mdxComponents} {...props} />
}
