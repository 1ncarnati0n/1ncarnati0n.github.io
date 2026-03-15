// generateStaticParams: 빌드 시 어떤 slug들이 존재하는지 미리 알려줌
// → Vercel이 각 글을 정적 HTML로 미리 생성 (빠른 로딩)
export async function generateStaticParams() {
  // TODO: Phase 4에서 실제 slug 목록 반환
  return []
}

// Next.js 15+에서는 params가 Promise → await 필요
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // TODO: Phase 4에서 slug로 마크다운 파일 읽기 → MDX 렌더링
  return (
    <article className="max-w-3xl mx-auto px-10 py-12">
      <h1 className="text-xl font-bold">{slug}</h1>
    </article>
  )
}