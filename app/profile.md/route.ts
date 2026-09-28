import { profileMarkdown } from '@/lib/public-profile'

export const dynamic = 'force-static'

export function GET() {
  return new Response(profileMarkdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
  })
}
