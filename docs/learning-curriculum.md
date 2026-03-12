# 📚 Next.js 콘텐츠 사이트 학습 커리큘럼 v3

건축 포트폴리오 + 기술 포트폴리오 + Obsidian 기반 기술블로그를 Next.js로 구축하는 실전 학습 가이드.

> **아키텍처 원칙**: "웹앱처럼 만들지 말고, 콘텐츠 사이트답게 만든다."
> — Server Components 기본, MDX 중심, 정적 우선, 클라이언트 상태 최소화

---

## 📋 커리큘럼 개요

| Phase | 핵심 기술 | 학습 내용 | 소요 시간 | 상태 |
|-------|----------|----------|---------|------|
| Setup | 프로젝트 초기화 | Next.js 15 + TS + Tailwind v4 + Vercel 구조 | 1시간 | ⬜ |
| Phase 1 | App Router 기초 | 라우팅, SC/CC, 레이아웃, 에러 처리 | 2-3시간 | ⬜ |
| Phase 2 | TypeScript 타입 설계 | 3축 콘텐츠 타입, frontmatter 스키마 | 1-2시간 | ⬜ |
| Phase 3 | Tailwind + 디자인 시스템 | 스타일링, 다크모드, 반응형, 접근성, shadcn/ui | 2-3시간 | ⬜ |
| Phase 4 | 콘텐츠 파이프라인 기초 | gray-matter, unified, MDX 렌더링 | 2-3시간 | ⬜ |
| Phase 5 | Obsidian 호환 + 커스텀 플러그인 | WikiLink, Callout, Highlight, Mermaid | 2-3시간 | ⬜ |
| Phase 6 | 페이지 조립 | 목록/상세/갤러리/TOC/시리즈 | 3-4시간 | ⬜ |
| Phase 7 | SEO + 메타데이터 | Metadata API, OG 이미지, JSON-LD, sitemap, RSS | 2-3시간 | ⬜ |
| Phase 8 | 검색 + Graph View | FlexSearch 한글 검색, d3-force 노트 그래프 | 2-3시간 | ⬜ |
| Phase 9 | 테스팅 | Vitest, 플러그인 테스트, 콘텐츠 로더 테스트 | 1-2시간 | ⬜ |
| 배포 | Vercel + 운영 | 배포, Preview, Analytics, ISR 전략 | 1시간 | ⬜ |

**총 소요 시간**: 약 20-28시간 (실습 포함)

---

## 🏗️ 아키텍처 개요

### 전체 흐름

```
Obsidian Vault (작성 도구)
    ↓ obsidian-git / 수동 커밋
content/
  blog/          ← 기술 블로그
  architecture/  ← 건축 포트폴리오
  tech/          ← 기술 포트폴리오
    ↓
MD/MDX 파싱 파이프라인 (gray-matter + unified + remark/rehype)
    ↓
Next.js App Router (Server Components 기본)
    ↓
Vercel 배포 (정적 우선 + ISR 확장 가능)
```

### 핵심 설계 결정

```
┌─────────────────────────────────────────────────────────┐
│                    설계 원칙                              │
├─────────────────────────────────────────────────────────┤
│ 1. CMS 없음 — Obsidian이 작성 도구, Git이 저장소        │
│ 2. Server Components 기본 — 콘텐츠 렌더링은 서버에서     │
│ 3. Client Components 최소 — 필터/테마/갤러리/검색만      │
│ 4. 정적 우선 — generateStaticParams로 빌드 타임 생성     │
│ 5. 3축 분리 — blog / architecture / tech 각각 독립       │
│ 6. MDX 중심 — React 컴포넌트 임베딩 가능                 │
│ 7. Vercel 네이티브 — next/image, ISR, OG 이미지 활용     │
└─────────────────────────────────────────────────────────┘
```

### 기술스택 한눈에

```
필수 ─────────────────────────
  Next.js 15 (App Router)
  TypeScript
  MDX (next-mdx-remote)
  Tailwind CSS v4
  next/image + next/font
  Vercel

권장 ─────────────────────────
  shadcn/ui (UI 컴포넌트)
  Zustand (UI 상태 최소)
  FlexSearch (한글 검색)
  d3-force (그래프 뷰)
  Vitest (테스팅)

선택 ─────────────────────────
  다국어 라우팅
  ISR
  Vercel Analytics
  Vercel Speed Insights
```

### Server / Client 분리 원칙

이 사이트에서 가장 중요한 구조적 판단.

**Server Component (기본)**:
- 페이지 본문 렌더링
- 글 목록 로딩
- 포트폴리오 메타데이터 읽기
- SEO 메타 생성
- JSON-LD 삽입

**Client Component (최소한으로)**:
- 다크모드 토글
- 포트폴리오 필터 UI
- 검색 다이얼로그
- 이미지 갤러리 확대
- 모바일 메뉴

참고: [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

---

## 🔧 Setup Phase: 프로젝트 초기화 (1시간)

### 목표
Next.js 15 + React 19 + TypeScript + Tailwind v4 + Vercel 배포 가능한 프로젝트 구조 완성.

### ⚠️ Vercel 배포 = `output: 'export'` 불필요

GitHub Pages와 달리 Vercel에서는 정적 내보내기 제약이 없습니다.

| 기능 | GitHub Pages | Vercel |
|------|-------------|--------|
| `next/image` 최적화 | ❌ 불가 | ✅ 네이티브 지원 |
| ISR (점진적 정적 재생성) | ❌ 불가 | ✅ 지원 |
| Route Handlers (API) | ❌ 불가 | ✅ Vercel Functions |
| Middleware | ❌ 불가 | ✅ Edge Runtime |
| 동적 OG 이미지 생성 | ❌ 불가 | ✅ `@vercel/og` |
| Preview Deployments | ❌ 불가 | ✅ PR별 자동 배포 |

참고: [Vercel + Next.js](https://vercel.com/docs/frameworks/nextjs)

### 단계별 작업

#### 1️⃣ 프로젝트 생성

```bash
npx create-next-app@latest 1ncarnati0n.github.io \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm

cd 1ncarnati0n.github.io
```

**학습 포인트**: `create-next-app`이 생성하는 기본 구조 확인. `--app`은 App Router 사용을 의미.
참고: [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app)

#### 2️⃣ 추가 의존성 설치

```bash
# 콘텐츠 파이프라인
pnpm add gray-matter unified remark-parse remark-gfm remark-math \
  remark-rehype rehype-raw rehype-katex rehype-pretty-code rehype-slug \
  rehype-autolink-headings rehype-stringify rehype-mermaid shiki \
  next-mdx-remote reading-time github-slugger \
  mdast-util-find-and-replace hast-util-to-string unist-util-visit

# 검색 + 시각화
pnpm add flexsearch d3 d3-force

# UI (선택)
pnpm add zustand

# 개발
pnpm add -D vitest @testing-library/react @vitejs/plugin-react \
  @types/d3
```

#### 3️⃣ 디렉터리 구조 생성

프로젝트의 뼈대. 첨부 문서의 추천 구조를 그대로 따름.

```bash
mkdir -p src/{app/{blog/{[slug]},architecture/{[slug]},tech/{[slug]},about,contact},\
components/{ui,layout,blog,portfolio,mdx,search,graph},\
content/{blog,architecture,tech},\
lib/{content,seo,utils},\
store,styles,plugins,types}
```

최종 구조:

```
src/
  app/                          ← 라우팅과 페이지
    layout.tsx                  ← 루트 레이아웃
    page.tsx                    ← 홈
    blog/
      page.tsx                  ← 글 목록
      [slug]/
        page.tsx                ← 글 상세
    architecture/
      page.tsx                  ← 건축 포트폴리오 목록
      [slug]/
        page.tsx                ← 건축 프로젝트 상세
    tech/
      page.tsx                  ← 기술 포트폴리오 목록
      [slug]/
        page.tsx                ← 기술 프로젝트 상세
    about/
      page.tsx                  ← 소개
    rss.xml/
      route.ts                  ← RSS 피드 (Route Handler)
    sitemap.ts                  ← 사이트맵

  components/                   ← 재사용 컴포넌트
    ui/                         ← 범용 UI (Button, Card, ...)
    layout/                     ← Header, Footer, Nav
    blog/                       ← 블로그 전용 (PostCard, TOC, ...)
    portfolio/                  ← 포트폴리오 전용 (ProjectCard, Gallery, ...)
    mdx/                        ← MDX 커스텀 컴포넌트
    search/                     ← 검색 다이얼로그
    graph/                      ← 노트 그래프

  content/                      ← 원문 콘텐츠 (Obsidian → Git)
    blog/
    architecture/
    tech/

  lib/                          ← 유틸리티
    content/                    ← 파일 읽기, slug, frontmatter 파싱
      posts.ts
      portfolio.ts
      mdx.ts
      toc.ts
    seo/                        ← 메타데이터, JSON-LD
      metadata.ts
      jsonld.ts
    utils/
      slug.ts
      date.ts

  plugins/                      ← 커스텀 remark/rehype 플러그인
  store/                        ← Zustand (UI 상태만)
  styles/                       ← globals.css
  types/                        ← TS 타입 정의
```

#### 4️⃣ tsconfig.json 확인 및 보강

`create-next-app`이 생성한 것에 path alias를 추가:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["ES2017", "dom", "dom.iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"],
      "@store/*": ["./src/store/*"],
      "@types/*": ["./src/types/*"],
      "@plugins/*": ["./src/plugins/*"],
      "@content/*": ["./src/content/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.mdx"],
  "exclude": ["node_modules", ".next", "out"]
}
```

#### 5️⃣ next.config.ts

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ⚡ Vercel 배포: output: 'export' 불필요!
  // next/image, ISR, Route Handlers, Middleware 모두 사용 가능

  // MDX 파일 확장자 인식
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],

  // 이미지 최적화: Vercel에서 네이티브 지원
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // 외부 이미지가 필요한 경우 여기에 추가
    ],
  },
}

export default nextConfig
```

**학습 포인트**: `output: 'export'`를 설정하지 않으면 Vercel에서 모든 Next.js 기능을 사용할 수 있습니다. 이것이 GitHub Pages 대비 Vercel의 가장 큰 장점입니다.
참고: [Next.js Configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js)

#### 6️⃣ vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@plugins': path.resolve(__dirname, './src/plugins'),
    },
  },
})
```

#### 7️⃣ package.json scripts 확인

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint --fix .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

**학습 포인트**: `--turbopack`은 Next.js 15의 개발 서버 가속 옵션. 빌드에는 영향 없음.
참고: [Turbopack](https://nextjs.org/docs/app/api-reference/cli/next#next-dev)

#### 8️⃣ .gitignore

```
node_modules/
.next/
out/
.env.local
.env.*.local
*.log
.DS_Store
.vercel
```

### ✅ Setup 완료 확인

```bash
pnpm dev
# http://localhost:3000 에서 Next.js 기본 페이지 로드

pnpm run type-check
# TypeScript 에러 없음

pnpm run test:run
# Vitest 설정 확인 (테스트 없으므로 0 passed)
```

---

## 📱 Phase 1: App Router 기초 (2-3시간)

### 목표
- 파일 기반 라우팅 시스템
- Server Component vs Client Component 분리
- **⚡ Next.js 15의 async params** — 가장 중요한 API 변경
- Layout / Error / Loading / Not Found
- 중첩 레이아웃

참고: [App Router](https://nextjs.org/docs/app/building-your-application/routing)

### 📚 핵심 개념

#### 1. Server Component (기본)

App Router에서 모든 컴포넌트는 기본적으로 Server Component.
참고: [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

```typescript
// 서버에서 렌더링 → fs 접근 가능, DB 접근 가능, 번들에 포함 안 됨
export default async function BlogPage() {
  // Vercel 배포: 빌드 타임 + 런타임 모두 가능
  const posts = await getAllPosts()  // fs.readdir → OK
  return <PostList posts={posts} />
}
```

#### 2. Client Component (명시적)

```typescript
'use client'  // ← 이 선언이 있어야만 클라이언트에서 실행

import { useState } from 'react'

// hooks, 이벤트 핸들러, 브라우저 API 사용 가능
export function PortfolioFilter() {
  const [category, setCategory] = useState('all')
  return <button onClick={() => setCategory('web')}>Web</button>
}
```

#### 3. ⚡ Next.js 15: async params (필수)

Next.js 15의 가장 중요한 breaking change.
참고: [Async Request APIs](https://nextjs.org/docs/app/building-your-application/upgrading/version-15#async-request-apis-breaking-change)

```typescript
// ❌ Next.js 14 (이전 문법) — 타입 에러!
export default function PostPage({ params }: { params: { slug: string } }) {
  return <div>{params.slug}</div>
}

// ✅ Next.js 15 (현재 문법) — params를 await
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <div>{slug}</div>
}
```

### 🎯 실습: 3축 라우트 구조 만들기

#### src/app/layout.tsx (Root Layout)

```typescript
import type { Metadata } from 'next'
import { Space_Grotesk, Noto_Sans_KR, JetBrains_Mono } from 'next/font/google'
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
    default: '1ncarnati0n — Architecture & Code',
    template: '%s | 1ncarnati0n',
  },
  description: 'Architecture, Computational Design, and Software Engineering Portfolio & Blog',
  metadataBase: new URL('https://1ncarnati0n.vercel.app'),
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
        {/* 다크모드 FOUC 방지 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme-storage')
                if (stored) {
                  const { state } = JSON.parse(stored)
                  if (state?.theme === 'dark') document.documentElement.classList.add('dark')
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark')
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased">
        {/* Skip to content: 접근성 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
        >
          본문으로 건너뛰기
        </a>
        {/* TODO: Phase 3에서 Header 컴포넌트 */}
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        {/* TODO: Phase 3에서 Footer 컴포넌트 */}
      </body>
    </html>
  )
}
```

**학습 포인트**:
- `next/font`: 폰트 자동 최적화 + 셀프 호스팅. 외부 요청 제거.
  참고: [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- `Metadata.template`: 하위 페이지에서 `title: '글 제목'`만 쓰면 자동으로 `글 제목 | 1ncarnati0n` 합성.
  참고: [Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- `suppressHydrationWarning`: 다크모드 스크립트와 hydration 불일치 경고 억제.

#### src/app/error.tsx (에러 바운더리)

```typescript
'use client'  // Error Boundary는 반드시 Client Component

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center" role="alert">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">문제가 발생했습니다</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          {error.message || '알 수 없는 오류가 발생했습니다.'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black rounded-lg hover:opacity-90 transition"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}
```

참고: [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

#### src/app/loading.tsx (로딩 상태)

```typescript
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" aria-busy="true">
      <div className="animate-pulse text-neutral-400">Loading...</div>
    </div>
  )
}
```

#### src/app/not-found.tsx (404)

```typescript
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          찾는 페이지가 없습니다.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black rounded-lg hover:opacity-90 transition inline-block"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
```

#### src/app/page.tsx (홈)

```typescript
// Server Component — fs 접근 가능
// import { getRecentPosts } from '@lib/content/posts'
// import { getFeaturedProjects } from '@lib/content/portfolio'

export default async function Home() {
  // TODO: Phase 4에서 구현
  // const recentPosts = await getRecentPosts(5)
  // const featuredArch = await getFeaturedProjects('architecture')
  // const featuredTech = await getFeaturedProjects('tech')

  return (
    <div className="container-wide py-16">
      {/* 히어로 섹션 */}
      <section className="mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Architecture & Code
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
          11년차 건축 설계 경험과 소프트웨어 엔지니어링을 결합하여
          건설 기술의 디지털 전환을 만들어갑니다.
        </p>
      </section>

      {/* 3축 진입점 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {/* TODO: Phase 6에서 SectionCard 컴포넌트 */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Blog</h2>
          <p className="text-neutral-600 dark:text-neutral-400">기술 블로그</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Architecture</h2>
          <p className="text-neutral-600 dark:text-neutral-400">건축 포트폴리오</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Tech</h2>
          <p className="text-neutral-600 dark:text-neutral-400">기술 포트폴리오</p>
        </div>
      </section>
    </div>
  )
}
```

#### 3축 라우트 (Next.js 15 async params)

```typescript
// ── src/app/blog/page.tsx ──
export default async function BlogPage() {
  // TODO: Phase 4
  return (
    <div className="container-wide py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
    </div>
  )
}

// ── src/app/blog/[slug]/page.tsx ──
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  // TODO: Phase 4에서 구현
  return []
}

// ⚡ Next.js 15: async params
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // TODO: Phase 4에서 콘텐츠 로딩
  return <article className="container-wide py-12"><h1>{slug}</h1></article>
}
```

```typescript
// ── src/app/architecture/page.tsx ──
export default async function ArchitecturePage() {
  return (
    <div className="container-wide py-12">
      <h1 className="text-3xl font-bold mb-8">Architecture Portfolio</h1>
    </div>
  )
}

// ── src/app/architecture/[slug]/page.tsx ──
export async function generateStaticParams() {
  return []
}

export default async function ArchProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <article className="container-wide py-12"><h1>{slug}</h1></article>
}
```

```typescript
// ── src/app/tech/page.tsx ──
export default async function TechPage() {
  return (
    <div className="container-wide py-12">
      <h1 className="text-3xl font-bold mb-8">Tech Portfolio</h1>
    </div>
  )
}

// ── src/app/tech/[slug]/page.tsx ──
export async function generateStaticParams() {
  return []
}

export default async function TechProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <article className="container-wide py-12"><h1>{slug}</h1></article>
}
```

```typescript
// ── src/app/about/page.tsx ──
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: '프로필, 기술 스택, 이력 소개',
}

export default function AboutPage() {
  return (
    <div className="container-wide py-12">
      <h1 className="text-3xl font-bold mb-8">About</h1>
      {/* TODO: 프로필, 스택, 이력, 연락처 */}
    </div>
  )
}
```

### ✅ Phase 1 검증

```bash
pnpm dev

# 확인:
# / → 홈
# /blog → 블로그 목록
# /architecture → 건축 포트폴리오
# /tech → 기술 포트폴리오
# /about → 소개
# /nonexistent → 404

pnpm run type-check  # 타입 에러 없음
```

---

## 🔠 Phase 2: TypeScript 타입 설계 (1-2시간)

### 목표
- 3축 콘텐츠의 frontmatter 스키마 설계
- 도메인별로 다른 메타데이터, 같은 렌더러
- 검색/그래프 데이터 타입

### 📚 핵심: frontmatter는 반드시 강하게 고정

첨부 문서의 권장 사항을 그대로 반영:
> "frontmatter는 반드시 강하게 고정하는 게 좋습니다."

### 🎯 실습

#### src/types/content.ts

```typescript
// ════════════════════════════════════════
// Frontmatter 스키마 (콘텐츠 원본의 메타데이터)
// ════════════════════════════════════════

/** 블로그 포스트 frontmatter */
export interface BlogFrontmatter {
  title: string
  description: string
  date: string                // ISO 날짜 문자열
  updated?: string
  tags: string[]
  draft?: boolean
  cover?: string              // 커버 이미지 경로
  series?: string             // 시리즈 이름
}

/** 건축 포트폴리오 frontmatter */
export interface ArchitectureFrontmatter {
  title: string
  description: string
  date: string
  role: string                // "설계 담당" / "PM" / ...
  location?: string           // "서울 강남구"
  status: 'completed' | 'in-progress' | 'concept'
  tools: string[]             // ["Revit", "Rhino", "Grasshopper", ...]
  cover: string
  gallery?: string[]          // 이미지 경로 배열
  category: string            // "residential" / "commercial" / "interior" / ...
  area?: string               // "연면적 2,500㎡"
  client?: string
}

/** 기술 포트폴리오 frontmatter */
export interface TechFrontmatter {
  title: string
  description: string
  date: string
  role: string                // "풀스택 개발" / "프론트엔드 리드" / ...
  stack: string[]             // ["Next.js", "FastAPI", "PostgreSQL", ...]
  repo?: string               // GitHub URL
  demo?: string               // 데모 URL
  cover: string
  highlights?: string[]       // 핵심 성과 요약
  category: string            // "web" / "tool" / "infra" / ...
}

// ════════════════════════════════════════
// 파싱된 콘텐츠 객체
// ════════════════════════════════════════

/** 공통 콘텐츠 필드 */
interface BaseContent {
  slug: string
  title: string
  description: string
  date: Date
  cover?: string
  readingTime: number
  content: string             // raw MDX source
}

/** 블로그 포스트 */
export interface BlogPost extends BaseContent {
  type: 'blog'
  tags: string[]
  draft: boolean
  series?: string
  updated?: Date
}

/** 건축 포트폴리오 프로젝트 */
export interface ArchProject extends BaseContent {
  type: 'architecture'
  role: string
  location?: string
  status: 'completed' | 'in-progress' | 'concept'
  tools: string[]
  gallery: string[]
  category: string
  area?: string
  client?: string
}

/** 기술 포트폴리오 프로젝트 */
export interface TechProject extends BaseContent {
  type: 'tech'
  role: string
  stack: string[]
  repo?: string
  demo?: string
  highlights: string[]
  category: string
}

/** 전체 콘텐츠 유니온 타입 */
export type AnyContent = BlogPost | ArchProject | TechProject

// ════════════════════════════════════════
// UI / 유틸리티 타입
// ════════════════════════════════════════

/** 마크다운 제목 (TOC용) */
export interface Heading {
  level: 1 | 2 | 3 | 4 | 5 | 6
  text: string
  slug: string
}

/** 검색 인덱스 항목 */
export interface SearchItem {
  id: string
  type: 'blog' | 'architecture' | 'tech'
  title: string
  slug: string
  tags: string[]             // tags / tools / stack 통합
  content: string            // 플레인텍스트
  description: string
}

/** Graph View 타입 */
export interface GraphNode {
  id: string
  label: string
  type: 'blog' | 'architecture' | 'tech' | 'tag'
  category?: string
}

export interface GraphLink {
  source: string
  target: string
  type: 'wikilink' | 'tag' | 'series'
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}
```

**학습 포인트**:
- `interface` 확장(`extends`)으로 공통 필드 재사용
- 리터럴 유니온 타입(`'completed' | 'in-progress' | 'concept'`)으로 값 제한
- `type` 필드로 discriminated union 패턴 → `switch(content.type)`으로 안전한 분기

### ✅ Phase 2 검증

```bash
pnpm run type-check  # 타입 에러 없음
```

---

## 🎨 Phase 3: Tailwind + 디자인 시스템 (2-3시간)

### 목표
- Tailwind v4 설정
- **다크모드: `class` 기반 통일** (다크모드 전략은 하나만)
- 반응형 레이아웃
- 접근성 (aria, 키보드, 시맨틱 HTML)
- shadcn/ui 선택적 도입

참고: [Tailwind CSS v4](https://tailwindcss.com/docs), [Next.js CSS](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css)

### 🎯 실습

#### src/styles/globals.css

```css
@import "tailwindcss";

/* ── 다크모드: class 기반 통일 ── */
@custom-variant dark (&:where(.dark, .dark *));

/* ── 디자인 토큰 ── */
@theme {
  --color-primary: #1a1a1a;
  --color-secondary: #666666;
  --color-accent: #2c2c2c;
  --color-tertiary: #b85c3e;

  --font-header: "Space Grotesk", system-ui, sans-serif;
  --font-body: "Noto Sans KR", system-ui, sans-serif;
  --font-code: "JetBrains Mono", "Fira Code", monospace;
}

/* ── 글로벌 베이스 ── */
@layer base {
  html { @apply scroll-smooth; }

  body {
    @apply bg-white dark:bg-neutral-950;
    @apply text-neutral-900 dark:text-neutral-100;
    font-family: var(--font-body);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-header);
    @apply font-bold;
  }

  code { font-family: var(--font-code); }

  :focus-visible {
    @apply outline-2 outline-offset-2 outline-blue-500;
  }
}

/* ── 유틸리티 ── */
@layer utilities {
  .container-wide { @apply max-w-5xl mx-auto px-4; }
  .container-narrow { @apply max-w-3xl mx-auto px-4; }
  .link-hover { @apply transition-colors duration-200 hover:text-tertiary; }
}

/* ── Callout 스타일 (Phase 5) ── */
@layer components {
  .callout { @apply p-4 rounded-md my-4 border-l-4; }
  .callout-note { @apply border-blue-500 bg-blue-50 dark:bg-blue-950/30; }
  .callout-warning { @apply border-amber-500 bg-amber-50 dark:bg-amber-950/30; }
  .callout-danger { @apply border-red-500 bg-red-50 dark:bg-red-950/30; }
  .callout-tip { @apply border-green-500 bg-green-50 dark:bg-green-950/30; }
  .callout-info { @apply border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30; }
  .callout-example { @apply border-violet-500 bg-violet-50 dark:bg-violet-950/30; }
}
```

#### src/store/useThemeStore.ts (UI 상태 — 최소)

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    { name: 'theme-storage' }
  )
)
```

> 참고: 이 사이트에서 Zustand의 역할은 극히 제한적. 테마/필터/모바일메뉴/검색 열림 정도만.

#### src/components/layout/Header.tsx

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DarkModeToggle } from '@components/ui/DarkModeToggle'

const navItems = [
  { href: '/blog', label: 'Blog' },
  { href: '/architecture', label: 'Architecture' },
  { href: '/tech', label: 'Tech' },
  { href: '/about', label: 'About' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
      <nav className="container-wide h-16 flex items-center justify-between" aria-label="메인 내비게이션">
        <Link href="/" className="text-xl font-bold font-header">
          1ncarnati0n
        </Link>

        {/* 데스크톱 */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <li key={item.href}>
              <Link href={item.href} className="link-hover">{item.label}</Link>
            </li>
          ))}
          <li><DarkModeToggle /></li>
        </ul>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {/* 모바일 드롭다운 */}
      {mobileOpen && (
        <nav id="mobile-menu" className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950" aria-label="모바일 내비게이션">
          <ul className="container-wide py-4 space-y-2">
            {navItems.map(item => (
              <li key={item.href}>
                <Link href={item.href} className="block py-2 link-hover" onClick={() => setMobileOpen(false)}>
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
```

#### src/components/ui/DarkModeToggle.tsx

```typescript
'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@store/useThemeStore'

export function DarkModeToggle() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      aria-label={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

### ✅ Phase 3 검증

```bash
pnpm dev

# 1. 다크모드 토글 → 새로고침 후 유지
# 2. 모바일 메뉴 열림/닫힘
# 3. Tab 키 내비게이션 → skip link → 메뉴 → 본문
# 4. 반응형: md 이상에서 데스크톱 메뉴, md 이하에서 햄버거
```

---

## 📝 Phase 4: 콘텐츠 파이프라인 기초 (2-3시간)

### 목표
- gray-matter로 frontmatter 파싱
- unified 파이프라인으로 MDX → HTML
- 3축 콘텐츠 로더 (blog, architecture, tech)
- `generateStaticParams`로 정적 생성

참고: [MDX in Next.js](https://nextjs.org/docs/app/building-your-application/configuring/mdx)

### 📚 핵심: CMS 없이 로컬 파일 기반

> "CMS를 따로 두지 않는 것. Obsidian이 작성 도구, Next.js가 렌더러."

```
content/
  blog/
    rust-wasm-bim.md
    nextjs-app-router.md
  architecture/
    gangnam-tower.mdx
    residential-complex.mdx
  tech/
    contech-saas.mdx
    tauri-ta-app.mdx
```

### 🎯 실습

#### src/lib/content/posts.ts (블로그 로더)

```typescript
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost, BlogFrontmatter } from '@/types/content'

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog')

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  let files: string[]
  try {
    files = await fs.readdir(BLOG_DIR)
  } catch {
    return []
  }

  const posts: BlogPost[] = []

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue

    const filePath = path.join(BLOG_DIR, file)
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)
    const fm = data as BlogFrontmatter

    if (fm.draft) continue

    const slug = file.replace(/\.mdx?$/, '')

    posts.push({
      type: 'blog',
      slug,
      title: fm.title || slug,
      description: fm.description || '',
      date: new Date(fm.date || Date.now()),
      tags: fm.tags || [],
      draft: fm.draft || false,
      series: fm.series,
      updated: fm.updated ? new Date(fm.updated) : undefined,
      cover: fm.cover,
      readingTime: Math.ceil(content.split(/\s+/).length / 200),
      content,
    })
  }

  return posts.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  for (const ext of ['.md', '.mdx']) {
    try {
      const filePath = path.join(BLOG_DIR, `${slug}${ext}`)
      const raw = await fs.readFile(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const fm = data as BlogFrontmatter

      return {
        type: 'blog',
        slug,
        title: fm.title || slug,
        description: fm.description || '',
        date: new Date(fm.date || Date.now()),
        tags: fm.tags || [],
        draft: fm.draft || false,
        series: fm.series,
        updated: fm.updated ? new Date(fm.updated) : undefined,
        cover: fm.cover,
        readingTime: Math.ceil(content.split(/\s+/).length / 200),
        content,
      }
    } catch {
      continue
    }
  }
  return null
}

export async function getRecentPosts(count: number): Promise<BlogPost[]> {
  const all = await getAllBlogPosts()
  return all.slice(0, count)
}
```

#### src/lib/content/portfolio.ts (포트폴리오 로더)

```typescript
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type {
  ArchProject, TechProject,
  ArchitectureFrontmatter, TechFrontmatter,
} from '@/types/content'

const ARCH_DIR = path.join(process.cwd(), 'src', 'content', 'architecture')
const TECH_DIR = path.join(process.cwd(), 'src', 'content', 'tech')

// ── 건축 포트폴리오 ──

export async function getAllArchProjects(): Promise<ArchProject[]> {
  let files: string[]
  try { files = await fs.readdir(ARCH_DIR) } catch { return [] }

  const projects: ArchProject[] = []

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue

    const raw = await fs.readFile(path.join(ARCH_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    const fm = data as ArchitectureFrontmatter
    const slug = file.replace(/\.mdx?$/, '')

    projects.push({
      type: 'architecture',
      slug,
      title: fm.title || slug,
      description: fm.description || '',
      date: new Date(fm.date || Date.now()),
      role: fm.role || '',
      location: fm.location,
      status: fm.status || 'completed',
      tools: fm.tools || [],
      cover: fm.cover || '',
      gallery: fm.gallery || [],
      category: fm.category || '',
      area: fm.area,
      client: fm.client,
      readingTime: Math.ceil(content.split(/\s+/).length / 200),
      content,
    })
  }

  return projects.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export async function getArchProject(slug: string): Promise<ArchProject | null> {
  for (const ext of ['.md', '.mdx']) {
    try {
      const raw = await fs.readFile(path.join(ARCH_DIR, `${slug}${ext}`), 'utf-8')
      const { data, content } = matter(raw)
      const fm = data as ArchitectureFrontmatter

      return {
        type: 'architecture', slug,
        title: fm.title || slug,
        description: fm.description || '',
        date: new Date(fm.date || Date.now()),
        role: fm.role || '', location: fm.location,
        status: fm.status || 'completed',
        tools: fm.tools || [], cover: fm.cover || '',
        gallery: fm.gallery || [], category: fm.category || '',
        area: fm.area, client: fm.client,
        readingTime: Math.ceil(content.split(/\s+/).length / 200),
        content,
      }
    } catch { continue }
  }
  return null
}

// ── 기술 포트폴리오 ──

export async function getAllTechProjects(): Promise<TechProject[]> {
  let files: string[]
  try { files = await fs.readdir(TECH_DIR) } catch { return [] }

  const projects: TechProject[] = []

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue

    const raw = await fs.readFile(path.join(TECH_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    const fm = data as TechFrontmatter
    const slug = file.replace(/\.mdx?$/, '')

    projects.push({
      type: 'tech', slug,
      title: fm.title || slug,
      description: fm.description || '',
      date: new Date(fm.date || Date.now()),
      role: fm.role || '', stack: fm.stack || [],
      repo: fm.repo, demo: fm.demo,
      cover: fm.cover || '',
      highlights: fm.highlights || [], category: fm.category || '',
      readingTime: Math.ceil(content.split(/\s+/).length / 200),
      content,
    })
  }

  return projects.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export async function getTechProject(slug: string): Promise<TechProject | null> {
  for (const ext of ['.md', '.mdx']) {
    try {
      const raw = await fs.readFile(path.join(TECH_DIR, `${slug}${ext}`), 'utf-8')
      const { data, content } = matter(raw)
      const fm = data as TechFrontmatter

      return {
        type: 'tech', slug,
        title: fm.title || slug,
        description: fm.description || '',
        date: new Date(fm.date || Date.now()),
        role: fm.role || '', stack: fm.stack || [],
        repo: fm.repo, demo: fm.demo,
        cover: fm.cover || '',
        highlights: fm.highlights || [], category: fm.category || '',
        readingTime: Math.ceil(content.split(/\s+/).length / 200),
        content,
      }
    } catch { continue }
  }
  return null
}

// ── 공통 ──

export async function getFeaturedProjects(type: 'architecture' | 'tech', count = 3) {
  if (type === 'architecture') {
    const all = await getAllArchProjects()
    return all.slice(0, count)
  }
  const all = await getAllTechProjects()
  return all.slice(0, count)
}
```

#### src/lib/content/mdx.ts (MDX 렌더링 파이프라인)

```typescript
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypePrettyCode } from 'rehype-pretty-code'
import type { ReactElement } from 'react'

// Phase 5에서 추가할 커스텀 플러그인 import 위치
// import { remarkObsidianWikilinks } from '@plugins/remark-obsidian-wikilinks'
// import { remarkObsidianCallouts } from '@plugins/remark-obsidian-callouts'
// import { remarkObsidianHighlights } from '@plugins/remark-obsidian-highlights'

// MDX 커스텀 컴포넌트 — MDX 안에서 <Gallery />, <TechStack /> 등 사용 가능
const mdxComponents = {
  // 포트폴리오 상세에서 쓸 컴포넌트 (Phase 6에서 구현)
  // Gallery: dynamic(() => import('@components/portfolio/Gallery')),
  // TechStack: dynamic(() => import('@components/portfolio/TechStack')),

  // 기본 HTML 태그 커스터마이징
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} loading="lazy" className="rounded-lg" alt={props.alt || ''} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = props.href?.startsWith('http')
    return (
      <a
        {...props}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="text-tertiary hover:underline"
      />
    )
  },
}

export async function renderMDX(source: string): Promise<ReactElement> {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          remarkMath,
          // Phase 5에서 추가:
          // remarkObsidianWikilinks,
          // remarkObsidianCallouts,
          // remarkObsidianHighlights,
        ],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          rehypeKatex,
          [rehypePrettyCode, { theme: { light: 'vitesse-light', dark: 'one-dark-pro' } }],
        ],
      },
    },
  })
  return content
}
```

참고: [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)

#### src/lib/content/toc.ts (Table of Contents)

```typescript
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { visit } from 'unist-util-visit'
import type { Heading } from '@/types/content'

export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  const tree = unified().use(remarkParse).parse(markdown)

  visit(tree, 'heading', (node: any) => {
    const text = node.children
      .filter((c: any) => c.type === 'text')
      .map((c: any) => c.value)
      .join('')

    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-+|-+$/g, '')

    headings.push({ level: node.depth as Heading['level'], text, slug })
  })

  return headings
}
```

#### src/lib/utils/markdown.ts (검색용 플레인텍스트 추출)

```typescript
/** 마크다운 → 플레인텍스트 (검색 인덱스용) */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/!\[\[.*?\]\]/g, '')
    .replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_, target, alias) => alias || target)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_~>`]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
}
```

### ✅ Phase 4 검증

```bash
# 테스트 콘텐츠 생성
cat > src/content/blog/hello-world.md << 'EOF'
---
title: "Hello World"
description: "첫 번째 블로그 포스트"
date: "2026-03-11"
tags: ["nextjs", "typescript"]
---

# Hello World

첫 번째 블로그 포스트입니다.

## TypeScript

코드 예시:

```typescript
const greeting: string = 'Hello'
```

수식: $E = mc^2$
EOF

pnpm run type-check
pnpm dev
# /blog → 목록에 "Hello World" 표시 (Phase 6에서 UI 완성)
```

---

## 🔗 Phase 5: Obsidian 호환 + 커스텀 플러그인 (2-3시간)

### 목표
- Obsidian 문법 처리: WikiLink, Callout, Highlight
- **WikiLink 라우팅 리졸버** — 3축 구조에 맞게 `/blog/`, `/architecture/`, `/tech/`로 분기
- Mermaid 다이어그램 지원

### 📚 Obsidian 호환 전략

첨부 문서의 권장사항:

> **장기적으로 안정적인 운영**: Markdown 링크로 통일
> **Obsidian 사용감 유지가 더 중요**: remark 플러그인 추가

Obsidian은 설정에서 Use Wikilinks를 끄면 표준 Markdown 링크를 생성합니다.
참고: [Obsidian Link Format](https://help.obsidian.md/Files+and+folders/Manage+notes#link-format)

**권장 운영 원칙**:
1. 새로 쓰는 글: Markdown 링크로 통일 (Settings → Use Wikilinks 끄기)
2. 기존 Obsidian 자산이 많다: 아래 플러그인으로 변환
3. Callout(`> [!NOTE]`)은 어떤 방식이든 변환 필요 → 플러그인 필수

### 🎯 실습

#### src/lib/content/slugmap.ts (3축 슬러그 리졸버)

```typescript
import { getAllBlogPosts } from './posts'
import { getAllArchProjects, getAllTechProjects } from './portfolio'

/**
 * 전체 콘텐츠의 slug → URL 매핑을 생성.
 * WikiLink 해석과 Graph View에서 사용.
 */
export async function buildSlugMap(): Promise<Map<string, string>> {
  const slugMap = new Map<string, string>()

  const posts = await getAllBlogPosts()
  for (const post of posts) {
    slugMap.set(post.slug, `/blog/${post.slug}`)
    // 파일명만으로도 해석 가능하게
    const filename = post.slug.split('/').pop()!
    if (!slugMap.has(filename)) slugMap.set(filename, `/blog/${post.slug}`)
  }

  const archProjects = await getAllArchProjects()
  for (const p of archProjects) {
    slugMap.set(p.slug, `/architecture/${p.slug}`)
  }

  const techProjects = await getAllTechProjects()
  for (const p of techProjects) {
    slugMap.set(p.slug, `/tech/${p.slug}`)
  }

  return slugMap
}
```

#### src/plugins/remark-obsidian-wikilinks.ts

```typescript
import { visit } from 'unist-util-visit'
import type { Root, PhrasingContent } from 'mdast'

interface WikilinkOptions {
  slugMap?: Map<string, string>
  defaultPrefix?: string
}

export function remarkObsidianWikilinks(options: WikilinkOptions = {}) {
  const { slugMap, defaultPrefix = '/blog' } = options

  return (tree: Root) => {
    visit(tree, ['paragraph', 'heading'], (node: any) => {
      node.children = (node.children || []).flatMap((child: any): PhrasingContent[] => {
        if (child.type !== 'text') return [child]

        const parts: PhrasingContent[] = []
        let lastIndex = 0
        const regex = /(!?)\[\[([^\]]+)\]\]/g
        let match

        while ((match = regex.exec(child.value)) !== null) {
          if (match.index > lastIndex) {
            parts.push({ type: 'text', value: child.value.slice(lastIndex, match.index) })
          }

          const isImage = match[1] === '!'
          const [target, alias] = match[2].split('|').map((s: string) => s.trim())

          if (isImage) {
            parts.push({
              type: 'html',
              value: `<img src="/images/${target}" alt="${alias || target}" loading="lazy" />`,
            } as any)
          } else {
            // 3축 구조에 맞게 라우팅 해석
            const resolvedPath = slugMap?.get(target) || `${defaultPrefix}/${target}`
            parts.push({
              type: 'link',
              url: resolvedPath,
              title: null,
              children: [{ type: 'text', value: alias || target }],
            })
          }

          lastIndex = match.index + match[0].length
        }

        if (lastIndex < child.value.length) {
          parts.push({ type: 'text', value: child.value.slice(lastIndex) })
        }

        return parts.length > 0 ? parts : [child]
      })
    })
  }
}
```

#### src/plugins/remark-obsidian-callouts.ts

```typescript
import { visit } from 'unist-util-visit'
import type { Root, Blockquote, Text } from 'mdast'

const CALLOUT_TYPES = ['note', 'warning', 'danger', 'info', 'tip', 'example'] as const

const CALLOUT_ICONS: Record<string, string> = {
  note: 'ℹ️', warning: '⚠️', danger: '🚨',
  info: 'ℹ️', tip: '💡', example: '📝',
}

export function remarkObsidianCallouts() {
  return (tree: Root) => {
    visit(tree, 'blockquote', (node: Blockquote, index, parent) => {
      if (!parent || typeof index !== 'number') return

      const firstChild = node.children[0]
      if (firstChild?.type !== 'paragraph') return

      const firstText = firstChild.children.find(
        (c): c is Text => c.type === 'text'
      )
      if (!firstText) return

      const match = firstText.value.match(/^\[!(\w+)\]\s*(.*)/)
      if (!match) return

      const [, rawType, title] = match
      const type = rawType.toLowerCase()
      if (!CALLOUT_TYPES.includes(type as any)) return

      const icon = CALLOUT_ICONS[type] || ''
      const titleText = title || type.charAt(0).toUpperCase() + type.slice(1)

      firstText.value = firstText.value.replace(/^\[!\w+\]\s*/, '')

      const start = { type: 'html' as const, value: `<div class="callout callout-${type}" role="note"><div class="callout-title font-bold mb-1">${icon} ${titleText}</div><div class="callout-content">` }
      const end = { type: 'html' as const, value: `</div></div>` }

      parent.children.splice(index, 1, start, ...node.children, end)
    })
  }
}
```

#### src/plugins/remark-obsidian-highlights.ts

```typescript
import { findAndReplace } from 'mdast-util-find-and-replace'
import type { Root } from 'mdast'

export function remarkObsidianHighlights() {
  return (tree: Root) => {
    findAndReplace(tree, [
      [
        /==(.*?)==/g,
        (_: string, text: string) => ({
          type: 'html' as const,
          value: `<mark>${text}</mark>`,
        }),
      ],
    ])
  }
}
```

#### mdx.ts에 플러그인 연결

```typescript
// src/lib/content/mdx.ts의 remarkPlugins에 추가:
import { remarkObsidianWikilinks } from '@plugins/remark-obsidian-wikilinks'
import { remarkObsidianCallouts } from '@plugins/remark-obsidian-callouts'
import { remarkObsidianHighlights } from '@plugins/remark-obsidian-highlights'
import { buildSlugMap } from '@lib/content/slugmap'

export async function renderMDX(source: string): Promise<ReactElement> {
  const slugMap = await buildSlugMap()

  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          remarkMath,
          [remarkObsidianWikilinks, { slugMap }],
          remarkObsidianCallouts,
          remarkObsidianHighlights,
        ],
        // ... rehypePlugins 동일
      },
    },
  })
  return content
}
```

### ✅ Phase 5 검증

```bash
# 테스트 콘텐츠에 Obsidian 문법 추가:
# - [[other-post]] WikiLink
# - > [!NOTE] Callout
# - ==highlight==
# - $E = mc^2$

pnpm dev
# 각 문법이 올바르게 렌더링되는지 확인
pnpm run type-check
```

---

## 🧱 Phase 6: 페이지 조립 (3-4시간)

### 목표
- 블로그 목록 + 상세 페이지 완성
- 건축/기술 포트폴리오 목록 + 상세 페이지 완성
- 이미지 갤러리 (건축 포트폴리오)
- TOC, 시리즈 네비게이션
- `generateStaticParams` + `generateMetadata`

### 🎯 실습

#### src/app/blog/page.tsx (블로그 목록)

```typescript
import Link from 'next/link'
import { getAllBlogPosts } from '@lib/content/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog' }

export default async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <div className="container-narrow py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="space-y-6">
        {posts.map(post => (
          <li key={post.slug}>
            <article>
              <Link href={`/blog/${post.slug}`} className="group block">
                <h2 className="text-xl font-bold group-hover:text-tertiary transition-colors">
                  {post.title}
                </h2>
                <p className="mt-1 text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {post.description}
                </p>
                <div className="mt-2 flex items-center gap-3 text-sm text-neutral-500">
                  <time dateTime={post.date.toISOString()}>
                    {post.date.toLocaleDateString('ko-KR')}
                  </time>
                  <span>{post.readingTime}분</span>
                  <div className="flex gap-1">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

#### src/app/blog/[slug]/page.tsx (블로그 상세)

```typescript
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllBlogPosts, getBlogPost } from '@lib/content/posts'
import { renderMDX } from '@lib/content/mdx'
import { extractHeadings } from '@lib/content/toc'

// 빌드 타임에 모든 블로그 경로 생성
export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map(post => ({ slug: post.slug }))
}

// ⚡ Next.js 15 async params
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Not Found' }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date.toISOString(),
      tags: post.tags,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const content = await renderMDX(post.content)
  const headings = extractHeadings(post.content)

  return (
    <div className="container-wide py-12 grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-12">
      {/* 본문 */}
      <article className="prose dark:prose-invert max-w-none">
        <header className="mb-8 not-prose">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <time dateTime={post.date.toISOString()}>
              {post.date.toLocaleDateString('ko-KR')}
            </time>
            <span>{post.readingTime}분 읽기</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* MDX 렌더링 결과 */}
        {content}
      </article>

      {/* TOC 사이드바 (데스크톱) */}
      {headings.length > 0 && (
        <aside className="hidden lg:block" aria-label="목차">
          <nav className="sticky top-20">
            <h3 className="text-sm font-bold mb-3 text-neutral-500">목차</h3>
            <ul className="space-y-1 text-sm">
              {headings
                .filter(h => h.level <= 3)
                .map(h => (
                  <li key={h.slug} style={{ paddingLeft: `${(h.level - 2) * 0.75}rem` }}>
                    <a href={`#${h.slug}`} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                      {h.text}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
        </aside>
      )}
    </div>
  )
}
```

#### src/app/architecture/[slug]/page.tsx (건축 포트폴리오 상세)

```typescript
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getAllArchProjects, getArchProject } from '@lib/content/portfolio'
import { renderMDX } from '@lib/content/mdx'

export async function generateStaticParams() {
  const projects = await getAllArchProjects()
  return projects.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getArchProject(slug)
  if (!project) return { title: 'Not Found' }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.cover ? [{ url: project.cover }] : [],
    },
  }
}

export default async function ArchProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getArchProject(slug)
  if (!project) notFound()

  const content = await renderMDX(project.content)

  return (
    <article className="container-wide py-12">
      {/* 커버 이미지 — next/image로 최적화 */}
      {project.cover && (
        <div className="relative w-full aspect-[16/9] mb-8 rounded-lg overflow-hidden">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{project.title}</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
          {project.description}
        </p>

        {/* 프로젝트 메타 */}
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-neutral-500">역할</dt>
            <dd className="font-medium">{project.role}</dd>
          </div>
          {project.location && (
            <div>
              <dt className="text-neutral-500">위치</dt>
              <dd className="font-medium">{project.location}</dd>
            </div>
          )}
          {project.area && (
            <div>
              <dt className="text-neutral-500">규모</dt>
              <dd className="font-medium">{project.area}</dd>
            </div>
          )}
          <div>
            <dt className="text-neutral-500">상태</dt>
            <dd className="font-medium">{project.status}</dd>
          </div>
        </dl>

        {/* 사용 도구 */}
        <div className="flex flex-wrap gap-2 mt-4" aria-label="사용 도구">
          {project.tools.map(tool => (
            <span key={tool} className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">
              {tool}
            </span>
          ))}
        </div>
      </header>

      {/* 갤러리 */}
      {project.gallery.length > 0 && (
        <section className="mb-12" aria-label="프로젝트 갤러리">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.gallery.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={img}
                  alt={`${project.title} 이미지 ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MDX 본문 */}
      <div className="prose dark:prose-invert max-w-none">
        {content}
      </div>
    </article>
  )
}
```

**학습 포인트**:
- `next/image`: Vercel에서 자동 이미지 최적화. `fill` + `sizes`로 반응형.
  참고: [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- `<dl>` + `<dt>` + `<dd>`: 프로젝트 메타데이터의 시맨틱 마크업
- `priority`: LCP(Largest Contentful Paint) 이미지에 설정

기술 포트폴리오 상세 (`/tech/[slug]/page.tsx`)도 같은 패턴으로 구현.
`stack`, `repo`, `demo`, `highlights` 등 tech-specific 필드를 표시.

### ✅ Phase 6 검증

```bash
# 각 축에 샘플 .md/.mdx 파일을 넣고:
pnpm dev

# /blog → 목록 → 상세
# /architecture → 목록 → 상세 (이미지, 갤러리, 메타)
# /tech → 목록 → 상세 (스택, GitHub 링크, 하이라이트)
```

---

## 🔎 Phase 7: SEO + 메타데이터 (2-3시간)

### 목표
- Metadata API 고도화
- OG 이미지 (정적 + 동적)
- JSON-LD 구조화 데이터
- sitemap, RSS Route Handler
- canonical URL

참고: [Next.js SEO](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

> "특히 포트폴리오 사이트는 검색엔진보다도 링크 공유 미리보기가 중요합니다."

### 🎯 실습

#### src/lib/seo/jsonld.ts

```typescript
import type { BlogPost, ArchProject, TechProject } from '@/types/content'

const SITE_URL = 'https://1ncarnati0n.vercel.app'
const AUTHOR = { '@type': 'Person', name: '1ncarnati0n', url: SITE_URL }

export function blogJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date.toISOString(),
    dateModified: post.updated?.toISOString() || post.date.toISOString(),
    author: AUTHOR,
    keywords: post.tags.join(', '),
    url: `${SITE_URL}/blog/${post.slug}`,
  }
}

export function projectJsonLd(project: ArchProject | TechProject) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    dateCreated: project.date.toISOString(),
    author: AUTHOR,
    url: `${SITE_URL}/${project.type}/${project.slug}`,
  }
}
```

#### src/app/sitemap.ts

```typescript
import type { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@lib/content/posts'
import { getAllArchProjects, getAllTechProjects } from '@lib/content/portfolio'

const BASE_URL = 'https://1ncarnati0n.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllBlogPosts()
  const archProjects = await getAllArchProjects()
  const techProjects = await getAllTechProjects()

  return [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/architecture`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tech`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: 'yearly', priority: 0.5 },
    ...posts.map(p => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: p.updated || p.date,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...archProjects.map(p => ({
      url: `${BASE_URL}/architecture/${p.slug}`,
      lastModified: p.date,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
    ...techProjects.map(p => ({
      url: `${BASE_URL}/tech/${p.slug}`,
      lastModified: p.date,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ]
}
```

참고: [Next.js sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

#### src/app/rss.xml/route.ts (RSS Route Handler)

```typescript
import { getAllBlogPosts } from '@lib/content/posts'

const BASE_URL = 'https://1ncarnati0n.vercel.app'

export async function GET() {
  const posts = await getAllBlogPosts()

  const items = posts
    .slice(0, 20)
    .map(post => `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${BASE_URL}/blog/${post.slug}</link>
        <description><![CDATA[${post.description}]]></description>
        <pubDate>${post.date.toUTCString()}</pubDate>
        <guid>${BASE_URL}/blog/${post.slug}</guid>
      </item>
    `)
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>1ncarnati0n Blog</title>
    <link>${BASE_URL}</link>
    <description>Architecture, Computational Design, and Software Engineering</description>
    <language>ko</language>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
```

참고: [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

#### src/app/robots.ts

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/_next/'] },
    sitemap: 'https://1ncarnati0n.vercel.app/sitemap.xml',
  }
}
```

### ✅ Phase 7 검증

```bash
pnpm dev

# /sitemap.xml → XML 표시
# /rss.xml → RSS 피드
# /robots.txt → robots 지시문
# 블로그 상세 페이지 → HTML <head>에 og:title, og:description 확인
```

---

## 🔍 Phase 8: 검색 + Graph View (2-3시간)

### 목표
- FlexSearch로 한글 전문 검색
- d3-force로 Obsidian 스타일 노트 그래프
- 검색/그래프 데이터를 빌드 타임에 생성

이 Phase는 v2 커리큘럼과 동일한 패턴이지만, 3축 콘텐츠를 통합하는 점이 다릅니다.

### 🎯 실습

#### src/app/api/search-index/route.ts (검색 인덱스 API)

Vercel에서는 Route Handler로 빌드 타임에 검색 인덱스를 생성 가능.

```typescript
import { NextResponse } from 'next/server'
import { getAllBlogPosts } from '@lib/content/posts'
import { getAllArchProjects, getAllTechProjects } from '@lib/content/portfolio'
import { markdownToPlainText } from '@lib/utils/markdown'
import type { SearchItem } from '@/types/content'

export async function GET() {
  const posts = await getAllBlogPosts()
  const archProjects = await getAllArchProjects()
  const techProjects = await getAllTechProjects()

  const index: SearchItem[] = [
    ...posts.map(p => ({
      id: `blog/${p.slug}`, type: 'blog' as const,
      title: p.title, slug: p.slug,
      tags: p.tags, content: markdownToPlainText(p.content),
      description: p.description,
    })),
    ...archProjects.map(p => ({
      id: `arch/${p.slug}`, type: 'architecture' as const,
      title: p.title, slug: p.slug,
      tags: p.tools, content: markdownToPlainText(p.content),
      description: p.description,
    })),
    ...techProjects.map(p => ({
      id: `tech/${p.slug}`, type: 'tech' as const,
      title: p.title, slug: p.slug,
      tags: p.stack, content: markdownToPlainText(p.content),
      description: p.description,
    })),
  ]

  return NextResponse.json(index)
}
```

검색 다이얼로그(`SearchDialog`)와 Graph View(`GraphView`)의 구현은 v2 커리큘럼의 Phase 5와 동일한 패턴.
차이점은 `/api/search-index`와 `/api/graph-data` Route Handler에서 데이터를 제공한다는 것.

### ✅ Phase 8 검증

```bash
pnpm dev

# /api/search-index → JSON 응답
# Ctrl+K → 검색 다이얼로그
# 한글 검색어 → 결과 표시
# /graph → 노트 관계 그래프
```

---

## 🧪 Phase 9: 테스팅 (1-2시간)

### 목표
- 커스텀 remark/rehype 플러그인 테스트 (가장 깨지기 쉬운 부분)
- 콘텐츠 유틸리티 테스트
- Vitest로 실행

### 🎯 실습

#### src/plugins/__tests__/remark-obsidian-wikilinks.test.ts

```typescript
import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import { remarkObsidianWikilinks } from '../remark-obsidian-wikilinks'

async function process(md: string, slugMap?: Map<string, string>) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkObsidianWikilinks, { slugMap })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(md)
  return String(result)
}

describe('remarkObsidianWikilinks', () => {
  it('[[page]] → 링크 변환', async () => {
    const result = await process('참조: [[hello-world]]')
    expect(result).toContain('href="/blog/hello-world"')
  })

  it('[[page|alias]] → alias 텍스트', async () => {
    const result = await process('[[hello-world|인사말]]')
    expect(result).toContain('인사말</a>')
  })

  it('3축 slugMap으로 올바른 경로 해석', async () => {
    const slugMap = new Map([
      ['contech-saas', '/tech/contech-saas'],
      ['gangnam-tower', '/architecture/gangnam-tower'],
      ['hello-world', '/blog/hello-world'],
    ])

    expect(await process('[[contech-saas]]', slugMap)).toContain('href="/tech/contech-saas"')
    expect(await process('[[gangnam-tower]]', slugMap)).toContain('href="/architecture/gangnam-tower"')
    expect(await process('[[hello-world]]', slugMap)).toContain('href="/blog/hello-world"')
  })

  it('![[image.jpg]] → 이미지 변환', async () => {
    const result = await process('![[render.jpg]]')
    expect(result).toContain('<img')
    expect(result).toContain('src="/images/render.jpg"')
  })
})
```

#### src/lib/__tests__/markdown.test.ts

```typescript
import { describe, it, expect } from 'vitest'
import { markdownToPlainText } from '../utils/markdown'
import { extractHeadings } from '../content/toc'

describe('markdownToPlainText', () => {
  it('마크다운 기호 제거', () => {
    const result = markdownToPlainText('# 제목\n**굵은** 텍스트')
    expect(result).not.toContain('#')
    expect(result).not.toContain('**')
  })

  it('WikiLink를 텍스트로 변환', () => {
    const result = markdownToPlainText('보기: [[some-page|페이지]]')
    expect(result).toContain('페이지')
    expect(result).not.toContain('[[')
  })
})

describe('extractHeadings', () => {
  it('한글 슬러그 생성', () => {
    const headings = extractHeadings('## 건축 설계 개요')
    expect(headings[0].slug).toBe('건축-설계-개요')
  })
})
```

### ✅ Phase 9 검증

```bash
pnpm run test:run
# 모든 테스트 통과
```

---

## 🚀 배포: Vercel (1시간)

### Vercel 배포

```bash
# Vercel CLI 설치 (선택)
pnpm add -g vercel

# 방법 1: CLI 배포
vercel

# 방법 2 (권장): GitHub 연동
# 1. GitHub에 push
# 2. vercel.com → Import Project → GitHub 저장소 선택
# 3. 자동 배포 (PR별 Preview Deployment 포함)
```

참고: [Vercel Deploy](https://vercel.com/docs/frameworks/nextjs)

### Obsidian → 자동 배포 워크플로우

```
Obsidian Vault
    ↓ obsidian-git 플러그인 (auto commit + push)
GitHub Repository
    ↓ Vercel GitHub Integration (자동 감지)
Vercel 배포 (빌드 + CDN)
    ↓ Preview URL (PR) / Production URL (main)
```

1. Obsidian에 `obsidian-git` 커뮤니티 플러그인 설치
2. Vault의 `content/` = 저장소의 `src/content/`
3. Obsidian에서 저장 → 자동 커밋 → 자동 배포

### ISR 전략 (선택)

콘텐츠 업데이트가 자주 있다면 ISR(점진적 정적 재생성) 도입 가능:

```typescript
// 예: 블로그 상세 페이지
export const revalidate = 3600  // 1시간마다 재생성
```

처음에는 ISR 없이 시작하고, 배포 빈도가 너무 잦아지면 도입 검토.
참고: [ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

### Analytics (선택)

```bash
pnpm add @vercel/analytics @vercel/speed-insights
```

```typescript
// src/app/layout.tsx body 안에 추가:
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

// ...
<Analytics />
<SpeedInsights />
```

참고: [Vercel Analytics](https://vercel.com/docs/analytics), [Speed Insights](https://vercel.com/docs/speed-insights)

### ✅ 배포 검증

```bash
pnpm build     # 로컬 빌드 확인
pnpm start     # 로컬 프로덕션 서버 테스트

# Vercel 배포 후:
# - 홈, 블로그, 건축, 기술, 소개 페이지 접근
# - /sitemap.xml, /rss.xml, /robots.txt
# - OG 미리보기 (https://www.opengraph.xyz/)
# - Lighthouse 성능 점검
```

---

## 📚 참고 자료

### 코어
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [Next.js 15 Async Params Migration](https://nextjs.org/docs/app/building-your-application/upgrading/version-15#async-request-apis-breaking-change)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [MDX](https://mdxjs.com/)

### 콘텐츠 파이프라인
- [unified](https://unifiedjs.com/)
- [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [AST Explorer](https://astexplorer.net/)

### SEO
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js OG Image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [JSON-LD](https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld)

### 배포
- [Vercel + Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Analytics](https://vercel.com/docs/analytics)

### Obsidian
- [Obsidian Link Format](https://help.obsidian.md/Files+and+folders/Manage+notes#link-format)
- [Obsidian Callouts](https://help.obsidian.md/Editing+and+formatting/Callouts)
- [obsidian-git plugin](https://github.com/denolehov/obsidian-git)

### 검색/시각화
- [FlexSearch](https://github.com/nextapps-de/flexsearch)
- [d3-force](https://d3js.org/d3-force)

### 테스팅
- [Vitest](https://vitest.dev/)

---

## 📝 v2 → v3 변경 요약

| 항목 | v2 (이전) | v3 (현재) |
|------|----------|----------|
| 배포 | GitHub Pages (`output: 'export'`) | **Vercel (네이티브 Next.js)** |
| 이미지 | sharp 빌드 타임 수동 최적화 | **next/image 네이티브 최적화** |
| 콘텐츠 구조 | posts + projects 2축 | **blog + architecture + tech 3축** |
| frontmatter | 단일 스키마 | **도메인별 분리 (gallery, tools, stack, ...)** |
| 라우팅 | `/posts/[...slug]` | **`/blog/[slug]`, `/architecture/[slug]`, `/tech/[slug]`** |
| RSS/sitemap | 빌드 스크립트 | **Route Handlers (앱 내부)** |
| 검색 인덱스 | 빌드 스크립트 → public/ | **Route Handler `/api/search-index`** |
| ISR | 불가 | **선택적 도입 가능** |
| OG 이미지 | 정적만 가능 | **동적 생성 가능 (`@vercel/og`)** |
| Middleware | 불가 | **사용 가능 (다국어 등)** |
| 상태관리 관점 | Zustand 3개 스토어 | **최소화: 테마/필터 정도만** |
| 포트폴리오 상세 | 단순 MDX | **갤러리, 메타 dl/dt, next/image** |
| 아키텍처 마인드셋 | 웹앱 성향 | **콘텐츠 사이트 우선** |

---

## ✨ 학습 진행 가이드

### 각 Phase 진행 방식
1. **핵심 개념** 읽기 + 공식 문서 참조 링크 확인
2. **코드 직접 작성** (복사보다 타이핑)
3. **`pnpm dev`로 확인** + DevTools 활용
4. **`pnpm run type-check`** — 매 Phase 끝
5. **git commit** (작은 단위로 자주)

### 학습 팁
- 공식 문서를 자주 참고 (각 Phase에 링크 첨부됨)
- TypeScript 에러를 무시하지 말 것 — 타입이 잡히면 런타임 버그가 줄어듦
- Phase 9 이후에는 플러그인 수정 시 테스트 먼저 작성 (TDD)
- Vercel Preview Deploy를 적극 활용 — PR 올리면 자동으로 미리보기 URL 생성

---

**시작할 준비가 되셨나요? Setup Phase부터 시작하겠습니다! 🚀**