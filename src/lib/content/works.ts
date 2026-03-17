export type WorkItem = {
  slug: string
  title: string
  summary: string
  published: boolean
}

const works: WorkItem[] = [
  {
    slug: 'hello-world',
    title: 'Hello World',
    summary: 'Works section placeholder project.',
    published: true,
  },
]

export async function getWorkSlugs(): Promise<string[]> {
  return works.filter((work) => work.published).map((work) => work.slug)
}

export async function getWork(slug: string): Promise<WorkItem | null> {
  return works.find((work) => work.slug === slug && work.published) ?? null
}

export async function getAllWorks(): Promise<WorkItem[]> {
  return works.filter((work) => work.published)
}
