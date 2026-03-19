import { getWorkSlugs, getWork } from '@/lib/content/works'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = await getWorkSlugs()
  return slugs.length > 0 ? slugs.map((slug) => ({ slug })) : [{ slug: '__placeholder__' }]
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (slug === '__placeholder__') {
    notFound()
  }

  const work = await getWork(slug)

  if (!work) notFound()

  return (
    <article className="max-w-5xl mx-auto">
      <h1 className="font-bold">{work.title}</h1>
      <p>{work.summary}</p>
    </article>
  )
}