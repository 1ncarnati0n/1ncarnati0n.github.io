import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { renderMarkdown } from '@/lib/content/mdx'
import { getAllBlogPosts, getBlogPost, getBlogTree } from '@/lib/content/posts'

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()

  return posts.map((post) => ({
    slug: post.slugParts,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return { title: 'Not Found' }
  }

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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params

  const [post, tree] = await Promise.all([
    getBlogPost(slug),
    getBlogTree(),
  ])

  if (!post) notFound()

  const html = await renderMarkdown(post.content)

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-12 px-6 py-16">
      <BlogSidebar tree={tree} activeSlug={post.slug} title="Blog" />

      <article className="min-w-0 max-w-3xl flex-1">
        <header className="mb-10">
          <h1 className="mb-3 text-2xl md:text-3xl font-medium">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-sm">
            <time dateTime={post.date.toISOString()}>
              {post.date.toLocaleDateString('ko-KR')}
            </time>
            <span>·</span>
            <span>{post.readingTime}분 읽기</span>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-secondary)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <hr
          className="mb-10"
          style={{ borderColor: 'var(--color-border)' }}
        />

        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </div>
  )
}
