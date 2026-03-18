import fs from 'fs/promises'
import type { Dirent } from 'node:fs'
import path from 'path'
import matter from 'gray-matter'
import type {
  BlogFrontmatter,
  BlogPost,
  BlogTreeFolderNode,
  BlogTreeNode,
  BlogTreePostNode,
} from '@/types/content'

const BLOG_DIR = path.join(process.cwd(), 'src', 'contents', 'blog')
const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx'])

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

async function readBlogPostFromFile(
  filePath: string,
  slugParts: string[],
): Promise<BlogPost | null> {
  const raw = await fs.readFile(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const fm = data as BlogFrontmatter

  if (!fm.title || !fm.date) return null
  if (fm.draft) return null

  return {
    type: 'blog',
    slug: slugParts.join('/'),
    slugParts,
    title: fm.title,
    description: fm.description || '',
    date: new Date(fm.date),
    tags: fm.tags || [],
    draft: fm.draft || false,
    series: fm.series,
    cover: fm.cover,
    updated: fm.updated ? new Date(fm.updated) : undefined,
    readingTime: Math.ceil(content.split(/\s+/).length / 200),
    content,
  }
}

async function walkBlogDirectory(
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
}

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
