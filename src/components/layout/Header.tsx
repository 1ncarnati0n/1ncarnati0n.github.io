'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DarkModeToggle } from '@/components/ui/DarkModeToggle'

const navItems = [
  { href: '/blog', label: 'Blog' },
  { href: '/works', label: 'Works' },
  { href: '/about', label: 'About' },
  { href: '/design', label: 'Design' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* ── 헤더 바: 항상 최상단 (z-50) ── */}
      <header className="fixed top-6 left-0 w-full z-100 px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="logo"
          onClick={() => setMenuOpen(false)}
        >
          1ncarnati0n
        </Link>

        {/* Menu ↔ Close 토글 — 같은 버튼, 텍스트만 변경 */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="logo"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* ── 풀스크린 오버레이: header 아래에 위치 (z-40) ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
          <nav className="flex flex-col items-center gap-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl hover:opacity-60 transition-opacity"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4">
              <DarkModeToggle />
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
