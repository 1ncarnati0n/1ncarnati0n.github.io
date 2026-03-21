'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { BlogTreeNode } from '@/types/content'

type BlogSidebarProps = {
  tree: BlogTreeNode[]
  title?: string
  expandAll?: boolean
}

function collectExpandedFolders(nodes: BlogTreeNode[], activeSlug?: string): string[] {
  const expanded = new Set<string>()

  function walk(node: BlogTreeNode): boolean {
    if (node.type === 'post') {
      return node.slug === activeSlug
    }

    const hasActiveChild = node.children.some(walk)

    if (hasActiveChild) {
      expanded.add(node.pathParts.join('/'))
    }

    return hasActiveChild
  }

  nodes.forEach(walk)
  return [...expanded]
}

function collectAllFolders(nodes: BlogTreeNode[]): string[] {
  const folders: string[] = []

  function walk(node: BlogTreeNode) {
    if (node.type === 'folder') {
      folders.push(node.pathParts.join('/'))
      node.children.forEach(walk)
    }
  }

  nodes.forEach(walk)
  return folders
}

export function BlogSidebar({
  tree,
  expandAll = false,
}: BlogSidebarProps) {
  const pathname = usePathname()
  const activeSlug = pathname.startsWith('/blog/')
    ? pathname.replace('/blog/', '').replace(/\/$/, '')
    : undefined
  const initialExpanded = useMemo(() => {
    if (expandAll) {
      return collectAllFolders(tree)
    }

    return collectExpandedFolders(tree, activeSlug)
  }, [tree, activeSlug, expandAll])

  const [expandedFolders, setExpandedFolders] = useState<string[]>(initialExpanded)

  useEffect(() => {
    if (!activeSlug) {
      return
    }

    setExpandedFolders((prev) => {
      const next = new Set(prev)
      for (const folder of initialExpanded) {
        next.add(folder)
      }
      return [...next]
    })
  }, [activeSlug, initialExpanded])

  function toggleFolder(pathKey: string) {
    setExpandedFolders((prev) =>
      prev.includes(pathKey)
        ? prev.filter((item) => item !== pathKey)
        : [...prev, pathKey],
    )
  }

  function renderNode(node: BlogTreeNode, depth = 0): React.ReactNode {
    if (node.type === 'folder') {
      const pathKey = node.pathParts.join('/')
      const isOpen = expandedFolders.includes(pathKey)

      return (
        <li key={pathKey}>
          <button
            type="button"
            onClick={() => toggleFolder(pathKey)}
            className="blog-sidebar-folder-button"
            style={{ paddingLeft: `${depth * 0.9 + 0.75}rem` }}
            aria-expanded={isOpen}
            aria-controls={`blog-folder-${pathKey}`}
          >
            <span
              className="blog-sidebar-folder-icon"
              data-open={isOpen}
            >
              ›
            </span>
            <span className="blog-sidebar-folder-label">
              {node.name}
            </span>
          </button>

          {isOpen && (
            <ul id={`blog-folder-${pathKey}`} className="blog-sidebar-children">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </ul>
          )}
        </li>
      )
    }

    const isActive = node.slug === activeSlug

    return (
      <li key={node.slug}>
        <Link
          href={`/blog/${node.slug}`}
          data-active={isActive}>
          {node.title}
        </Link>
      </li>
    )
  }

  return (
    <aside className="fixed justify-center left-0 h-full w-64 overflow-y-auto">
      <ul>
        {tree.map((node) => renderNode(node))}
      </ul>
    </aside>
  )
}
