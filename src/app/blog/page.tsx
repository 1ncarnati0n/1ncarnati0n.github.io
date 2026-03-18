import Link from 'next/link'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { getAllBlogPosts, getBlogTree } from '@/lib/content/posts'

export default async function BlogPage() {
  const [tree, posts] = await Promise.all([
    getBlogTree(),
    getAllBlogPosts(),
  ])
  const topicCount = tree.filter((node) => node.type === 'folder').length

  return (
    <>
      <BlogSidebar tree={tree} title="Blog" />

      <section>
        <div className="mb-12">
          <h2 className="text-2xl font-medium text-[var(--color-foreground)]">
            Blog Summaries
          </h2>
          <p className="mt-3 text-[var(--color-secondary)]">
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
                <div className="mb-2 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  {post.sourcePathParts.join(' / ') || 'Root'}
                </div>
                <h3 className="text-lg font-medium text-[var(--color-foreground)] transition-opacity group-hover:opacity-70">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-secondary)]">
                  {post.description || '요약이 없는 문서입니다.'}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)]">
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
    </>
  )
}
