import type { WorksProject } from '$lib/types/content'
import { walkMarkdownFiles, WORKS_DIR } from './filesystem'
import { normalizeWorkProject } from './frontmatter'

let cachedWorks: WorksProject[] | null = null

async function getWorksIndex() {
  if (cachedWorks) return cachedWorks

  const works: WorksProject[] = []

  for (const source of await walkMarkdownFiles(WORKS_DIR)) {
    const work = await normalizeWorkProject(source.filePath, source.sourcePathParts)
    if (work) works.push(work)
  }

  cachedWorks = works.sort((a, b) => b.date.getTime() - a.date.getTime())
  return cachedWorks
}

export async function getWorkSlugs(): Promise<string[]> {
  return (await getWorksIndex()).map((work) => work.slug)
}

export async function getWork(slug: string): Promise<WorksProject | null> {
  return (await getWorksIndex()).find((work) => work.slug === slug) ?? null
}

export async function getAllWorks(): Promise<WorksProject[]> {
  return getWorksIndex()
}
