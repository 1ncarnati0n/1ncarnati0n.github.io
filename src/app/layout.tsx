import type { Metadata } from 'next'
import { Space_Grotesk, Noto_Sans_KR, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import '@/styles/globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-header',
  display: 'swap',
})
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: '1ncarnati0n',
    template: '%s | 1ncarnati0n',
  },
  description:
    'AI & Software Engineering, Computational Design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ko"
      className={`${spaceGrotesk.variable} ${notoSansKR.variable} ${jetbrainsMono.variable}`}
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
