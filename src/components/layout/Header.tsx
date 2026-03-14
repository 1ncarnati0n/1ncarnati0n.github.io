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
      {/* 헤더 바: 로고(좌) + menu 버튼(우) */}
      <header className="fixed top w-full z-50 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="header-logo">
          1ncarnati0n
        </Link>

        <button
          onClick={() => setMenuOpen(true)}
          className="header-btn"
        >
          Menu
        </button>
      </header>

      {/* 풀스크린 오버레이: menuOpen이 true일 때만 표시 */}
      {menuOpen && (
        <div className="fixed inset-0 z-100 flex flex-col bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
          {/* 오버레이 상단: 로고(좌) + close 버튼(우) — 헤더와 같은 위치 */}
          <div className="px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="header-logo"
              onClick={() => setMenuOpen(false)}
            >
              1ncarnati0n
            </Link>

            <button
              onClick={() => setMenuOpen(false)}
              className="header-btn"
            >
              Close
            </button>
          </div>

          {/* 메뉴 항목들: 화면 중앙에 크게 */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-8">
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