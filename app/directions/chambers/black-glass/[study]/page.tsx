import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  blackGlassStudies,
  blackGlassStudyConfigs,
  type BlackGlassStudy
} from '../../chamber-config'
import { ChamberExperiment } from '../../chamber-experiment'

type StudyPageProps = {
  params: Promise<{ study: string }>
}

function resolveStudy(value: string): BlackGlassStudy | null {
  return blackGlassStudies.find((study) => study === value) ?? null
}

export function generateStaticParams() {
  return blackGlassStudies
    .filter((study) => study !== 'baseline')
    .map((study) => ({ study }))
}

export async function generateMetadata({
  params
}: StudyPageProps): Promise<Metadata> {
  const { study: studyParam } = await params
  const study = resolveStudy(studyParam)
  if (!study || study === 'baseline') return {}
  const config = blackGlassStudyConfigs[study]
  return {
    title: `${config.name} | Black Glass Study`,
    description: config.description,
    robots: { index: false, follow: false }
  }
}

export default async function BlackGlassStudyPage({ params }: StudyPageProps) {
  const { study: studyParam } = await params
  const study = resolveStudy(studyParam)
  if (!study || study === 'baseline') notFound()

  return <ChamberExperiment variant="black-glass" blackGlassStudy={study} />
}
