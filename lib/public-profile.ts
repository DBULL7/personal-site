import { profile } from '@/config/profile'
import { siteConfig } from '@/config/site'
import { publicPosts } from '@/lib/public-posts'

const absoluteUrl = (path: string) => new URL(path, siteConfig.url).href

// These exports are views of the same public content used by the HTML pages.
// A source URL identifies the self-reported claim, not independent verification.
export const publicProfile = {
  schemaVersion: '1.0',
  sourceType: 'self-reported portfolio',
  url: siteConfig.url,
  name: profile.name,
  title: profile.title,
  employer: profile.employer,
  introduction: profile.introduction,
  links: profile.links,
  engagements: profile.engagements.map((engagement) => ({
    id: engagement.id,
    sourceUrl: absoluteUrl(`/work#${engagement.id}`),
    product: engagement.product,
    client: engagement.client,
    employer: engagement.employer,
    role: engagement.role,
    period: engagement.period,
    relationship: engagement.embeddedLine,
    summary: engagement.summary,
    highlights: engagement.highlights
  })),
  writing: publicPosts.map((post) => ({
    title: post.title,
    url: absoluteUrl(post.path),
    published: post.date,
    description: post.description,
    tags: post.tags
  }))
}

export const profileMarkdown = [
  `# ${profile.name}`,
  '',
  `> ${profile.title} at ${profile.employer}.`,
  '',
  profile.introduction,
  '',
  `Source: ${siteConfig.url}. These are self-reported career details. Apple and Chick-fil-A are clients; ${profile.employer} is the employer for the engagements below.`,
  '',
  '## Work',
  ...publicProfile.engagements.flatMap((entry) => [
    '',
    `### ${entry.product}`,
    '',
    `Source: ${entry.sourceUrl}`,
    `Client: ${entry.client}`,
    `Employer: ${entry.employer}`,
    `Role: ${entry.role}`,
    `Period: ${entry.period}`,
    '',
    entry.relationship,
    '',
    entry.summary,
    '',
    ...entry.highlights.map((highlight) => `- ${highlight}`)
  ]),
  '',
  '## Writing',
  '',
  ...publicProfile.writing.map(
    (post) => `- [${post.title}](${post.url}): ${post.description}`
  ),
  '',
  '## Contact and profiles',
  '',
  ...Object.entries(profile.links).map(([name, url]) => `- [${name}](${url})`),
  ''
].join('\n')

export const profileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${siteConfig.url}/#profile`,
  url: siteConfig.url,
  mainEntity: {
    '@type': 'Person',
    '@id': `${siteConfig.url}/#person`,
    name: profile.name,
    url: siteConfig.url,
    jobTitle: profile.title,
    description: profile.introduction,
    worksFor: { '@type': 'Organization', name: profile.employer },
    sameAs: Object.values(profile.links)
  }
}
