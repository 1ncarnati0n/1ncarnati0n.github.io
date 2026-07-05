import path from 'path'
import type { BlogPost, BlogTreeNode, PostGroup } from '$lib/types/content'
import { BLOG_DIR, walkMarkdownFiles } from './filesystem'
import { normalizeBlogPost } from './frontmatter'
import { buildBlogReferenceLookup, type BlogReferenceLookup } from './references'
import { buildBlogTree } from './tree'

type BlogIndex = {
  posts: BlogPost[]
  postsBySlug: Map<string, BlogPost>
  references: BlogReferenceLookup
  tree: BlogTreeNode[]
}

let cachedIndex: BlogIndex | null = null

function getBlogSourcePath(post: BlogPost) {
  return path.join(BLOG_DIR, ...post.sourcePathParts, post.sourceFileName)
}

function addPostToIndex(postsBySlug: Map<string, BlogPost>, post: BlogPost, filePath: string) {
  const existing = postsBySlug.get(post.slug)

  if (existing) {
    throw new Error(
      `Duplicate blog slug "${post.slug}" found in ${filePath} and ${getBlogSourcePath(existing)}`,
    )
  }

  postsBySlug.set(post.slug, post)
}

async function getBlogIndex(): Promise<BlogIndex> {
  if (cachedIndex) return cachedIndex

  const posts: BlogPost[] = []
  const postsBySlug = new Map<string, BlogPost>()

  for (const source of await walkMarkdownFiles(BLOG_DIR)) {
    const post = await normalizeBlogPost(source.filePath, source.sourcePathParts)
    if (!post) continue

    addPostToIndex(postsBySlug, post, source.filePath)
    posts.push(post)
  }

  cachedIndex = {
    posts,
    postsBySlug,
    references: buildBlogReferenceLookup(posts),
    tree: buildBlogTree(posts),
  }

  return cachedIndex
}

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function groupPostsByTag(posts: BlogPost[]): PostGroup[] {
  const groups = new Map<string, BlogPost[]>()

  for (const post of posts) {
    for (const tag of post.tags) {
      groups.set(tag, [...(groups.get(tag) ?? []), post])
    }
  }

  return [...groups.entries()]
    .map(([name, groupedPosts]) => ({ name, count: groupedPosts.length, posts: sortPosts(groupedPosts) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ko'))
}

export function groupPostsBySeries(posts: BlogPost[]): PostGroup[] {
  const groups = new Map<string, BlogPost[]>()

  for (const post of posts) {
    if (!post.series) continue
    groups.set(post.series, [...(groups.get(post.series) ?? []), post])
  }

  return [...groups.entries()]
    .map(([name, groupedPosts]) => ({ name, count: groupedPosts.length, posts: sortPosts(groupedPosts) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'))
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { posts } = await getBlogIndex()
  return sortPosts(posts)
}

export async function getBlogTree(): Promise<BlogTreeNode[]> {
  const { tree } = await getBlogIndex()
  return tree
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { postsBySlug } = await getBlogIndex()
  return postsBySlug.get(slug) ?? null
}

export async function getBlogReferenceLookup(): Promise<BlogReferenceLookup> {
  const { references } = await getBlogIndex()
  return references
}

export async function getAllTags(): Promise<PostGroup[]> {
  return groupPostsByTag(await getAllBlogPosts())
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  return (await getAllBlogPosts()).filter((post) => post.tags.includes(tag))
}

export async function getAllSeries(): Promise<PostGroup[]> {
  return groupPostsBySeries(await getAllBlogPosts())
}

export async function getPostsBySeries(series: string): Promise<BlogPost[]> {
  return (await getAllBlogPosts()).filter((post) => post.series === series)
}
