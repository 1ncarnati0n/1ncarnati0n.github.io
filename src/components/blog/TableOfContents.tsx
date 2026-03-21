'use client'

import { useEffect, useRef, useState } from 'react'
import type { Heading } from '@/types/content'

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.slug))
      .filter(Boolean) as HTMLElement[]

    if (headingElements.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px' },
    )

    headingElements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const minLevel = Math.min(...headings.map((h) => h.level))

  return (
    <nav aria-label="목차">
      <p
        className="text-xs font-medium uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-secondary)' }}
      >
        On this page
      </p>
      <ul className="space-y-1.5">
        {headings.map((h) => {
          const isActive = h.slug === activeId
          const indent = (h.level - minLevel) * 0.75

          return (
            <li key={h.slug}>
              <a
                href={`#${h.slug}`}
                className="block text-xs leading-snug transition-colors hover:opacity-70"
                style={{
                  paddingLeft: `${indent}rem`,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
