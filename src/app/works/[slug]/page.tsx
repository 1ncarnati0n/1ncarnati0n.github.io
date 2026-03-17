import { getWorkSlugs, getWork } from '@/lib/content/works'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = await getWorkSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const work = await getWork(slug)

  if (!work) notFound()

  return (
    <article className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">{work.title}</h1>
      <p>{work.summary}</p>
    </article>
  )
}
