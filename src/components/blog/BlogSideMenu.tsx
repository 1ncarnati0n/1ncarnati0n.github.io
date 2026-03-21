'use client'

import { useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { BlogTreeNode, BlogTreeFolderNode } from '@/types/content'

// ─── Types ───────────────────────────────────

type BlogSideMenuProps = {
  tree: BlogTreeNode[]
  expandAll?: boolean
}

// ─── Helpers ─────────────────────────────────

function folderKey(node: BlogTreeFolderNode) {
  return node.pathParts.join('/')
}

function collectAutoExpanded(
  nodes: BlogTreeNode[],
  activeSlug?: string,
): Set<string> {
  const expanded = new Set<string>()

  function walk(node: BlogTreeNode): boolean {
    if (node.type === 'post') return node.slug === activeSlug

    const hasActiveChild = node.children.some(walk)
    if (hasActiveChild) expanded.add(folderKey(node))
    return hasActiveChild
  }

  nodes.forEach(walk)
  return expanded
}

function collectAllFolders(nodes: BlogTreeNode[]): Set<string> {
  const folders = new Set<string>()

  function walk(node: BlogTreeNode) {
    if (node.type === 'folder') {
      folders.add(folderKey(node))
      node.children.forEach(walk)
    }
  }

  nodes.forEach(walk)
  return folders
}

// ─── Sub-components ──────────────────────────

function FolderNode({
  node,
  depth,
  isOpen,
  onToggle,
  children,
}: {
  node: BlogTreeFolderNode
  depth: number
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  const key = folderKey(node)

  return (
    <li className='font-sans'>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 w-full text-left py-1.5 text-sm
                   transition-colors hover:caret-amber-200 cursor-pointer"
        style={{ paddingLeft: `${depth * 0.9 + 0.75}rem` }}
        aria-expanded={isOpen}
        aria-controls={`folder-${key}`}
      >
        <span
          className="inline-block text-[0.6rem] transition-transform duration-200
                     text-secondary"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
        <span
          className="font-medium"
          style={{ color: 'var(--color-primary)' }}
        >
          {node.name}
        </span>
      </button>

      {isOpen && (
        <ul id={`folder-${key}`} className="relative">
          <span
            className="absolute top-0 bottom-2 w-px bg-border"
            style={{ left: `${(depth + 1) * 0.8 + 0.3}rem` }}
            aria-hidden
          />
          {children}
        </ul>
      )}
    </li>
  )
}

function PostNode({
  node,
  depth,
  isActive,
}: {
  node: Extract<BlogTreeNode, { type: 'post' }>
  depth: number
  isActive: boolean
}) {
  return (
    <li>
      <Link
        href={`/blog/${node.slug}`}
        className="block py-1 text-sm truncate transition-colors hover:opacity-70"
        style={{
          paddingLeft: `${depth * 0.9 + 0.75}rem`,
          color: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
          fontWeight: isActive ? 600 : 400,
        }}
      >
        {node.title}
      </Link>
    </li>
  )
}

// ─── Main component ──────────────────────────

export function BlogSideMenu({ tree, expandAll = false }: BlogSideMenuProps) {
  const pathname = usePathname()
  const activeSlug = pathname.startsWith('/blog/')
    ? pathname.replace('/blog/', '').replace(/\/$/, '')
    : undefined

  // 자동 확장 대상 (active slug 경로 상의 폴더들)
  const autoExpanded = useMemo(() => {
    if (expandAll) return collectAllFolders(tree)
    return collectAutoExpanded(tree, activeSlug)
  }, [tree, activeSlug, expandAll])

  // 사용자 수동 토글 (자동 확장과 분리하여 cascading render 방지)
  const [userToggled, setUserToggled] = useState<Set<string>>(new Set())
  const prevSlugRef = useRef(activeSlug)

  // activeSlug가 바뀌면 수동 토글 초기화 (렌더 중 비교 — useEffect 불필요)
  if (prevSlugRef.current !== activeSlug) {
    prevSlugRef.current = activeSlug
    setUserToggled(new Set())
  }

  // 최종 확장 상태 = 자동 확장 ⊕ 사용자 토글
  const expandedFolders = useMemo(() => {
    const result = new Set(autoExpanded)
    for (const key of userToggled) {
      if (result.has(key)) result.delete(key)
      else result.add(key)
    }
    return result
  }, [autoExpanded, userToggled])

  function toggleFolder(pathKey: string) {
    setUserToggled((prev) => {
      const next = new Set(prev)
      if (next.has(pathKey)) next.delete(pathKey)
      else next.add(pathKey)
      return next
    })
  }

  function renderNode(node: BlogTreeNode, depth = 0) {
    if (node.type === 'folder') {
      const key = folderKey(node)
      return (
        <FolderNode
          key={key}
          node={node}
          depth={depth}
          isOpen={expandedFolders.has(key)}
          onToggle={() => toggleFolder(key)}
        >
          {node.children.map((child) => renderNode(child, depth + 1))}
        </FolderNode>
      )
    }

    return (
      <PostNode
        key={node.slug}
        node={node}
        depth={depth}
        isActive={node.slug === activeSlug}
      />
    )
  }

  return (
    <nav className="fixed pt-1">
      <ul>{tree.map((node) => renderNode(node))}</ul>
    </nav>
  )
}
