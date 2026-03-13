'use client'  // 클릭 이벤트, useState 사용하므로 Client Component

import { useState } from 'react'
import Link from 'next/link'                              // Next.js 링크
import { DarkModeToggle } from '@/components/ui/DarkModeToggle'

// 메뉴 항목을 배열로 관리 — 나중에 항목 추가/삭제가 쉬워짐
const navItems = [
  { href: '/blog', label: 'Blog' },
  { href: '/works', label: 'Works' },
  { href: '/about', label: 'About' },
]

export function Header() {
  // 모바일 메뉴 열림/닫힘 상태
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
      {/* 
        sticky top-0: 스크롤해도 상단에 고정
        bg-white/80: 흰색 배경 80% 투명도
        backdrop-blur-sm: 뒤 콘텐츠가 살짝 블러 처리됨
      */}
      <nav className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          1ncarnati0n
        </Link>

        {/* 데스크톱 메뉴: md(768px) 이상에서만 보임 */}
        <ul className="hidden md:flex items-center gap-8">
          {/* 
            .map() = 배열을 순회하며 각 항목을 JSX로 변환
            navItems 3개 → <li> 3개 생성
          */}
          {navItems.map(item => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-neutral-500 transition-colors">
                {item.label}
              </Link>
            </li>
          ))}
          <li><DarkModeToggle /></li>
        </ul>

        {/* 모바일 햄버거 버튼: md 미만에서만 보임 */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          {/* SVG 아이콘: mobileOpen에 따라 X 또는 ≡ 표시 */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {/* 모바일 메뉴: mobileOpen이 true일 때만 렌더링 */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-neutral-200 dark:border-neutral-800">
          <ul className="max-w-5xl mx-auto px-4 py-4 space-y-2">
            {navItems.map(item => (
              <li key={item.href}>
                {/* 메뉴 항목 클릭하면 메뉴 닫기 */}
                <Link href={item.href} className="block py-2" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2"><DarkModeToggle /></li>
          </ul>
        </nav>
      )}
    </header>
  )
}