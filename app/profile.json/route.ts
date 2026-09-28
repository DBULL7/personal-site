import { publicProfile } from '@/lib/public-profile'

export const dynamic = 'force-static'

export function GET() {
  return Response.json(publicProfile)
}
