import fs from 'fs/promises'
import type { Dirent } from 'node:fs'
import path from 'path'
import matter from 'gray-matter'
import GithubSlugger from 'github-slugger'
import type {
  BlogFrontmatter,
  BlogPost,
  BlogTreeFolderNode,
  BlogTreeNode,
  BlogTreePostNode,
  Heading,
} from '$lib/types/content'
import {
  assertValidBlogSlug,
  normalizeBlogReference,
} from '$lib/content/blog-slug'

const BLOG_DIR = path.join(process.cwd(), 'contents', 'blog')
const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx'])
const CODE_BLOCK_PATTERN = /```[\s\S]*?```/g
const INLINE_CODE_PATTERN = /`([^`]+)`/g
const IMAGE_PATTERN = /!\[([^\]]*)\]\([^)]+\)/g
const LINK_PATTERN = /\[([^\]]+)\]\([^)]+\)/g
const HEADING_PATTERN = /^#\s+(.+)$/m
const ALL_HEADINGS_PATTERN = /^(#{2,4})\s+(.+)$/gm

function isMarkdownFile(entry: string) {
  return MARKDOWN_EXTENSIONS.has(path.extname(entry).toLowerCase())
}

function sortTreeNodes(nodes: BlogTreeNode[]) {
  return nodes.sort((left, right) => {
    if (left.type !== right.type) {
      return left.type === 'folder' ? -1 : 1
    }

    return left.name.localeCompare(right.name, 'ko')
  })
}

function cleanMarkdownText(source: string) {
  return source
    .replace(CODE_BLOCK_PATTERN, ' ')
    .replace(IMAGE_PATTERN, '$1')
    .replace(LINK_PATTERN, '$1')
    .replace(INLINE_CODE_PATTERN, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/\*\*|__|\*|_/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractHeadings(content: string): Heading[] {
  // 코드 블록 내부의 heading을 제외하고 추출
  const cleaned = content.replace(CODE_BLOCK_PATTERN, '')
  const slugger = new GithubSlugger()
  const headings: Heading[] = []
  let match

  while ((match = ALL_HEADINGS_PATTERN.exec(cleaned)) !== null) {
    const text = match[2].trim()
    headings.push({
      level: match[1].length as Heading['level'],
      text,
      slug: slugger.slug(text),
    })
  }

  return headings
}

function extractTitle(content: string, fallbackName: string) {
  const headingMatch = content.match(HEADING_PATTERN)
  return headingMatch?.[1]?.trim() || fallbackName
}

function extractDescription(content: string, fallbackTitle: string) {
  const cleaned = cleanMarkdownText(content)

  if (!cleaned) {
    return fallbackTitle
  }

  const withoutTitle = cleaned.startsWith(fallbackTitle)
    ? cleaned.slice(fallbackTitle.length).trim()
    : cleaned

  return (withoutTitle || cleaned).slice(0, 180).trim()
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    const normalized = value.trim()
    return normalized ? [normalized] : []
  }

  return []
}

function normalizeCssClassArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .flatMap((item) => item.split(/[\s,]+/))
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(/[\s,]+/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

async function readBlogPostFromFile(
  filePath: string,
  sourcePathParts: string[],
): Promise<BlogPost | null> {
  const raw = await fs.readFile(filePath, 'utf-8')
  const stats = await fs.stat(filePath)
  const { data, content } = matter(raw)
  const fm = data as Partial<BlogFrontmatter>

  if (fm.draft) return null

  const fileName = sourcePathParts[sourcePathParts.length - 1] || 'Untitled'
  const slug = typeof fm.slug === 'string'
    ? assertValidBlogSlug(fm.slug, filePath)
    : (() => {
      throw new Error(`Blog post is missing required frontmatter slug: ${filePath}`)
    })()
  const title = fm.title || extractTitle(content, fileName)
  const description = fm.description || extractDescription(content, title)
  const date = fm.date ? new Date(fm.date) : stats.mtime
  const tags = normalizeStringArray(fm.tags)
  const aliases = normalizeStringArray(fm.aliases)
  const cssClasses = normalizeCssClassArray(fm.cssclasses)

  return {
    type: 'blog',
    slug,
    sourcePathParts: sourcePathParts.slice(0, -1),
    sourceFileName: fileName,
    title,
    description,
    date,
    tags,
    draft: fm.draft || false,
    series: fm.series,
    cover: fm.cover,
    updated: fm.updated ? new Date(fm.updated) : undefined,
    aliases,
    cssClasses,
    readingTime: Math.ceil(content.split(/\s+/).length / 200),
    content,
    headings: extractHeadings(content),
  }
}

type BlogIndex = {
  posts: BlogPost[]
  postsBySlug: Map<string, BlogPost>
  references: Map<string, BlogPost | null>
  tree: BlogTreeNode[]
}

function getBlogSourcePath(post: BlogPost) {
  return path.join(BLOG_DIR, ...post.sourcePathParts, post.sourceFileName)
}

function addReferenceKey(
  references: Map<string, BlogPost | null>,
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

  if (!existing) {
    return
  }

  if (existing.slug !== post.slug) {
    references.set(key, null)
  }
}

function indexPostReferences(
  references: Map<string, BlogPost | null>,
  post: BlogPost,
) {
  addReferenceKey(references, post.slug, post)
  addReferenceKey(references, post.title, post)
  addReferenceKey(references, post.sourceFileName, post)

  if (post.sourcePathParts.length > 0) {
    addReferenceKey(
      references,
      [...post.sourcePathParts, post.sourceFileName].join('/'),
      post,
    )
  }

  for (const alias of post.aliases) {
    addReferenceKey(references, alias, post)
  }
}

function addPostToIndex(postsBySlug: Map<string, BlogPost>, post: BlogPost, filePath: string) {
  const existing = postsBySlug.get(post.slug)

  if (existing) {
    throw new Error(
      `Duplicate blog slug "${post.slug}" found in ${filePath} and ${path.join(
        getBlogSourcePath(existing),
      )}`,
    )
  }

  postsBySlug.set(post.slug, post)
}

let _cachedIndex: BlogIndex | null = null

async function walkBlogDirectory(
  dirPath: string,
  pathParts: string[] = [],
): Promise<BlogIndex> {
  if (pathParts.length === 0 && _cachedIndex) return _cachedIndex
  let entries: Dirent[]

  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true })
  } catch {
    return { posts: [], postsBySlug: new Map(), references: new Map(), tree: [] }
  }

  const posts: BlogPost[] = []
  const postsBySlug = new Map<string, BlogPost>()
  const references = new Map<string, BlogPost | null>()
  const tree: BlogTreeNode[] = []

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'ko'))) {
    const entryPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      const nextPathParts = [...pathParts, entry.name]
      const nested = await walkBlogDirectory(entryPath, nextPathParts)

      posts.push(...nested.posts)
      for (const post of nested.postsBySlug.values()) {
        addPostToIndex(postsBySlug, post, getBlogSourcePath(post))
        indexPostReferences(references, post)
      }

      if (nested.tree.length > 0) {
        const folderNode: BlogTreeFolderNode = {
          type: 'folder',
          name: entry.name,
          pathParts: nextPathParts,
          children: sortTreeNodes(nested.tree),
        }
        tree.push(folderNode)
      }

      continue
    }

    if (!entry.isFile() || !isMarkdownFile(entry.name)) continue

    const fileName = entry.name.replace(/\.mdx?$/, '')
    const sourcePathParts = [...pathParts, fileName]
    const post = await readBlogPostFromFile(entryPath, sourcePathParts)

    if (!post) continue

    const postNode: BlogTreePostNode = {
      type: 'post',
      name: fileName,
      slug: post.slug,
      title: post.title,
    }

    addPostToIndex(postsBySlug, post, entryPath)
    indexPostReferences(references, post)
    posts.push(post)
    tree.push(postNode)
  }

  const result = {
    posts,
    postsBySlug,
    references,
    tree: sortTreeNodes(tree),
  }

  if (pathParts.length === 0) _cachedIndex = result
  return result
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { posts } = await walkBlogDirectory(BLOG_DIR)
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export async function getBlogTree(): Promise<BlogTreeNode[]> {
  const { tree } = await walkBlogDirectory(BLOG_DIR)
  return tree
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { postsBySlug } = await walkBlogDirectory(BLOG_DIR)
  return postsBySlug.get(slug) ?? null
}

export async function getBlogReferenceLookup(): Promise<Map<string, BlogPost | null>> {
  const { references } = await walkBlogDirectory(BLOG_DIR)
  return references
}
