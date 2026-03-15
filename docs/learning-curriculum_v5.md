# 📚 Next.js 포트폴리오 블로그 학습 커리큘럼 v5

**Next.js 16 · Tailwind CSS v4 · TypeScript · React 19.2**

포트폴리오 블로그를 만들어가면서 프론트엔드 핵심 기술을 실전으로 익히는 가이드.

> **학습 철학**: "프로젝트를 먼저 세우고, 그 위에서 문법을 익힌다."
> — 빈 화면에서 이론부터 배우지 않는다. 프로젝트를 만들면서 필요한 문법을 그때그때 복습한다.

---

## 📋 커리큘럼 개요

| Phase | 핵심 주제 | 만드는 것 | 복습하는 문법 | 소요 시간 |
|-------|----------|----------|-------------|---------|
| **Phase 1** | 프로젝트 셋업 + App Router | 라우트 뼈대, 빈 페이지들 | TS 기본 타입, async/await | 2-3시간 |
| **Phase 2** | Tailwind v4 디자인 시스템 | globals.css 전역 설정 | CSS 변수, @theme, @layer | 2-3시간 |
| **Phase 3** | 레이아웃 + UI 컴포넌트 | Header, Footer, Card, Button | React 컴포넌트, Props, Hooks, 제네릭 | 4-5시간 |
| **Phase 4** | 타입 설계 + 콘텐츠 파이프라인 | 블로그 글 목록/상세 동작 | interface, 제네릭, fs 비동기, Promise | 4-5시간 |
| **Phase 5** | 페이지 조립 + 인터랙션 | 홈, 목록, 상세 페이지 완성 | 조건부 렌더링, map, useMemo | 3-4시간 |
| **Phase 6** | SEO + 메타데이터 | OG, sitemap, JSON-LD | Metadata API, generateMetadata | 2-3시간 |
| **Phase 7** | 검색 + 테스팅 | 검색 기능 + Vitest | Route Handler, 테스트 패턴 | 2-3시간 |
| **Phase 8** | 배포 + 마무리 | 라이브 사이트 | Vercel, 성능 최적화 | 1-2시간 |

**총 소요 시간**: 약 22-28시간

---

## 🏗️ 아키텍처 개요

### 기술스택

```
코어 ─────────────────────────────────────────────
  Next.js 16        ← Turbopack 기본 번들러, React 19.2
  React 19.2        ← View Transitions, useEffectEvent
  TypeScript 5.x    ← PageProps 타입 자동 생성
  Tailwind CSS v4   ← CSS-first 설정, Oxide 엔진(Rust)

콘텐츠 ───────────────────────────────────────────
  gray-matter       ← frontmatter 파싱
  unified + remark + rehype  ← 마크다운 → HTML 파이프라인
  rehype-pretty-code + shiki ← 코드 하이라이팅

배포 ─────────────────────────────────────────────
  Vercel            ← Next.js 네이티브 지원
```

### Next.js 16 주요 변화 (vs 15)

| 항목 | Next.js 15 | Next.js 16 |
|------|-----------|-----------|
| 번들러 | Webpack (Turbopack 옵션) | **Turbopack 기본** |
| async params | 동기 접근 경고 | **동기 접근 완전 제거** |
| 타입 헬퍼 | 수동 타입 작성 | **`PageProps<'/blog/[slug]'>` 자동 생성** |
| Middleware | middleware.ts | **proxy.ts로 이름 변경** |
| React | 19.0 | **19.2** (View Transitions, useEffectEvent) |
| React Compiler | 실험적 | **stable** (자동 메모이제이션) |
| 캐싱 | 기본 캐시 있음 | **모두 opt-in** (Cache Components) |
| next lint | 내장 | **제거** (Biome/ESLint 직접 사용) |

- 출처: https://nextjs.org/blog/next-16
- 출처: https://nextjs.org/docs/app/guides/upgrading/version-16

### Server / Client 분리 원칙

```
Server Component (기본)          Client Component ('use client')
───────────────────────         ─────────────────────────────
• async/await 가능               • useState, useEffect 가능
• fs, DB 접근 가능               • onClick 등 이벤트 핸들러
• 번들에 포함 안 됨               • 브라우저 API 접근
• Hooks 사용 불가                • 번들에 포함됨

→ 데이터 로딩, 콘텐츠 렌더링      → 다크모드, 검색, 메뉴, 필터
```

- 출처: https://nextjs.org/docs/app/building-your-application/rendering/server-components

---

## 🔧 Phase 1: 프로젝트 셋업 + App Router (2-3시간)

> **이 Phase에서 복습하는 문법**: TS 기본 타입, 타입 추론, async/await

### 목표
- Next.js 16 프로젝트 생성
- 파일 기반 라우팅 구조 완성
- Next.js 16의 **async params** (동기 접근 완전 제거)
- Layout, Error, Loading, Not Found 파일 규약

---

### 1-1. 프로젝트 생성

```bash
npx create-next-app@latest my-portfolio \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm

cd my-portfolio
```

> Next.js 16에서는 `create-next-app`이 **Turbopack**을 기본 번들러로 사용하고,
> App Router + TypeScript + Tailwind CSS가 기본 포함됩니다.
> `--eslint` 플래그는 16에서 제거되었습니다. Biome 또는 ESLint를 직접 설정합니다.

- 출처: https://nextjs.org/docs/app/api-reference/cli/create-next-app

### 1-2. 추가 의존성 설치

```bash
# 콘텐츠 파이프라인
pnpm add gray-matter unified remark-parse remark-gfm \
  remark-rehype rehype-raw rehype-pretty-code rehype-slug \
  rehype-autolink-headings rehype-stringify shiki \
  reading-time github-slugger

# 검색
pnpm add flexsearch

# 개발
pnpm add -D vitest @testing-library/react
```

### 1-3. 디렉터리 구조

```
src/
  app/
    layout.tsx           ← 루트 레이아웃
    page.tsx             ← 홈 (/)
    error.tsx            ← 에러 바운더리
    loading.tsx          ← 로딩 UI
    not-found.tsx        ← 404
    blog/
      page.tsx           ← /blog
      [slug]/
        page.tsx         ← /blog/my-post
    projects/
      page.tsx           ← /projects
      [slug]/
        page.tsx         ← /projects/my-project
    about/
      page.tsx           ← /about
    sitemap.ts
  components/
    ui/                  ← 디자인 시스템 기반 컴포넌트
    layout/              ← Header, Footer
    blog/                ← PostCard, TOC 등
    mdx/                 ← MDX 커스텀 컴포넌트
  content/
    blog/
    projects/
  lib/
    content/             ← 파일 읽기, 파싱
    utils/               ← 날짜, 슬러그 등
  styles/
    globals.css          ← ★ 전역 디자인 시스템
  types/
    content.ts           ← 콘텐츠 타입 정의
```

---

### 1-4. Next.js 16 async params + PageProps 타입 헬퍼

> **📝 TS 복습**: 기본 타입, Promise, async/await

Next.js 16에서는 `params`의 동기 접근이 **완전히 제거**되었습니다.
또한 `npx next typegen`으로 **라우트 기반 타입을 자동 생성**할 수 있습니다.

```bash
# 타입 헬퍼 자동 생성 (PageProps, LayoutProps 등)
npx next typegen
```

```typescript
// ── 방법 1: 자동 생성된 PageProps 사용 (권장) ──
// PageProps<'/blog/[slug]'>은 자동으로 params의 타입을 추론
export default async function BlogPostPage(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  //                ^^^^^ 반드시 await — 16에서는 동기 접근 불가
  return <article><h1>{slug}</h1></article>
}

// ── 방법 2: 수동 타입 지정 ──
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
  //      ^^^^^^^ Promise로 감싸야 함
}) {
  const { slug } = await params
  return <article><h1>{slug}</h1></article>
}
```

**📝 TS 복습 포인트 — 기본 타입과 Promise**:

```typescript
// ── 기본 타입 ──
const title: string = 'My Blog'
const year: number = 2025
const isDraft: boolean = false
const tags: string[] = ['Next.js', 'React']

// ── 타입 추론: TS가 알아서 유추 ──
const message = 'hello'  // string으로 추론 — 명시 불필요
const count = 42          // number로 추론

// ── Promise: 비동기 작업의 결과를 담는 컨테이너 ──
// params의 타입이 Promise<{ slug: string }>인 이유:
// → "나중에 { slug: string } 값을 줄게" 라는 약속
// → await으로 그 약속이 이행될 때까지 기다림
const { slug } = await params  // Promise가 이행되면 { slug: 'hello' }

// ── async 함수는 항상 Promise를 반환 ──
async function getTitle(): Promise<string> {
  return 'Hello World'
}
// getTitle()의 반환값은 Promise<string>
```

- 출처: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- 출처: https://nextjs.org/docs/app/guides/upgrading/version-16

---

### 1-5. 라우트 뼈대 만들기

```typescript
// ── src/app/layout.tsx ──
import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'My Portfolio',
    template: '%s | My Portfolio',
  },
  description: 'Frontend Developer Portfolio & Blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        {/* Phase 3에서 Header/Footer 추가 */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
```

```typescript
// ── src/app/page.tsx ──
export default function Home() {
  return (
    <div>
      <h1>Portfolio</h1>
      <p>Phase 3에서 UI 컴포넌트로 채워질 홈 페이지</p>
    </div>
  )
}
```

```typescript
// ── src/app/blog/[slug]/page.tsx ──
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return []  // Phase 4에서 구현
}

export default async function BlogPostPage(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  // Phase 4에서 콘텐츠 로딩 구현
  return <article><h1>{slug}</h1></article>
}
```

```typescript
// ── src/app/error.tsx ── (Error Boundary는 반드시 'use client')
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">문제가 발생했습니다</h1>
        <button onClick={reset}>다시 시도</button>
      </div>
    </div>
  )
}
```

- 출처: https://nextjs.org/docs/app/building-your-application/routing/error-handling

### ✅ Phase 1 검증

```bash
pnpm dev
# / → 홈
# /blog → 블로그 목록 (빈 페이지)
# /projects → 프로젝트 목록 (빈 페이지)
# /about → 소개 (빈 페이지)
# /nonexistent → 404
```

---

## 🎨 Phase 2: Tailwind v4 디자인 시스템 — globals.css (2-3시간)

> **이 Phase의 핵심**: 스타일을 하드코딩하지 않고, `globals.css`에서 **전역 디자인 토큰**을 정의하여
> 프로젝트 전체가 일관된 스타일 시스템 위에서 동작하도록 만든다.

### 목표
- Tailwind v4의 CSS-first 설정 완전 이해
- `@theme` — 디자인 토큰 (색상, 폰트, 간격, 반경 등)
- `@layer base` — HTML 요소 기본 스타일
- `@layer components` — 재사용 컴포넌트 스타일
- `@layer utilities` — 커스텀 유틸리티
- 다크모드 전역 설정

---

### 2-1. Tailwind v4 핵심 변화

**v3과 v4의 근본적 차이**: 설정 파일이 JS에서 CSS로 이동.

| 항목 | v3 | v4 |
|------|----|----|
| 설정 파일 | `tailwind.config.js` (JS) | **`globals.css` 내 `@theme`** (CSS) |
| 임포트 | `@tailwind base; @tailwind components; @tailwind utilities;` | **`@import "tailwindcss";`** |
| content 경로 | config에서 명시 | **자동 감지** |
| 빌드 엔진 | PostCSS (JS) | **Oxide 엔진 (Rust)** |
| 전처리기 | Sass/Less 호환 | **비호환** (Tailwind 자체가 전처리기) |
| 다크모드 | `darkMode: 'class'` (JS) | **`@custom-variant dark (...)`** (CSS) |

- 출처: https://tailwindcss.com/blog/tailwindcss-v4
- 출처: https://tailwindcss.com/docs/upgrade-guide

---

### 2-2. globals.css — 전역 디자인 시스템

이 파일이 프로젝트 전체의 **단일 스타일 진실 원천(Single Source of Truth)**입니다.
모든 색상, 폰트, 간격, 반경 등을 여기서 정의하고, 컴포넌트에서는 이 토큰들을 참조합니다.

```css
/* ══════════════════════════════════════════════════
   src/styles/globals.css
   전역 디자인 시스템 — 모든 스타일의 원천
   ══════════════════════════════════════════════════ */

/* ── 1. Tailwind 임포트 ── */
@import "tailwindcss";

/* ── 2. 다크모드: class 기반 전략 ── */
@custom-variant dark (&:where(.dark, .dark *));


/* ══════════════════════════════════════════════════
   @theme — 디자인 토큰 정의
   여기서 정의한 값은 Tailwind 유틸리티 클래스로 자동 사용 가능
   예: --color-primary → bg-primary, text-primary, border-primary
   ══════════════════════════════════════════════════ */
@theme {
  /* ── 색상 팔레트 ──
     Tailwind 기본 색상(neutral, blue 등)은 그대로 사용 가능.
     여기에 프로젝트 고유 색상만 추가 정의한다. */
  --color-primary: #18181b;         /* zinc-900 계열 — 주요 텍스트 */
  --color-secondary: #52525b;       /* zinc-600 계열 — 보조 텍스트 */
  --color-accent: #2563eb;          /* blue-600 계열 — 강조, 링크 */
  --color-accent-hover: #1d4ed8;    /* blue-700 계열 — 강조 호버 */
  --color-surface: #ffffff;         /* 카드/섹션 배경 */
  --color-surface-alt: #f4f4f5;     /* zinc-100 계열 — 대체 배경 */
  --color-border: #e4e4e7;          /* zinc-200 계열 — 테두리 */
  --color-muted: #a1a1aa;           /* zinc-400 계열 — 비활성 텍스트 */

  /* ── 다크모드 색상 ──
     다크모드에서 사용할 색상을 별도 토큰으로 정의.
     컴포넌트에서 dark: 접두사로 전환한다. */
  --color-dark-primary: #fafafa;
  --color-dark-secondary: #a1a1aa;
  --color-dark-accent: #60a5fa;     /* blue-400 */
  --color-dark-accent-hover: #93bbfd;
  --color-dark-surface: #18181b;
  --color-dark-surface-alt: #27272a;
  --color-dark-border: #3f3f46;
  --color-dark-muted: #71717a;

  /* ── 타이포그래피 ──
     폰트 패밀리는 next/font에서 CSS 변수로 주입됨.
     @theme에서는 fallback 포함 정의. */
  --font-sans: var(--font-body), "Pretendard", system-ui, sans-serif;
  --font-mono: var(--font-code), "JetBrains Mono", monospace;
  --font-heading: var(--font-display), "Pretendard", system-ui, sans-serif;

  /* ── 간격 스케일 (spacing) ──
     Tailwind v4는 동적 간격(예: p-13)을 지원하지만,
     프로젝트 고유의 의미있는 간격을 정의할 수 있다. */
  --spacing-content: 4rem;          /* 섹션 간 여백 */
  --spacing-section: 6rem;          /* 큰 섹션 간 여백 */

  /* ── 반경 (border-radius) ── */
  --radius-sm: 0.375rem;            /* 6px — 태그, 뱃지 */
  --radius-md: 0.5rem;              /* 8px — 카드, 입력 */
  --radius-lg: 0.75rem;             /* 12px — 모달, 큰 카드 */
  --radius-full: 9999px;            /* 원형 */

  /* ── 그림자 ── */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* ── 트랜지션 ── */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  /* ── 레이아웃 ── */
  --width-content: 48rem;           /* 768px — 본문 콘텐츠 */
  --width-wide: 64rem;              /* 1024px — 넓은 레이아웃 */
  --width-max: 80rem;               /* 1280px — 최대 폭 */
}


/* ══════════════════════════════════════════════════
   @layer base — HTML 요소 기본 스타일
   태그 자체에 프로젝트의 기본 스타일을 적용.
   컴포넌트에서 매번 같은 클래스를 반복하지 않아도 됨.
   ══════════════════════════════════════════════════ */
@layer base {
  html {
    @apply scroll-smooth;
  }

  body {
    font-family: var(--font-sans);
    background-color: var(--color-surface);
    color: var(--color-primary);
    @apply antialiased;
  }

  /* 다크모드 body */
  .dark body {
    background-color: var(--color-dark-surface);
    color: var(--color-dark-primary);
  }

  /* 제목 */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    @apply font-bold tracking-tight;
  }

  /* 코드 */
  code {
    font-family: var(--font-mono);
    @apply text-sm;
  }

  /* 포커스 링 — 접근성 */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-accent;
  }

  /* 링크 기본 */
  a {
    color: var(--color-accent);
    transition: color var(--transition-fast);
  }
  a:hover {
    color: var(--color-accent-hover);
  }
  .dark a {
    color: var(--color-dark-accent);
  }
  .dark a:hover {
    color: var(--color-dark-accent-hover);
  }
}


/* ══════════════════════════════════════════════════
   @layer components — 재사용 컴포넌트 스타일
   자주 반복되는 패턴을 클래스로 추출.
   React 컴포넌트 안에서 이 클래스명을 사용한다.
   ══════════════════════════════════════════════════ */
@layer components {
  /* ── 레이아웃 컨테이너 ── */
  .container-content {
    max-width: var(--width-content);
    @apply mx-auto px-4;
  }
  .container-wide {
    max-width: var(--width-wide);
    @apply mx-auto px-4;
  }
  .container-max {
    max-width: var(--width-max);
    @apply mx-auto px-4;
  }

  /* ── 카드 ── */
  .card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    @apply p-5;
    transition: box-shadow var(--transition-base),
                border-color var(--transition-base);
  }
  .card:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-muted);
  }
  .dark .card {
    background-color: var(--color-dark-surface-alt);
    border-color: var(--color-dark-border);
  }
  .dark .card:hover {
    border-color: var(--color-dark-muted);
  }

  /* ── 태그/뱃지 ── */
  .badge {
    @apply inline-flex items-center px-2 py-0.5 text-xs font-medium;
    border-radius: var(--radius-sm);
    background-color: var(--color-surface-alt);
    color: var(--color-secondary);
  }
  .dark .badge {
    background-color: var(--color-dark-surface-alt);
    color: var(--color-dark-secondary);
  }

  /* ── 버튼 ── */
  .btn {
    @apply inline-flex items-center justify-center font-medium;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    @apply px-4 py-2 text-sm;
  }
  .btn-primary {
    background-color: var(--color-accent);
    color: white;
  }
  .btn-primary:hover {
    background-color: var(--color-accent-hover);
  }
  .btn-ghost {
    @apply bg-transparent;
    color: var(--color-secondary);
  }
  .btn-ghost:hover {
    background-color: var(--color-surface-alt);
  }
  .dark .btn-ghost:hover {
    background-color: var(--color-dark-surface-alt);
  }

  /* ── 구분선 ── */
  .divider {
    border-top: 1px solid var(--color-border);
  }
  .dark .divider {
    border-top-color: var(--color-dark-border);
  }

  /* ── 마크다운 본문 스타일 (prose) ── */
  .prose-custom h2 {
    @apply text-2xl mt-12 mb-4;
    color: var(--color-primary);
  }
  .dark .prose-custom h2 {
    color: var(--color-dark-primary);
  }
  .prose-custom h3 {
    @apply text-xl mt-8 mb-3;
  }
  .prose-custom p {
    @apply leading-7 mb-4;
    color: var(--color-secondary);
  }
  .dark .prose-custom p {
    color: var(--color-dark-secondary);
  }
  .prose-custom pre {
    @apply rounded-lg p-4 my-6 overflow-x-auto text-sm;
    background-color: var(--color-dark-surface) !important;
  }
  .prose-custom code:not(pre code) {
    @apply px-1.5 py-0.5 rounded text-sm;
    background-color: var(--color-surface-alt);
    color: var(--color-accent);
  }
  .dark .prose-custom code:not(pre code) {
    background-color: var(--color-dark-surface-alt);
    color: var(--color-dark-accent);
  }
  .prose-custom ul { @apply list-disc pl-6 mb-4 space-y-1; }
  .prose-custom ol { @apply list-decimal pl-6 mb-4 space-y-1; }
  .prose-custom blockquote {
    @apply pl-4 my-4 italic;
    border-left: 3px solid var(--color-accent);
    color: var(--color-muted);
  }
  .prose-custom img {
    @apply rounded-lg my-6;
  }
  .prose-custom a {
    @apply underline underline-offset-2;
    color: var(--color-accent);
  }
}


/* ══════════════════════════════════════════════════
   @layer utilities — 커스텀 유틸리티
   Tailwind 기본에 없는 유틸리티를 추가.
   ══════════════════════════════════════════════════ */
@layer utilities {
  /* 텍스트 줄임 */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* 스크롤바 숨김 */
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
}
```

---

### 2-3. 디자인 시스템의 사용 흐름

```
globals.css @theme     →  디자인 토큰 정의 (색상, 폰트, 간격)
     ↓
globals.css @layer     →  재사용 컴포넌트 스타일 (.card, .btn, .badge)
     ↓
React 컴포넌트         →  토큰 기반 클래스 사용 (bg-accent, text-primary)
                          + 컴포넌트 클래스 사용 (.card, .btn-primary)
                          + Tailwind 유틸리티 조합 (flex, gap-4, p-6)
```

**왜 이렇게 하는가?**

```tsx
// ❌ 하드코딩 — 색상을 바꾸려면 모든 파일을 수정해야 함
<div className="bg-white border border-zinc-200 rounded-lg p-5">
  <h2 className="text-zinc-900 text-xl font-bold">제목</h2>
  <p className="text-zinc-600">설명</p>
</div>

// ✅ 디자인 시스템 — globals.css에서 토큰만 바꾸면 전체 반영
<div className="card">
  <h2 className="text-primary text-xl font-bold">제목</h2>
  <p className="text-secondary">설명</p>
</div>
// text-primary → @theme의 --color-primary → 한 곳에서 관리
// .card → @layer components에서 정의 → 일관된 카드 스타일
```

---

### 2-4. layout.tsx에 폰트 + 다크모드 연결

```typescript
// ── src/app/layout.tsx (Phase 2 업데이트) ──
import type { Metadata } from 'next'
import { Noto_Sans_KR, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'

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
  title: { default: 'My Portfolio', template: '%s | My Portfolio' },
  description: 'Frontend Developer Portfolio & Blog',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${notoSansKR.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* 다크모드 FOUC(깜빡임) 방지 — 페이지 로드 전에 실행 */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            if (localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') &&
                 window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark')
            }
          } catch(e) {}
        `}} />
      </head>
      <body>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
```

**학습 포인트**:
- `next/font`의 `variable` 옵션 → CSS 변수(`--font-body`)로 주입 → `@theme`의 `--font-sans`에서 참조
- 다크모드 스크립트는 `<head>`에서 동기 실행 → 페이지 깜빡임 방지
- 출처: https://nextjs.org/docs/app/building-your-application/optimizing/fonts

### ✅ Phase 2 검증

```bash
pnpm dev
# 1. 페이지에 폰트 적용 확인 (개발자도구 → Elements → Computed 탭)
# 2. .card, .badge 클래스 직접 테스트 (<div class="card">테스트</div>)
# 3. html 태그에 class="dark" 추가 → 다크모드 전환 확인
```

---

## 🧩 Phase 3: 레이아웃 + UI 컴포넌트 (4-5시간)

> **이 Phase에서 복습하는 문법**: React 컴포넌트, Props 타입, Hooks(useState, useEffect),
> 제네릭, 이벤트 핸들러, 조건부 렌더링

### 목표
- 디자인 시스템 토큰을 활용한 실제 컴포넌트 제작
- Header, Footer, ThemeToggle, Card, Button 등
- Server Component vs Client Component 실전 적용

---

### 3-1. ThemeToggle — useState, useEffect 복습

```tsx
// ── src/components/ui/ThemeToggle.tsx ──
'use client'  // ← Hooks 사용 → Client Component 필수

import { useState, useEffect } from 'react'

// 📝 React 복습: 함수형 컴포넌트 = 함수가 JSX를 반환
export function ThemeToggle() {
  // 📝 useState: 컴포넌트의 상태를 선언
  // useState<'light' | 'dark'>: 제네릭으로 상태 타입 지정
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // 📝 useEffect(callback, []): 컴포넌트 mount 시 1회 실행
  // → 브라우저에서만 실행 (서버에서는 실행 안 됨)
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initial = saved ?? (
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    )
    setTheme(initial)
  }, [])  // [] = 의존성 없음 = mount 시 1회만

  // 📝 useEffect(callback, [theme]): theme이 변경될 때마다 실행
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  // 📝 이벤트 핸들러: onClick에 함수 전달
  const toggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
    // 📝 setter에 콜백(prev => ...): 이전 값 기반으로 안전하게 업데이트
  }

  return (
    <button
      onClick={toggle}
      className="btn-ghost p-2 rounded-lg"
      aria-label={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
    >
      {/* 📝 조건부 렌더링: 삼항 연산자 */}
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

**📝 복습 정리**:
- `useState<T>()`: 상태 선언 + 제네릭으로 타입 지정
- `useEffect(fn, [])`: mount 시 1회 / `useEffect(fn, [dep])`: dep 변경 시 실행
- `'use client'`: Hooks, 이벤트, 브라우저 API 사용 시 필수
- 출처: https://react.dev/reference/react/useState
- 출처: https://react.dev/reference/react/useEffect

---

### 3-2. Header — Props, 배열 map, 조건부 렌더링

```tsx
// ── src/components/layout/Header.tsx ──
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

// 📝 TS 복습: 객체 타입 정의 (interface)
interface NavItem {
  href: string
  label: string
}

// 📝 TS 복습: 상수 배열에 타입 적용
const navItems: NavItem[] = [
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border-b border-border dark:border-dark-border">
      <nav className="container-wide h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold font-heading no-underline text-primary dark:text-dark-primary">
          Portfolio
        </Link>

        {/* 데스크톱 내비게이션 */}
        <ul className="hidden md:flex items-center gap-8">
          {/* 📝 React 복습: map으로 리스트 렌더링. key 필수 */}
          {navItems.map(item => (
            <li key={item.href}>
              <Link href={item.href} className="text-secondary dark:text-dark-secondary hover:text-accent dark:hover:text-dark-accent no-underline transition-colors">
                {item.label}
              </Link>
            </li>
          ))}
          <li><ThemeToggle /></li>
        </ul>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden btn-ghost p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          {/* 📝 조건부 렌더링: && 패턴과 삼항 */}
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* 📝 조건부 렌더링: mobileOpen이 true일 때만 렌더링 */}
      {mobileOpen && (
        <ul className="md:hidden border-t border-border dark:border-dark-border p-4 space-y-2 bg-surface dark:bg-dark-surface">
          {navItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block py-2 text-secondary dark:text-dark-secondary no-underline"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pt-2"><ThemeToggle /></li>
        </ul>
      )}
    </header>
  )
}
```

**📝 복습 정리**:
- `interface`: 객체의 형태(shape) 정의
- `NavItem[]`: 배열 타입
- `.map(item => <JSX />)`: 리스트 렌더링, `key` 필수
- `{condition && <JSX />}`: 조건부 렌더링
- 출처: https://react.dev/learn/rendering-lists

---

### 3-3. 제네릭 컴포넌트 — Card

```tsx
// ── src/components/ui/Card.tsx ──
import Link from 'next/link'

// 📝 TS 복습: 제네릭 Props
// T extends { slug: string }  → T는 최소한 slug 필드를 가져야 함
// "어떤 데이터든 받되, slug는 반드시 있어야 한다"
interface CardProps<T extends { slug: string }> {
  item: T
  basePath: string                     // '/blog' 또는 '/projects'
  renderContent: (item: T) => React.ReactNode  // 렌더링 위임
}

// 📝 제네릭 함수 컴포넌트
export function Card<T extends { slug: string }>({
  item,
  basePath,
  renderContent,
}: CardProps<T>) {
  return (
    <Link href={`${basePath}/${item.slug}`} className="block no-underline">
      <article className="card group">
        {renderContent(item)}
      </article>
    </Link>
  )
}
```

사용 예시 (Phase 5에서 실전 적용):

```tsx
// BlogPost 타입은 slug 필드를 가지고 있으므로 제네릭 제약 충족
<Card
  item={post}
  basePath="/blog"
  renderContent={(p) => (
    <>
      <h2 className="text-xl font-bold group-hover:text-accent">{p.title}</h2>
      <p className="text-secondary mt-1">{p.description}</p>
    </>
  )}
/>
```

**📝 제네릭 복습**:
- `<T>`: "타입의 변수". 호출 시점에 구체적인 타입이 결정됨
- `T extends { slug: string }`: 제약 조건 — T는 최소 조건을 만족해야 함
- 재사용 가능: BlogPost, Project 등 다양한 타입에 같은 Card 사용
- 출처: https://www.typescriptlang.org/docs/handbook/2/generics.html

---

### 3-4. Footer

```tsx
// ── src/components/layout/Footer.tsx ──
// 📝 Server Component — 'use client' 없음. 정적 콘텐츠만.
export function Footer() {
  return (
    <footer className="border-t border-border dark:border-dark-border mt-section">
      <div className="container-wide py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted dark:text-dark-muted">
        <p>© {new Date().getFullYear()} My Portfolio</p>
        <div className="flex gap-4">
          <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
```

### 3-5. layout.tsx에 Header/Footer 연결

```typescript
// ── src/app/layout.tsx (Phase 3 업데이트) ──
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
// ... (기존 코드)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>{/* 다크모드 스크립트 */}</head>
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### ✅ Phase 3 검증

```bash
pnpm dev
# 1. Header: 데스크톱 메뉴 + 모바일 햄버거 전환
# 2. 다크모드 토글 → 새로고침 후 유지
# 3. .card, .badge, .btn-primary 클래스 적용 확인
# 4. 반응형: md 브레이크포인트에서 레이아웃 변화
```

**📝 Phase 3 복습 체크리스트**:
- [ ] 함수형 컴포넌트 + Props 타입 작성 가능
- [ ] useState, useEffect의 의존성 배열 설명 가능
- [ ] 제네릭 컴포넌트의 `<T extends ...>` 의미 설명 가능
- [ ] Server Component vs Client Component 구분 기준 설명 가능
- [ ] `map` + `key`로 리스트 렌더링 가능
- [ ] 디자인 토큰(globals.css)이 컴포넌트에서 어떻게 적용되는지 설명 가능

---

## 📝 Phase 4: 타입 설계 + 콘텐츠 파이프라인 (4-5시간)

> **이 Phase에서 복습하는 문법**: interface extends, 유틸리티 타입(Partial, Pick, Omit),
> 타입 단언(as), 타입 가드, fs 비동기, try/catch, Promise.all

### 목표
- 콘텐츠 타입 정의 (TypeScript 실전)
- gray-matter + unified 파이프라인
- fs/promises로 마크다운 파일 읽기
- `generateStaticParams`로 빌드 타임 정적 생성

---

### 4-1. 타입 설계

```typescript
// ── src/types/content.ts ──

// 📝 TS 복습: interface — 객체의 형태 정의
// optional(?) 필드와 리터럴 유니온 타입 활용

export interface BlogFrontmatter {
  title: string
  description: string
  date: string               // ISO 날짜 문자열
  updated?: string           // 📝 ? = optional (있어도 되고 없어도 됨)
  tags: string[]
  draft?: boolean
  cover?: string
  series?: string
}

export interface ProjectFrontmatter {
  title: string
  description: string
  date: string
  role: string
  stack: string[]
  repo?: string
  demo?: string
  cover?: string
  category: string
  highlights?: string[]
}

// 📝 TS 복습: interface extends — 공통 필드 재사용
interface BaseContent {
  slug: string
  title: string
  description: string
  date: Date
  cover?: string
  readingTime: number
  content: string
}

export interface BlogPost extends BaseContent {
  type: 'blog'               // 📝 discriminated union 판별자
  tags: string[]
  draft: boolean
  series?: string
  updated?: Date
}

export interface Project extends BaseContent {
  type: 'project'
  role: string
  stack: string[]
  repo?: string
  demo?: string
  highlights: string[]
  category: string
}

// 📝 TS 복습: 유니온 타입 — "이것 또는 저것"
export type AnyContent = BlogPost | Project

// 📝 TS 복습: 유틸리티 타입
// Pick: 일부 필드만 선택
export type PostPreview = Pick<BlogPost, 'slug' | 'title' | 'date' | 'tags' | 'description' | 'readingTime'>
// Omit: 특정 필드 제거
export type PostWithoutContent = Omit<BlogPost, 'content'>

// ── UI 타입 ──
export interface Heading {
  level: 2 | 3 | 4            // 📝 리터럴 유니온: 2, 3, 4만 허용
  text: string
  slug: string
}

export interface SearchItem {
  id: string
  type: 'blog' | 'project'
  title: string
  slug: string
  tags: string[]
  description: string
}
```

- 출처: https://www.typescriptlang.org/docs/handbook/2/objects.html
- 출처: https://www.typescriptlang.org/docs/handbook/utility-types.html

---

### 4-2. 블로그 콘텐츠 로더 — fs 비동기 실전

```typescript
// ── src/lib/content/posts.ts ──
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost, BlogFrontmatter } from '@/types/content'

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog')

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // 📝 비동기 복습: try/catch로 에러 핸들링
  let files: string[]
  try {
    files = await fs.readdir(BLOG_DIR)  // 📝 await: Promise 완료 대기
  } catch {
    return []  // 디렉터리 없으면 빈 배열
  }

  const posts: BlogPost[] = []

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue

    const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    // 📝 TS 복습: 타입 단언(as) — gray-matter는 any 반환
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
      cover: fm.cover,
      readingTime: Math.ceil(content.split(/\s+/).length / 200),
      content,
    })
  }

  return posts.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // 📝 비동기 복습: 순차적 try로 여러 확장자 시도
  for (const ext of ['.md', '.mdx']) {
    try {
      const filePath = path.join(BLOG_DIR, `${slug}${ext}`)
      const raw = await fs.readFile(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const fm = data as BlogFrontmatter

      return {
        type: 'blog', slug,
        title: fm.title || slug,
        description: fm.description || '',
        date: new Date(fm.date || Date.now()),
        tags: fm.tags || [],
        draft: fm.draft || false,
        series: fm.series, cover: fm.cover,
        readingTime: Math.ceil(content.split(/\s+/).length / 200),
        content,
      }
    } catch { continue }
  }
  return null
}
```

---

### 4-3. MDX 렌더링 파이프라인

```typescript
// ── src/lib/content/mdx.ts ──
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'

// 📝 비동기 복습: async 함수는 항상 Promise 반환
export async function renderMarkdown(source: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)            // 마크다운 텍스트 → AST
    .use(remarkGfm)              // GFM 확장 (테이블, 체크박스)
    .use(remarkRehype, { allowDangerousHtml: true })  // remark → rehype
    .use(rehypeRaw)              // HTML 문자열을 AST로
    .use(rehypeSlug)             // 제목에 id 추가
    .use(rehypeAutolinkHeadings) // 제목에 앵커 링크
    .use(rehypePrettyCode, { theme: 'github-dark-dimmed' })
    .use(rehypeStringify)        // AST → HTML 문자열
    .process(source)

  return String(result)
}
```

- 출처: https://unifiedjs.com/

---

### 4-4. 페이지에 연결

```typescript
// ── src/app/blog/page.tsx ──
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/content/posts'

// 📝 Server Component: async 함수로 데이터 직접 로딩
export default async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <div className="container-content py-content">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <article key={post.slug} className="card">
            <Link href={`/blog/${post.slug}`} className="no-underline">
              <h2 className="text-xl font-bold text-primary dark:text-dark-primary group-hover:text-accent">
                {post.title}
              </h2>
            </Link>
            <p className="text-secondary dark:text-dark-secondary mt-1 line-clamp-2">
              {post.description}
            </p>
            <div className="flex items-center gap-2 mt-3 text-sm text-muted dark:text-dark-muted">
              <time>{post.date.toLocaleDateString('ko-KR')}</time>
              <span>·</span>
              <span>{post.readingTime}분</span>
            </div>
            <div className="flex gap-2 mt-2">
              {post.tags.map(tag => (
                <span key={tag} className="badge">{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
```

```typescript
// ── src/app/blog/[slug]/page.tsx ──
import { notFound } from 'next/navigation'
import { getAllBlogPosts, getBlogPost } from '@/lib/content/posts'
import { renderMarkdown } from '@/lib/content/mdx'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map(post => ({ slug: post.slug }))
}

// 📝 Next.js 16: PageProps 타입 헬퍼 사용
export async function generateMetadata(
  props: PageProps<'/blog/[slug]'>
): Promise<Metadata> {
  const { slug } = await props.params
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
    },
  }
}

export default async function BlogPostPage(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const html = await renderMarkdown(post.content)

  return (
    <article className="container-content py-content">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
        <div className="flex items-center gap-2 mt-3 text-sm text-muted dark:text-dark-muted">
          <time dateTime={post.date.toISOString()}>
            {post.date.toLocaleDateString('ko-KR')}
          </time>
          <span>·</span>
          <span>{post.readingTime}분 읽기</span>
        </div>
        <div className="flex gap-2 mt-3">
          {post.tags.map(tag => <span key={tag} className="badge">{tag}</span>)}
        </div>
      </header>

      <div className="divider mb-8" />

      {/* 📝 globals.css의 .prose-custom 스타일 적용 */}
      <div
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}
```

### ✅ Phase 4 검증

```bash
# 테스트 마크다운 파일을 src/content/blog/ 에 생성 후
pnpm dev
# /blog → 글 목록 (카드 스타일, 태그 badge)
# /blog/[slug] → 글 상세 (prose-custom 스타일)
```

---

## 🏠 Phase 5: 페이지 조립 + 인터랙션 (3-4시간)

> **복습**: Promise.all, useMemo, 컴포넌트 합성

### 목표
- 프로젝트 로더 (Phase 4 패턴 반복)
- 홈 페이지 조립 (병렬 데이터 로딩)
- 태그 필터 (Client Component 실전)

---

### 5-1. 프로젝트 로더 (동일 패턴 반복 = 체화)

`src/lib/content/projects.ts` — 블로그 로더와 동일 패턴으로 작성.
타입만 `Project`, `ProjectFrontmatter`로 바꿈. **반복이 핵심**.

### 5-2. 홈 페이지 — Promise.all 복습

```typescript
// ── src/app/page.tsx ──
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/content/posts'
import { getAllProjects } from '@/lib/content/projects'

export default async function Home() {
  // 📝 비동기 복습: Promise.all — 병렬 실행 (순차보다 빠름)
  const [posts, projects] = await Promise.all([
    getAllBlogPosts(),
    getAllProjects(),
  ])

  const recentPosts = posts.slice(0, 3)
  const featuredProjects = projects.slice(0, 3)

  return (
    <div className="container-content py-section">
      {/* 히어로 */}
      <section className="mb-section">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Frontend Developer
        </h1>
        <p className="text-lg text-secondary dark:text-dark-secondary max-w-2xl">
          소개 텍스트
        </p>
      </section>

      {/* 최근 글 */}
      <section className="mb-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">최근 글</h2>
          <Link href="/blog" className="text-sm">모든 글 →</Link>
        </div>
        <div className="space-y-4">
          {recentPosts.map(post => (
            <article key={post.slug} className="card">
              <Link href={`/blog/${post.slug}`} className="no-underline">
                <h3 className="font-bold text-primary dark:text-dark-primary">{post.title}</h3>
              </Link>
              <p className="text-sm text-muted dark:text-dark-muted mt-1">{post.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 프로젝트 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Projects</h2>
          <Link href="/projects" className="text-sm">모든 프로젝트 →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProjects.map(project => (
            <article key={project.slug} className="card">
              <h3 className="font-bold">{project.title}</h3>
              <p className="text-sm text-secondary dark:text-dark-secondary mt-1">{project.description}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {project.stack.slice(0, 3).map(s => (
                  <span key={s} className="badge">{s}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
```

### 5-3. 태그 필터 — useMemo 복습

```tsx
// ── src/components/blog/TagFilter.tsx ──
'use client'

import { useState, useMemo } from 'react'
import type { BlogPost } from '@/types/content'

interface TagFilterProps {
  posts: BlogPost[]
}

export function TagFilter({ posts }: TagFilterProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // 📝 useMemo: 의존성이 변경될 때만 재계산
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach(p => p.tags.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts
    return posts.filter(p => p.tags.includes(selectedTag))
  }, [posts, selectedTag])

  return (
    <div>
      {/* 태그 버튼 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedTag(null)}
          className={`badge ${!selectedTag ? 'bg-accent text-white' : ''}`}
        >
          전체
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`badge cursor-pointer ${tag === selectedTag ? 'bg-accent text-white' : ''}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 필터된 글 목록 */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <article key={post.slug} className="card">
            <h2 className="font-bold">{post.title}</h2>
            <p className="text-sm text-secondary dark:text-dark-secondary mt-1">{post.description}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
```

### ✅ Phase 5 검증

```bash
pnpm dev
# / → 최근 글 + 프로젝트 동시 표시
# /blog → 태그 필터 동작 (있으면)
# /projects → 목록 표시
```

---

## 🔍 Phase 6: SEO + 메타데이터 (2-3시간)

### 목표
- Metadata API, generateMetadata
- sitemap.ts, JSON-LD
- OG 이미지

```typescript
// ── src/app/sitemap.ts ──
import type { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/content/posts'
import { getAllProjects } from '@/lib/content/projects'

const BASE_URL = 'https://your-domain.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([
    getAllBlogPosts(),
    getAllProjects(),
  ])

  return [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/projects`, changeFrequency: 'monthly', priority: 0.9 },
    ...posts.map(p => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: p.date,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...projects.map(p => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      lastModified: p.date,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ]
}
```

- 출처: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- 출처: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

---

## 🔎 Phase 7: 검색 + 테스팅 (2-3시간)

### 7-1. 검색 인덱스 Route Handler

```typescript
// ── src/app/api/search-index/route.ts ──
import { NextResponse } from 'next/server'
import { getAllBlogPosts } from '@/lib/content/posts'
import { getAllProjects } from '@/lib/content/projects'
import type { SearchItem } from '@/types/content'

export async function GET() {
  const [posts, projects] = await Promise.all([
    getAllBlogPosts(),
    getAllProjects(),
  ])

  const index: SearchItem[] = [
    ...posts.map(p => ({
      id: `blog/${p.slug}`, type: 'blog' as const,
      title: p.title, slug: p.slug,
      tags: p.tags, description: p.description,
    })),
    ...projects.map(p => ({
      id: `project/${p.slug}`, type: 'project' as const,
      title: p.title, slug: p.slug,
      tags: p.stack, description: p.description,
    })),
  ]

  return NextResponse.json(index)
}
```

### 7-2. Vitest 테스트

```typescript
// ── vitest.config.ts ──
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: { environment: 'node', globals: true, include: ['src/**/*.test.ts'] },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

```typescript
// ── src/lib/__tests__/content.test.ts ──
import { describe, it, expect } from 'vitest'

describe('콘텐츠 유틸리티', () => {
  it('파일명에서 slug 추출', () => {
    expect('hello-world.md'.replace(/\.mdx?$/, '')).toBe('hello-world')
    expect('my-post.mdx'.replace(/\.mdx?$/, '')).toBe('my-post')
  })

  it('읽기 시간 계산 (200wpm 기준)', () => {
    const content = 'word '.repeat(450)
    expect(Math.ceil(content.split(/\s+/).length / 200)).toBe(3)
  })

  it('날짜 내림차순 정렬', () => {
    const dates = [new Date('2025-01'), new Date('2025-03'), new Date('2025-02')]
    const sorted = [...dates].sort((a, b) => b.getTime() - a.getTime())
    expect(sorted[0].getMonth()).toBe(2) // March (0-indexed)
  })
})
```

- 출처: https://vitest.dev/guide/

---

## 🚀 Phase 8: 배포 + 마무리 (1-2시간)

```bash
# Vercel 배포 (GitHub 연동 권장)
# 1. GitHub에 push
# 2. vercel.com → Import Project → 저장소 선택
# 3. 자동 배포
```

### 배포 후 체크리스트

```bash
pnpm build   # 빌드 에러 없음 확인
pnpm start   # 로컬 프로덕션 테스트

# 배포 후:
# - 모든 페이지 접근
# - /sitemap.xml
# - Lighthouse 90점+
# - OG 미리보기 (opengraph.xyz)
```

- 출처: https://vercel.com/docs/frameworks/nextjs

---

## 📚 참고 자료 (모든 공식 문서)

### Next.js 16
- App Router: https://nextjs.org/docs/app
- v16 업그레이드 가이드: https://nextjs.org/docs/app/guides/upgrading/version-16
- v16 릴리즈 노트: https://nextjs.org/blog/next-16
- proxy.ts: https://nextjs.org/docs/app/getting-started/proxy
- Metadata API: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- generateStaticParams: https://nextjs.org/docs/app/api-reference/functions/generate-static-params

### React 19.2
- Hooks: https://react.dev/reference/react/hooks
- Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components

### TypeScript
- Handbook: https://www.typescriptlang.org/docs/handbook/
- 유틸리티 타입: https://www.typescriptlang.org/docs/handbook/utility-types.html
- 제네릭: https://www.typescriptlang.org/docs/handbook/2/generics.html

### Tailwind CSS v4
- 공식 문서: https://tailwindcss.com/docs
- v4 릴리즈: https://tailwindcss.com/blog/tailwindcss-v4
- 업그레이드 가이드: https://tailwindcss.com/docs/upgrade-guide

### 콘텐츠 파이프라인
- unified: https://unifiedjs.com/
- gray-matter: https://github.com/jonschlinkert/gray-matter

### 배포 / 테스팅
- Vercel: https://vercel.com/docs/frameworks/nextjs
- Vitest: https://vitest.dev/
- FlexSearch: https://github.com/nextapps-de/flexsearch

---

## 🔮 완료 후 확장 로드맵

1. **Obsidian 연동**: WikiLink, Callout 커스텀 remark 플러그인
2. **3축 분리**: blog + architecture + tech 구조로 확장
3. **Graph View**: d3-force 노트 관계 시각화
4. **Cache Components**: `"use cache"` 지시자 활용한 캐싱 전략
5. **ISR / 다국어**: 점진적 정적 재생성 + i18n
6. **shadcn/ui**: 디자인 시스템 위에 UI 라이브러리 통합

---

**Phase 1: 프로젝트 셋업부터 시작합시다! 🚀**
