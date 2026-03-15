import type { Metadata } from 'next'

// ── Google Fonts ──
import { 
  Archivo_Black, 
  Noto_Sans_KR, 
  Noto_Serif_KR, 
  JetBrains_Mono, 
  Courier_Prime, 
} from 'next/font/google'

// ── 로컬 폰트 ──
import localFont from 'next/font/local'

import { Header } from '@/components/layout/Header'
import '@/styles/globals.css'

// ── 1. 제목용 — Archivo Black ──
// 단일 weight(400) 폰트지만 시각적으로 Black 두께
// Google Fonts가 weight를 400으로 등록해둔 경우 → weight 생략 가능
const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',                   // Archivo Black은 400 하나만 존재
  variable: '--font-header',
  display: 'swap',
})
// ── 2-1. 영어 본문폰트 — Courier_Prime (영문) ──
const courier = Courier_Prime({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-body',
  display: 'swap',
})

// ── 2-2. 한글 본문용 ──
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})

// ── 3. 블로그 본문 세리프 ──
const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
  display: 'swap',
})

// ── 4. 영문 코드용 ──
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
})

// ── 5. 한글 코드용 — 로컬 폰트 ──
const tab0MonoK = localFont({
  src: [
    { path: '../fonts/Tab0MonoK-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Tab0MonoK-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/Tab0MonoK-Italic.woff2', weight: '400', style: 'italic' },
    { path: '../fonts/Tab0MonoK-BoldItalic.woff2', weight: '700', style: 'italic' },
  ],
  variable: '--font-code-kr',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: '1ncarnati0n',
    template: '%s | 1ncarnati0n',
  },
  description: 'AI & Software Engineering, Computational Design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ko"
      className={`
        ${archivoBlack.variable}
        ${courier.variable}
        ${notoSansKR.variable}
        ${notoSerifKR.variable}
        ${jetbrainsMono.variable}
        ${tab0MonoK.variable}
      `}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme-storage')
                if (stored) {
                  const { state } = JSON.parse(stored)
                  if (state?.theme === 'dark') document.documentElement.classList.add('dark')
                  else if (state?.theme === 'light') { /* light: do nothing */ }
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark')
                }
              } catch (e) {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark')
                }
              }
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
        >
          본문으로 건너뛰기
        </a>
        <Header />
        <main id="main-content" className="min-h-screen pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
