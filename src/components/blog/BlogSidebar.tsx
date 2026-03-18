'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { BlogTreeNode } from '@/types/content'

type BlogSidebarProps = {
  tree: BlogTreeNode[]
  activeSlug?: string
  title?: string
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

export function BlogSidebar({
  tree,
  activeSlug,
  title = 'Blog',
}: BlogSidebarProps) {
  const initialExpanded = useMemo(
    () => collectExpandedFolders(tree, activeSlug),
    [tree, activeSlug],
  )

  const [expandedFolders, setExpandedFolders] = useState<string[]>(initialExpanded)

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
            <ul className="blog-sidebar-children">
              {node.children.map((child) => renderNode(child))}
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
          className="blog-sidebar-post-link"
          data-active={isActive}
        >
          {node.title}
        </Link>
      </li>
    )
  }

  return (
    <aside className="blog-sidebar">
      <div className="blog-sidebar-sticky">
        <div className="blog-sidebar-title-row">
          <h3 className="blog-sidebar-title">{title}</h3>
          <span className="blog-sidebar-title-icon">⌄</span>
        </div>

        <ul className="blog-sidebar-list">
          {tree.map((node) => renderNode(node))}
        </ul>
      </div>
    </aside>
  )
}
