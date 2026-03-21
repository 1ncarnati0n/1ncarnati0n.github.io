import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { BlogArticle } from '@/components/blog/BlogArticle'

import { normalizeBlogReference } from '@/lib/content/blog-slug'
import { renderMarkdown } from '@/lib/content/mdx'
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogReferenceLookup,
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

  const [post, references] = await Promise.all([
    getBlogPostBySlug(slug),
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
  return (
    <div className="flex flex-col items-center">
      <BlogArticle
        title={post.title}
        date={post.date}
        readingTime={post.readingTime}
        tags={post.tags}
        cssClasses={post.cssClasses}
        html={html}
      />
    </div>
  )
}
