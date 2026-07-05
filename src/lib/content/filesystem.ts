import fs from 'fs/promises'
import type { Dirent } from 'node:fs'
import path from 'path'

export const BLOG_DIR = path.join(process.cwd(), 'contents', 'blog')
export const WORKS_DIR = path.join(process.cwd(), 'contents', 'works')

const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx'])

export type MarkdownSource = {
  filePath: string
  sourcePathParts: string[]
}

export function isMarkdownFile(fileName: string) {
  return MARKDOWN_EXTENSIONS.has(path.extname(fileName).toLowerCase())
}

export async function walkMarkdownFiles(
  dirPath: string,
  pathParts: string[] = [],
): Promise<MarkdownSource[]> {
  let entries: Dirent[]

  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true })
  } catch {
    return []
  }

  const files: MarkdownSource[] = []

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'ko'))) {
    const entryPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      files.push(...await walkMarkdownFiles(entryPath, [...pathParts, entry.name]))
      continue
    }

    if (!entry.isFile() || !isMarkdownFile(entry.name)) continue

    files.push({
      filePath: entryPath,
      sourcePathParts: [...pathParts, entry.name.replace(/\.mdx?$/, '')],
    })
  }

  return files
}
