import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import '@/globals.css'

export const metadata: Metadata = {
  title: {
    default: '1ncarnati0n',
    template: '%s | TechBlog and Portfolio',
  },
  description: 'AI & Software Engineering, Computational Design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=JetBrains+Mono:wght@400;500;700&family=Nanum+Gothic+Coding&family=Noto+Sans+KR:wght@400;500;600;700&family=Noto+Serif+KR:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/joungkyun/font-d2coding/d2coding.css"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              const stored = localStorage.getItem('theme-storage')
              if (stored) {
                const { state } = JSON.parse(stored)
                if (state?.theme === 'dark') {
                  document.documentElement.classList.add('dark')
                }
              } else {
                // 저장된 값이 없으면 시스템 설정 따름
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark')
                }
              }
            } catch (e) {}
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
        <main id="main-content" className="min-h-screen px-10 py-18">
          {children}
        </main>
      </body>
    </html>
  )
}
