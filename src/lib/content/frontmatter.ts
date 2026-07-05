import fs from 'fs/promises'
import matter from 'gray-matter'
import GithubSlugger from 'github-slugger'
import type {
  BlogFrontmatter,
  BlogPost,
  Heading,
  WorksFrontmatter,
  WorksProject,
} from '$lib/types/content'
import { assertValidBlogSlug, normalizeBlogSlug } from './blog-slug'

const CODE_BLOCK_PATTERN = /```[\s\S]*?```/g
const INLINE_CODE_PATTERN = /`([^`]+)`/g
const IMAGE_PATTERN = /!\[([^\]]*)\]\([^)]+\)/g
const LINK_PATTERN = /\[([^\]]+)\]\([^)]+\)/g
const HTML_TAG_PATTERN = /<[^>]+>/g
const HEADING_PATTERN = /^#\s+(.+)$/m
const ALL_HEADINGS_PATTERN = /^(#{2,4})\s+(.+)$/gm

export function cleanMarkdownText(source: string) {
  return source
    .replace(CODE_BLOCK_PATTERN, ' ')
    .replace(IMAGE_PATTERN, '$1')
    .replace(LINK_PATTERN, '$1')
    .replace(INLINE_CODE_PATTERN, '$1')
    .replace(HTML_TAG_PATTERN, ' ')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/\*\*|__|\*|_/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function cleanHeadingText(source: string) {
  return source
    .replace(INLINE_CODE_PATTERN, '$1')
    .replace(HTML_TAG_PATTERN, ' ')
    .replace(/\*\*|__|\*|_/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractHeadings(content: string): Heading[] {
  const cleaned = content.replace(CODE_BLOCK_PATTERN, '')
  const slugger = new GithubSlugger()
  const headings: Heading[] = []
  let match

  while ((match = ALL_HEADINGS_PATTERN.exec(cleaned)) !== null) {
    const text = cleanHeadingText(match[2])

    if (!text) continue

    headings.push({
      level: match[1].length as Heading['level'],
      text,
      slug: slugger.slug(text),
    })
  }

  return headings
}

export function applyRenderedHeadingIds(headings: Heading[], html: string): Heading[] {
  const ids = [...html.matchAll(/<h([2-4])\s+id="([^"]+)"/g)].map((match) => ({
    level: Number(match[1]),
    slug: match[2],
  }))

  if (ids.length === 0) return headings

  let cursor = 0
  return headings.map((heading) => {
    const id = ids.slice(cursor).find((candidate) => candidate.level === heading.level)
    if (!id) return heading
    cursor = ids.indexOf(id) + 1
    return { ...heading, slug: id.slug }
  })
}

export function extractTitle(content: string, fallbackName: string) {
  const headingMatch = content.match(HEADING_PATTERN)
  return headingMatch?.[1]?.trim() || fallbackName
}

export function extractDescription(content: string, fallbackTitle: string) {
  const cleaned = cleanMarkdownText(content)

  if (!cleaned) return fallbackTitle

  const withoutTitle = cleaned.startsWith(fallbackTitle)
    ? cleaned.slice(fallbackTitle.length).trim()
    : cleaned

  return (withoutTitle || cleaned).slice(0, 180).trim()
}

export function normalizeStringArray(value: unknown): string[] {
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

export function normalizeCssClassArray(value: unknown): string[] {
  return normalizeStringArray(value).flatMap((item) =>
    item
      .split(/[\s,]+/)
      .map((part) => part.trim())
      .filter(Boolean),
  )
}

function normalizeString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export async function normalizeBlogPost(
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

  return {
    type: 'blog',
    slug,
    sourcePathParts: sourcePathParts.slice(0, -1),
    sourceFileName: fileName,
    title,
    description: fm.description || extractDescription(content, title),
    date: fm.date ? new Date(fm.date) : stats.mtime,
    tags: normalizeStringArray(fm.tags),
    draft: fm.draft || false,
    category: normalizeString(fm.category),
    series: normalizeString(fm.series),
    cover: normalizeString(fm.cover),
    updated: fm.updated ? new Date(fm.updated) : undefined,
    aliases: normalizeStringArray(fm.aliases),
    cssClasses: normalizeCssClassArray(fm.cssclasses),
    readingTime: Math.ceil(content.split(/\s+/).length / 200),
    content,
    headings: extractHeadings(content),
  }
}

export async function normalizeWorkProject(
  filePath: string,
  sourcePathParts: string[],
): Promise<WorksProject | null> {
  const raw = await fs.readFile(filePath, 'utf-8')
  const stats = await fs.stat(filePath)
  const { data, content } = matter(raw)
  const fm = data as Partial<WorksFrontmatter> & { draft?: boolean }

  if (fm.draft) return null

  const fileName = sourcePathParts[sourcePathParts.length - 1] || 'Untitled'
  const slug = typeof fm.slug === 'string'
    ? assertValidBlogSlug(fm.slug, filePath)
    : assertValidBlogSlug(normalizeBlogSlug(fileName), filePath)
  const title = fm.title || extractTitle(content, fileName)

  return {
    type: 'works',
    slug,
    sourcePathParts: sourcePathParts.slice(0, -1),
    sourceFileName: fileName,
    title,
    description: fm.description || extractDescription(content, title),
    date: fm.date ? new Date(fm.date) : stats.mtime,
    cover: normalizeString(fm.cover),
    readingTime: Math.ceil(content.split(/\s+/).length / 200),
    content,
    role: normalizeString(fm.role) || '',
    location: normalizeString(fm.location),
    status: fm.status || 'concept',
    tools: normalizeStringArray(fm.tools),
    gallery: normalizeStringArray(fm.gallery),
    category: normalizeString(fm.category) || 'portfolio',
    area: normalizeString(fm.area),
    client: normalizeString(fm.client),
  }
}
