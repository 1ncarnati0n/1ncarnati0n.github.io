import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { normalizeBlogReference } from '@/lib/content/blog-slug'
import { renderMarkdown } from '@/lib/content/mdx'
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogReferenceLookup,
  getBlogTree,
} from '@/lib/content/posts'

export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

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
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [post, tree, references] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogTree(),
    getBlogReferenceLookup(),
  ])

  if (!post) notFound()

  const html = await renderMarkdown(post.content, {
    resolveWikiLink: (reference) => {
      const resolved = references.get(normalizeBlogReference(reference))

      if (!resolved) {
        return null
      }

      return {
        href: `/blog/${resolved.slug}`,
        title: resolved.title,
        description: resolved.description,
      }
    },
    resolveEmbed: (reference) => {
      const resolved = references.get(normalizeBlogReference(reference))

      if (!resolved) {
        return null
      }

      return {
        type: 'note',
        href: `/blog/${resolved.slug}`,
        title: resolved.title,
        description: resolved.description,
      }
    },
  })
  const articleClassName = ['prose-custom', ...post.cssClasses].join(' ').trim()

  return (
    <div className="flex w-full flex-col gap-10 px-10 py-16 xl:flex-row xl:gap-12">
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
          className={articleClassName}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </div>
  )
}
