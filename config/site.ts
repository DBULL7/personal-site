import { profile } from './profile'

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: profile.name,
  url: 'https://devonbull.com',
  description:
    'Solutions Architect at Big Nerd Ranch. Architecture through delivery and support.',
  mainNav: [
    {
      title: 'Work',
      href: '/work'
    },
    {
      title: 'Writing',
      href: '/blog'
    }
  ],
  links: profile.links
}
