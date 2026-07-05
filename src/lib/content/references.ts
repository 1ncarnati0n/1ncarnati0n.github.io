import type { BlogPost } from '$lib/types/content'
import { normalizeBlogReference } from './blog-slug'

export type BlogReferenceLookup = Map<string, BlogPost | null>

const WIKILINK_PATTERN = /!?\[\[([^[\]]+?)\]\]/g

export function getWikiLinkReferences(content: string): string[] {
  const references: string[] = []
  let match

  WIKILINK_PATTERN.lastIndex = 0

  while ((match = WIKILINK_PATTERN.exec(content)) !== null) {
    const target = match[1].split('|')[0].split('#')[0].trim()
    if (target) references.push(target)
  }

  return references
}

export function addReferenceKey(
  references: BlogReferenceLookup,
  rawKey: string,
  post: BlogPost,
) {
  const key = normalizeBlogReference(rawKey)

  if (!key) return

  if (!references.has(key)) {
    references.set(key, post)
    return
  }

  const existing = references.get(key)

  if (existing && existing.slug !== post.slug) {
    references.set(key, null)
  }
}

export function indexPostReferences(references: BlogReferenceLookup, post: BlogPost) {
  addReferenceKey(references, post.slug, post)
  addReferenceKey(references, post.title, post)
  addReferenceKey(references, post.sourceFileName, post)

  if (post.sourcePathParts.length > 0) {
    addReferenceKey(references, [...post.sourcePathParts, post.sourceFileName].join('/'), post)
  }

  for (const alias of post.aliases) {
    addReferenceKey(references, alias, post)
  }
}

export function buildBlogReferenceLookup(posts: BlogPost[]) {
  const references: BlogReferenceLookup = new Map()

  for (const post of posts) {
    indexPostReferences(references, post)
  }

  return references
}

export function resolveLinkedSlugs(post: BlogPost, references: BlogReferenceLookup): string[] {
  const slugs = new Set<string>()

  for (const reference of getWikiLinkReferences(post.content)) {
    const resolved = references.get(normalizeBlogReference(reference))
    if (resolved && resolved.slug !== post.slug) slugs.add(resolved.slug)
  }

  return [...slugs]
}
