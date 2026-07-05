import type { BlogPost, SearchDocument } from '$lib/types/content'
import { cleanMarkdownText } from './frontmatter'
import { getAllBlogPosts } from './posts'

export function createSearchDocument(post: BlogPost): SearchDocument {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags,
    category: post.category,
    series: post.series,
    date: post.date.toISOString(),
    headings: post.headings.map((heading) => heading.text),
    body: cleanMarkdownText(post.content),
  }
}

export async function getSearchDocuments() {
  return (await getAllBlogPosts()).map(createSearchDocument)
}
