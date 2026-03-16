// ════════════════════════════════════════
// /blog/[slug] — 블로그 글 상세 페이지
// ════════════════════════════════════════
//
// 📝 핵심 개념:
//   - generateStaticParams: 빌드 시 모든 slug를 미리 생성 → 정적 HTML
//   - generateMetadata: 각 글의 SEO 메타데이터 자동 생성
//   - dangerouslySetInnerHTML: 렌더링된 HTML을 DOM에 삽입

import { notFound } from 'next/navigation'
import { getAllBlogPosts, getBlogPost } from '@/lib/content/posts'
import { renderMarkdown } from '@/lib/content/mdx'
import type { Metadata } from 'next'

// ── 빌드 시 정적 경로 생성 ──────────────────────────
// Next.js가 빌드할 때 이 함수를 호출해서
// "어떤 [slug] 값들이 존재하는지" 목록을 받아간다
// → 각 slug마다 HTML을 미리 생성 (SSG)
export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map(post => ({ slug: post.slug }))
  // [{ slug: 'hello-world' }, { slug: 'another-post' }, ...]
}

// ── SEO 메타데이터 생성 ──────────────────────────
// Next.js 16: params는 Promise → await 필요
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) return { title: 'Not Found' }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date.toISOString(),
    },
  }
}

// ── 페이지 컴포넌트 ──────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  // 글이 없으면 404
  if (!post) notFound()

  // 마크다운 → HTML 변환 (unified 파이프라인)
  const html = await renderMarkdown(post.content)

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* ── 헤더 영역 ── */}
      <header className="mb-10">
        <h1 className="text-2xl md:text-3xl font-medium mb-3">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-neutral-400">
          <time dateTime={post.date.toISOString()}>
            {post.date.toLocaleDateString('ko-KR')}
          </time>
          <span>·</span>
          <span>{post.readingTime}분 읽기</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex gap-2 mt-3">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── 구분선 ── */}
      <hr className="border-neutral-200 dark:border-neutral-800 mb-10" />

      {/* ── 본문 ── */}
      {/* dangerouslySetInnerHTML: HTML 문자열을 DOM에 직접 삽입
          "dangerous"인 이유: XSS 공격 가능성. 하지만 여기서는
          우리가 직접 생성한 HTML이므로 안전하다. */}
      <div
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}
