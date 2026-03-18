import fs from 'fs/promises'
import type { Dirent } from 'node:fs'
import path from 'path'
import { cache } from 'react'
import matter from 'gray-matter'
import type {
  BlogFrontmatter,
  BlogPost,
  BlogTreeFolderNode,
  BlogTreeNode,
  BlogTreePostNode,
} from '@/types/content'

const BLOG_DIR = path.join(process.cwd(), 'contents', 'blog')
const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx'])
const CODE_BLOCK_PATTERN = /```[\s\S]*?```/g
const INLINE_CODE_PATTERN = /`([^`]+)`/g
const IMAGE_PATTERN = /!\[([^\]]*)\]\([^)]+\)/g
const LINK_PATTERN = /\[([^\]]+)\]\([^)]+\)/g
const HEADING_PATTERN = /^#\s+(.+)$/m

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

async function readBlogPostFromFile(
  filePath: string,
  slugParts: string[],
): Promise<BlogPost | null> {
  const raw = await fs.readFile(filePath, 'utf-8')
  const stats = await fs.stat(filePath)
  const { data, content } = matter(raw)
  const fm = data as BlogFrontmatter

  if (fm.draft) return null

  const fileName = slugParts[slugParts.length - 1] || 'Untitled'
  const title = fm.title || extractTitle(content, fileName)
  const description = fm.description || extractDescription(content, title)
  const date = fm.date ? new Date(fm.date) : stats.mtime

  return {
    type: 'blog',
    slug: slugParts.join('/'),
    slugParts,
    title,
    description,
    date,
    tags: fm.tags || [],
    draft: fm.draft || false,
    series: fm.series,
    cover: fm.cover,
    updated: fm.updated ? new Date(fm.updated) : undefined,
    readingTime: Math.ceil(content.split(/\s+/).length / 200),
    content,
  }
}

const walkBlogDirectory = cache(async function walkBlogDirectory(
  dirPath: string,
  pathParts: string[] = [],
): Promise<{ posts: BlogPost[]; tree: BlogTreeNode[] }> {
  let entries: Dirent[]

  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true })
  } catch {
    return { posts: [], tree: [] }
  }

  const posts: BlogPost[] = []
  const tree: BlogTreeNode[] = []

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'ko'))) {
    const entryPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      const nextPathParts = [...pathParts, entry.name]
      const nested = await walkBlogDirectory(entryPath, nextPathParts)

      posts.push(...nested.posts)

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
    const slugParts = [...pathParts, fileName]
    const post = await readBlogPostFromFile(entryPath, slugParts)

    if (!post) continue

    const postNode: BlogTreePostNode = {
      type: 'post',
      name: fileName,
      slug: post.slug,
      slugParts: post.slugParts,
      title: post.title,
    }

    posts.push(post)
    tree.push(postNode)
  }

  return {
    posts,
    tree: sortTreeNodes(tree),
  }
})

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { posts } = await walkBlogDirectory(BLOG_DIR)
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export async function getBlogTree(): Promise<BlogTreeNode[]> {
  const { tree } = await walkBlogDirectory(BLOG_DIR)
  return tree
}

export async function getBlogPost(slug: string | string[]): Promise<BlogPost | null> {
  const normalizedParts = Array.isArray(slug)
    ? slug
    : slug.split('/').filter(Boolean)

  if (normalizedParts.length === 0) return null

  const fileBasePath = path.join(BLOG_DIR, ...normalizedParts)

  for (const ext of MARKDOWN_EXTENSIONS) {
    try {
      const post = await readBlogPostFromFile(`${fileBasePath}${ext}`, normalizedParts)
      if (post) return post
    } catch {
      continue
    }
  }

  return null
}
