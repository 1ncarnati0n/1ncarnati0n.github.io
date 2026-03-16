// ════════════════════════════════════════
// /blog — 블로그 글 목록 페이지
// ════════════════════════════════════════
//
// 📝 핵심: 이 파일은 Server Component (기본값)
// → async/await로 파일 시스템에서 직접 데이터를 읽을 수 있다
// → 브라우저로 보내는 번들에 fs, gray-matter 코드가 포함되지 않는다

import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/content/posts'

export default async function BlogPage() {
  // Server Component이므로 컴포넌트 함수 자체가 async
  // → await로 파일 시스템 접근 (브라우저에서는 불가능한 동작)
  const posts = await getAllBlogPosts()

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-medium mb-10">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-neutral-500">아직 글이 없습니다.</p>
      ) : (
        <div className="space-y-8">
          {/* 📝 React 복습: map으로 리스트 렌더링, key 필수 */}
          {posts.map(post => (
            <article key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block group no-underline"
              >
                <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                  <time dateTime={post.date.toISOString()}>
                    {post.date.toLocaleDateString('ko-KR')}
                  </time>
                  <span>·</span>
                  <span>{post.readingTime}분</span>
                </div>
                {post.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
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
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
