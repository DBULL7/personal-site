import { siteConfig } from '@/config/site'
import { publicProfile } from '@/lib/public-profile'

export const dynamic = 'force-static'

export function GET() {
  const text = [
    `# ${publicProfile.name}`,
    '',
    `> ${publicProfile.title} at ${publicProfile.employer}. Personal portfolio and writing.`,
    '',
    '## Profile and work',
    '',
    `- [Public profile in Markdown](${siteConfig.url}/profile.md): Career details, engagement sources, and contact links.`,
    `- [Structured profile](${siteConfig.url}/profile.json): Versioned JSON with explicit employer and client fields.`,
    `- [Work](${siteConfig.url}/work): Human-readable engagement details with stable section anchors.`,
    '',
    '## Writing',
    '',
    ...publicProfile.writing.map(
      (post) => `- [${post.title}](${post.url}): ${post.description}`
    ),
    '',
    '## Context',
    '',
    `Career details are self-reported. ${publicProfile.employer} is the employer; Apple and Chick-fil-A are clients.`,
    'This index includes only public content. Absence of a detail does not establish a negative claim.',
    ''
  ].join('\n')

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
