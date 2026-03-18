'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DarkModeToggle } from '@/components/ui/DarkModeToggle'

const navItems = [
  { href: '/blog', label: 'Tech Blog' },
  { href: '/works', label: 'Works' },
  { href: '/about', label: 'About' },
]

// 경로 → 페이지 타이틀 매핑
function getPageTitle(pathname: string): string {
  if (pathname === '/') return ''
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
      <header className="fixed top-8 w-full z-100 px-9 flex items-center justify-between">
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
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
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
        menuOpen일 때만 backdrop-blur 적용 → GPU 연산 절약
        visibility로 전환하여 닫힌 상태에서 렌더링 자체를 건너뜀 */}
      <div
        onClick={() => setMenuOpen(false)}
        className={
          `fixed inset-0 z-40 flex flex-col items-center justify-center 
          bg-white/80 dark:bg-neutral-950/80 
          transition-[opacity,visibility] duration-500 ease-in-out 
          ${menuOpen ? 'visible opacity-100 backdrop-blur-md' : 'invisible opacity-0'}`
        }
      >
        <nav
          id="site-menu"
          onClick={(event) => event.stopPropagation()}
          className="mask-linear-to-neutral-50 flex flex-col items-center gap-8"
        >
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`text-2xl font-bold hover:opacity-30 menu-item ${menuOpen ? 'menu-item-open' : ''}`}
              style={{ '--stagger': `${i * 80}ms` } as React.CSSProperties}
            >
              {item.label}
            </Link>
          ))}
          <div
            className={`mt-4 menu-item ${menuOpen ? 'menu-item-open' : ''}`}
            style={{ '--stagger': `${navItems.length * 80}ms` } as React.CSSProperties}
          >
            <DarkModeToggle />
          </div>
          <div>
            <p className='text-center'>
              Architectural Design <br />
              Computational Design <br />
              AI Engineering <br />
              Software Development
            </p>
            <Link href={'https://github.com/1ncarnati0n'} onClick={() => setMenuOpen(false)}>
              <p className='text-center'>gitHub link</p>
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
