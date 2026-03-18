import type { Metadata } from 'next'

// ── Google Fonts ──
// import { 
//   Archivo_Black, 
//   Noto_Sans_KR, 
//   Noto_Serif_KR, 
//   JetBrains_Mono, 
//   Courier_Prime,
//   Nanum_Gothic_Coding 
// } from 'next/font/google'   ──── Next.js google Fonts Module ────

import { Header } from '@/components/layout/Header'
import '@/styles/globals.css'

// // ── 1. 제목용 — Archivo Black ──
// // 단일 weight(400) 폰트지만 시각적으로 Black 두께이므로 weight 400으로 설정
// const archivoBlack = Archivo_Black({
//   subsets: ['latin'],
//   weight: '400',             // Archivo Black은 400 하나만 존재
//   variable: '--font-archivoBlack',
//   display: 'swap',
// })
// // ── 2-1. 영어 본문폰트 — Courier_Prime (영문) ──
// const courierPrime = Courier_Prime({
//   subsets: ['latin'],
//   weight: '400',
//   variable: '--font-courierPrime',
//   display: 'swap',
// })

// // ── 2-2. 한글 본문용 ──
// const notoSansKR = Noto_Sans_KR({
//   subsets: ['latin'],
//   weight: ['400', '500', '700'],
//   variable: '--font-notoSansKR',
//   display: 'swap',
// })

// // ── 3. 블로그 본문 세리프 ──
// const notoSerifKR = Noto_Serif_KR({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-notoSerifKR',
//   display: 'swap',
// })

// // ── 4. 영문 코드용 ──
// const jetbrainsMono = JetBrains_Mono({
//   subsets: ['latin'],
//   variable: '--font-jetbrainsMono',
//   display: 'swap',
// })

// // ── 5. 한글 코드용 ──
// const nanumGothicCoding = Nanum_Gothic_Coding({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-nanumGothicCoding',
//   display: 'swap',
// })  

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
      // className={`
      //   ${archivoBlack.variable}
      //   ${courierPrime.variable}
      //   ${notoSansKR.variable}
      //   ${notoSerifKR.variable}
      //   ${jetbrainsMono.variable}
      //   ${nanumGothicCoding.variable}
      // `}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Courier+Prime:wght@400&family=JetBrains+Mono:wght@100..800&family=Nanum+Gothic+Coding:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap"
          rel="stylesheet"
        />
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
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded"
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
