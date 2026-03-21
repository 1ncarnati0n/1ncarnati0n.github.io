import Link from 'next/link'
import { getAllBlogPosts, getBlogTree } from '@/lib/content/posts'
import { RightPanel } from '@/components/blog/RightPanel'

export default async function BlogPage() {
  const [tree, posts] = await Promise.all([
    getBlogTree(),
    getAllBlogPosts(),
  ])
  const topicCount = tree.filter((node) => node.type === 'folder').length

  return (
    <>
      {/* 본문: 포스트 목록 */}
      <section className="min-w-0">
        <div className="mb-12">
          <h2 className="text-xl font-medium">
            Blog Summaries
          </h2>
          <p className="mt-3">
            왼쪽에서는 `contents/blog` 트리 구조 그대로 글을 탐색하고,
            오른쪽에서는 각 문서의 핵심 요약을 빠르게 훑어볼 수 있습니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span
              className="rounded-full px-3 py-1"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-secondary)',
              }}
            >
              {topicCount} topics
            </span>
            <span
              className="rounded-full px-3 py-1"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-secondary)',
              }}
            >
              {posts.length} posts
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border px-5 py-5 transition-colors"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <Link href={`/blog/${post.slug}`} className="block group no-underline">
                <div className="mb-2 text-xs uppercase tracking-[0.16em]">
                  {post.sourcePathParts.join(' / ') || 'Root'}
                </div>
                <h3 className="text-lg font-medium transition-opacity group-hover:opacity-70">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm">
                  {post.description || '요약이 없는 문서입니다.'}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                  <time dateTime={post.date.toISOString()}>
                    {post.date.toLocaleDateString('ko-KR')}
                  </time>
                  <span>·</span>
                  <span>{post.readingTime}분 읽기</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 우측: Graph만 */}
      <RightPanel />
    </>
  )
}
