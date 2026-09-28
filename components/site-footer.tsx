import Link from 'next/link'
import { profile } from '@/config/profile'

export function SiteFooter() {
  return (
    <footer className="site-footer border-border border-t">
      <div className="mx-auto flex max-w-[980px] flex-col gap-5 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-mute">{profile.name}</p>
        <nav
          aria-label="Contact and profile"
          className="flex flex-wrap gap-x-6 gap-y-2"
        >
          <a
            className="inline-flex min-h-11 items-center hover:underline"
            href={profile.links.linkedin}
          >
            LinkedIn
          </a>
          <a
            className="inline-flex min-h-11 items-center hover:underline"
            href={profile.links.github}
          >
            GitHub
          </a>
          <Link
            className="inline-flex min-h-11 items-center hover:underline"
            href="/profile.md"
          >
            Profile (Markdown)
          </Link>
          <Link
            className="inline-flex min-h-11 items-center hover:underline"
            href="/profile.json"
          >
            JSON
          </Link>
        </nav>
      </div>
    </footer>
  )
}
