export type ProfileLinks = {
  linkedin: string
  github: string
  twitter: string
}

export type Profile = {
  name: string
  title: string
  employer: string
  introduction: string
  links: ProfileLinks
}

export const profile: Profile = {
  name: 'Devon Bull',
  title: 'Solutions Architect',
  employer: 'Big Nerd Ranch',
  introduction:
    'I take software from architecture through delivery and support. My work includes a solo cloud-console migration for Apple and engineering leadership on Chick-fil-A delivery integrations.',
  links: {
    linkedin: 'https://www.linkedin.com/in/bulldevon',
    github: 'https://github.com/DBULL7',
    twitter: 'https://twitter.com/Devon_Bull'
  }
}
