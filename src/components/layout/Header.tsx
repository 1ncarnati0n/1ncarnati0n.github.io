'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DarkModeToggle } from '@/components/ui/DarkModeToggle'

const navItems = [
  { href: '/blog', label: 'Blog' },
  { href: '/works', label: 'Works' },
  { href: '/about', label: 'About' },
  { href: '/design', label: 'Design' },
]

// 경로 → 페이지 타이틀 매핑
function getPageTitle(pathname: string): string {
  if (pathname === '/') return ''
  // '/blog/some-post' → 'Blog' (첫 번째 세그먼트만 사용)
  const segment = pathname.split('/')[1]
  const match = navItems.find(item => item.href === `/${segment}`)
  return match?.label ?? ''
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <>
      {/* ── 헤더 바: 항상 최상단 (z-50) ── */}
      <header className="fixed top-5 left-0 w-full z-100 px-6 h-16 flex items-center justify-between">
        {/* 좌: 로고 */}
        <Link
          href="/"
          className="logo"
          onClick={() => setMenuOpen(false)}
        >
          1ncarnati0n
        </Link>

        {/* 우: Menu / Close 토글 */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="logo"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      <header className="fixed top-5 left-0 w-full z-90 px-6 h-16 flex items-center justify-center pointer-events-none">
        <span
          className="logo transition-opacity duration-500 ease-in-out"
          style={{ opacity: menuOpen ? 0 : 1 }}
        >
          {pageTitle}
        </span>
      </header>

      {/* ── 풀스크린 오버레이 (z-40) ──
          항상 DOM에 존재 — opacity + pointer-events로 전환
          이렇게 해야 CSS transition이 동작함 */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-opacity duration-500 ease-in-out"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        <nav className="flex flex-col items-center gap-8">
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-2xl hover:opacity-60 transition-all duration-300"
              style={{
                // 각 메뉴 항목이 순차적으로 나타나는 효과
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 400ms ease ${i * 80}ms, transform 400ms ease ${i * 80}ms`,
              }}
            >
              {item.label}
            </Link>
          ))}
          <div
            className="mt-4"
            style={{
              opacity: menuOpen ? 1 : 0,
              transition: `opacity 400ms ease ${navItems.length * 80}ms`,
            }}
          >
            <DarkModeToggle />
          </div>
        </nav>
      </div>
    </>
  )
}
