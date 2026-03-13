export async function generateStaticParams() {
  return []
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <article className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">{slug}</h1>
    </article>
  )
}