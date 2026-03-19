import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import '@/globals.css'


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
    <html lang="ko" suppressHydrationWarning >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
        <main id="main-content" className="min-h-screen px-10 py-18">
          {children}
        </main>
      </body>
    </html>
  )
}
