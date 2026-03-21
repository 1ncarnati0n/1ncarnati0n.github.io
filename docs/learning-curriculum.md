# 포트폴리오 & 기술블로그 종합 학습 커리큘럼

> **프로젝트**: 1ncarnati0n.github.io (Next.js 16 + React 19 + Tailwind 4.2)
> **학습 방식**: 기존 코드 읽기 → 이해 → 리팩토링 → 개념 체화
> **TypeScript**: JIT(Just-In-Time) — 리팩토링 중 만나는 순간에 학습
> **원칙**: 새로 만들기보다 이미 작성된 코드를 개선하면서 배운다

---

## 학습 철학

```
❌ 이론 먼저 → 실습 나중에
✅ 기존 코드 읽기 → "이게 왜 이렇게 됐지?" → 리팩토링 → 개념 자연스럽게 습득

매 단계마다:
  1. 📖 읽기   — 기존 파일을 열고 구조를 파악한다
  2. 🔍 분석   — "이 코드가 하는 일"과 "개선할 점"을 찾는다
  3. 🔧 리팩토링 — 직접 고치면서 개념을 체화한다
  4. 📍 TS JIT — 리팩토링 중 만나는 타입 개념을 그때 익힌다
```

---

## 커리큘럼 구조 개요

```
Phase 0  환경 & 구조 읽기 ────── "프로젝트 전체 지도 그리기"
Phase 1  컴포넌트 해부 ──────── "Button, Toggle을 뜯어보고 개선"
Phase 2  레이아웃 리팩토링 ──── "Header, Layout 구조 정리"
Phase 3  페이지 & 라우팅 ────── "page.tsx 들을 읽고 패턴 파악"
Phase 4  콘텐츠 파이프라인 ──── "마크다운 → 화면 흐름 추적"
Phase 5  상태관리 리팩토링 ──── "useThemeStore 분석 → 확장"
Phase 6  비동기 & 데이터 ────── "API 레이어 구축"
Phase 7  인터랙션 고도화 ────── "검색, 목차, 애니메이션"
Phase 8  최적화 & 배포 ──────── "성능 개선, SEO, 퍼블리싱"
```

---

## Phase 0 — 환경 & 구조 읽기 (1~2일)

> 코드를 고치려면, 먼저 전체 그림을 머릿속에 그려야 한다.

### 0-1. 프로젝트 디렉토리 지도

```
src/
├── app/                          ← 페이지 (폴더 = URL)
│   ├── layout.tsx                  전역 레이아웃 (Header 포함)
│   ├── page.tsx                    / (홈)
│   ├── not-found.tsx               404
│   ├── about/page.tsx              /about
│   ├── blog/
│   │   ├── layout.tsx              블로그 전용 레이아웃
│   │   ├── page.tsx                /blog (목록)
│   │   └── [slug]/page.tsx         /blog/:slug (상세)
│   ├── works/
│   │   ├── page.tsx                /works (목록)
│   │   └── [slug]/page.tsx         /works/:slug (상세)
│   └── design/page.tsx             /design
│
├── components/
│   ├── ui/                        범용 UI (Button, DarkModeToggle)
│   ├── layout/                    레이아웃 (Header)
│   └── blog/                      블로그 전용 (BlogArticle, BlogSideMenu)
│
├── lib/content/                   콘텐츠 파싱 (posts, works, mdx, obsidian)
├── store/                         Zustand 스토어 (useThemeStore)
└── types/                         타입 정의 (content.ts)
```

### 0-2. 개발 서버로 현재 상태 확인

```bash
npm run dev          # 브라우저에서 각 페이지 돌아보기
npm run type-check   # 타입 에러 있는지 확인
```

**할 일**: 각 URL(`/`, `/blog`, `/works`, `/about`)을 브라우저에서 열어보고 어떤 컴포넌트가 어떤 페이지에 쓰이는지 메모

---

## Phase 1 — 컴포넌트 해부 (1~2주)

> 가장 작은 파일부터 열어보고, React + Tailwind 기초를 체화한다.

### 1-1. `Button.tsx` 읽기 & 리팩토링

📖 **열어볼 파일**: `src/components/ui/Button.tsx`

| 읽으면서 확인할 것 | 배우는 개념 |
|-------------------|------------|
| 함수 시그니처 `function Button(...)` | **함수형 컴포넌트** — React에서 UI는 함수다 |
| `{ children, ...props }` 구조 | **Props** — 부모가 넘겨주는 데이터 |
| `className="..."` | **JSX** — HTML과 비슷하지만 `class` 대신 `className` |
| Tailwind 유틸리티 클래스 | **Tailwind 기초** — `p-`, `text-`, `bg-` 등 |

```
📍 TS JIT: Props 타입 정의
   type ButtonProps = { children: React.ReactNode; onClick?: () => void }
   → type = "이 데이터의 모양은 이렇다"라는 선언
   → ? = optional (있어도 되고 없어도 됨)
```

🔧 **리팩토링 과제**:
- `variant` prop 추가 (`'primary' | 'ghost' | 'outline'`)
- 각 variant에 맞는 Tailwind 스타일 분기
- 비활성 상태 `disabled` prop 추가

### 1-2. `DarkModeToggle.tsx` 읽기 & 리팩토링

📖 **열어볼 파일**: `src/components/ui/DarkModeToggle.tsx`

| 읽으면서 확인할 것 | 배우는 개념 |
|-------------------|------------|
| `'use client'` 선언 | **Client Component** — 브라우저에서 실행 (이벤트, Hook 사용 가능) |
| `useState` 사용 | **상태** — 값이 바뀌면 화면이 자동 업데이트 |
| `onClick` 핸들러 | **이벤트** — 사용자 클릭에 반응 |
| 조건부 렌더링 `{isDark ? ☀ : ☾}` | **삼항 연산자** — 상태에 따라 다른 UI |

```
📍 TS JIT: 이벤트 핸들러 타입
   onClick: () => void          ← 인자 없이 호출, 반환값 없음
   onChange: (value: string) => void  ← 값을 받아서 처리
   → IDE에서 자동완성 되므로 외울 필요 없음
```

🔧 **리팩토링 과제**:
- Zustand `useThemeStore`와 연결되어 있는지 확인
- 토글 시 아이콘 전환 애니메이션 추가 (`transition-transform`)
- `aria-label` 접근성 속성 확인 및 보강

### 1-3. `BlogSideMenu.tsx` 읽기 & 분석

📖 **열어볼 파일**: `src/components/blog/BlogSideMenu.tsx`

| 읽으면서 확인할 것 | 배우는 개념 |
|-------------------|------------|
| `tree.map(node => ...)` | **리스트 렌더링** — 배열 → UI 목록 |
| `key={node.slug}` | **key** — React가 각 아이템을 구분하는 ID |
| `useState` + `useMemo` | **Hook 조합** — 상태 + 파생 데이터 |
| `FolderNode` / `PostNode` 분리 | **컴포넌트 분리** — 역할별로 쪼개기 |
| `usePathname()` | **라우팅 Hook** — 현재 URL 읽기 |
| 파생 상태 패턴 (`autoExpanded ⊕ userToggled`) | **React 19 모범 사례** — useEffect 대신 렌더 중 상태 조정 |

```
📍 TS JIT: 유니온 타입과 타입 좁히기
   type BlogTreeNode = BlogTreeFolderNode | BlogTreePostNode
   → "둘 중 하나"를 나타내는 유니온 타입
   → if (node.type === 'folder') 이후 자동으로 FolderNode 타입으로 좁혀짐
```

🔧 **리팩토링 과제**:
- 폴더 접힘/펼침 시 부드러운 높이 트랜지션 추가
- 포스트 제목 옆에 날짜 표시 (BlogTreePostNode에 `date` 필드 추가 필요 여부 검토)

---

## Phase 2 — 레이아웃 리팩토링 (1~2주)

> 페이지 뼈대를 구성하는 파일들을 읽고 개선한다.

### 2-1. `Header.tsx` 읽기 & 리팩토링

📖 **열어볼 파일**: `src/components/layout/Header.tsx`

| 읽으면서 확인할 것 | 배우는 개념 |
|-------------------|------------|
| `<nav>` + `<Link>` 구조 | **시맨틱 HTML** + **Next.js Link** |
| `flex items-center justify-between` | **Flexbox** — 가로 배치의 핵심 |
| `gap-`, `px-`, `py-` | **Tailwind 간격** — padding, margin, gap |

| Tailwind Flex 핵심 | 클래스 | 역할 |
|--------------------|--------|------|
| 가로 배치 | `flex` (기본 row) | 자식을 가로로 나열 |
| 세로 중앙 | `items-center` | cross-axis 정렬 |
| 양쪽 끝 | `justify-between` | main-axis 분배 |
| 나머지 공간 차지 | `flex-1` | 남은 공간 전부 사용 |

🔧 **리팩토링 과제**:
- 현재 페이지에 해당하는 메뉴에 **활성 스타일** 적용 (`usePathname()` 활용)
- 모바일 대응: `md:hidden`으로 햄버거 메뉴 버튼 추가 (기능은 Phase 5에서)
- 스크롤 시 배경 투명도/그림자 변경 (scroll 이벤트 or `backdrop-blur`)

### 2-2. `layout.tsx` 계층 구조 분석

📖 **열어볼 파일들** (순서대로):
1. `src/app/layout.tsx` — 전역 레이아웃
2. `src/app/blog/layout.tsx` — 블로그 전용 레이아웃

```
app/layout.tsx (전역)
  └── <Header />
  └── {children}  ← 여기에 하위 layout이 들어감
        └── blog/layout.tsx (블로그)
              └── <BlogSideMenu />  +  {children}
                                          └── blog/page.tsx 또는 blog/[slug]/page.tsx
```

| 개념 | 설명 |
|------|------|
| `layout.tsx` | 자식 페이지를 감싸는 **껍데기** — 페이지 이동 시에도 유지됨 |
| `{children}` | 하위 page.tsx가 여기에 렌더링됨 |
| 중첩 | 전역 layout 안에 블로그 layout이 중첩 |

```
📍 TS JIT: children 타입
   { children: React.ReactNode }
   → ReactNode = 문자열, 숫자, JSX, 배열, null 등 렌더 가능한 모든 것
```

🔧 **리팩토링 과제**:
- `blog/layout.tsx`를 Grid 기반 2열 레이아웃으로 정리
  ```
  grid grid-cols-1 lg:grid-cols-[240px_1fr]
  ```
- 모바일에서 사이드메뉴 숨김 (`hidden lg:block`)
- `max-w-` 컨테이너로 본문 최대 너비 제한

### 2-3. 반응형 디자인 적용

| 브레이크포인트 | 접두사 | 대상 | 이 프로젝트에서의 역할 |
|---------------|--------|------|----------------------|
| 640px | `sm:` | 대형 모바일 | 카드 1열 → 1열 (유지) |
| 768px | `md:` | 태블릿 | 네비 메뉴 표시 |
| 1024px | `lg:` | 데스크톱 | 사이드바 표시 |
| 1280px | `xl:` | 와이드 | Works 3열 그리드 |

🔧 **리팩토링 과제**:
- 모든 레이아웃 파일에 반응형 적용 여부 점검
- Works 페이지 카드 그리드: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`

---

## Phase 3 — 페이지 & 라우팅 (1주)

> page.tsx 파일들을 하나씩 열어보며 라우팅 패턴을 이해한다.

### 3-1. 정적 페이지 읽기

📖 **열어볼 파일들**:
- `src/app/page.tsx` — 홈
- `src/app/about/page.tsx` — About
- `src/app/not-found.tsx` — 404

| 확인할 것 | 배우는 개념 |
|-----------|------------|
| `export default function Page()` | **페이지 컴포넌트** — 파일 이름이 URL이 된다 |
| `metadata` export | **SEO** — 페이지별 title, description |
| Server Component (기본) | `'use client'` 없으면 서버에서 실행 |

### 3-2. 동적 페이지 읽기

📖 **열어볼 파일**: `src/app/blog/[slug]/page.tsx`

```
URL: /blog/my-first-post
  → params.slug = "my-first-post"
  → 이 slug로 마크다운 파일을 찾아서 렌더링
```

| 확인할 것 | 배우는 개념 |
|-----------|------------|
| `[slug]` 폴더명 | **동적 세그먼트** — URL의 변하는 부분 |
| `await params` | **Next.js 16** — params가 Promise (async) |
| `generateStaticParams` | **정적 생성** — 빌드 시 모든 slug를 미리 생성 |

```
📍 TS JIT: Next.js 16 async params
   type Props = { params: Promise<{ slug: string }> }
   const { slug } = await params
   → Next.js 16부터 params, searchParams 모두 async
```

🔧 **리팩토링 과제**:
- `generateMetadata()`로 동적 OG 태그 구현 (블로그 포스트 제목 → 페이지 타이틀)
- `loading.tsx` 추가하여 로딩 스켈레톤 표시
- `not-found()` 호출 처리 (존재하지 않는 slug)

### 3-3. 네비게이션 패턴 정리

📖 프로젝트에서 사용 중인 네비게이션 방식 확인:

| 방법 | 파일 | 사용처 |
|------|------|--------|
| `<Link href="...">` | Header.tsx | 메뉴 이동 |
| `usePathname()` | BlogSideMenu.tsx | 현재 경로로 활성 항목 표시 |
| `useRouter()` | (필요시 추가) | 프로그래밍적 이동 |

---

## Phase 4 — 콘텐츠 파이프라인 (1~2주)

> 마크다운이 화면에 보이기까지의 전체 흐름을 추적한다.

### 4-1. 파이프라인 전체 흐름

```
content/blog/*.md                    ← 원본 마크다운
    ↓
src/lib/content/posts.ts             ← 파일 읽기 + frontmatter 파싱 (gray-matter)
    ↓
src/lib/content/blog-slug.ts         ← slug 생성 규칙
    ↓
src/lib/content/mdx.ts               ← MDX 직렬화 (rehype/remark 플러그인)
    ↓
src/app/blog/[slug]/page.tsx         ← 동적 페이지에서 호출
    ↓
src/components/blog/BlogArticle.tsx  ← 최종 렌더링
```

### 4-2. 파일별 역할 분석 (순서대로 읽기)

| 순서 | 파일 | 핵심 역할 | 배우는 개념 |
|------|------|----------|------------|
| 1 | `posts.ts` | 파일 시스템에서 .md 읽기, 정렬 | `fs.readFile`, `async/await`, 배열 메서드 |
| 2 | `blog-slug.ts` | Obsidian 호환 slug 생성 | 문자열 처리, 정규식 기초 |
| 3 | `content.ts` (types) | 데이터 모양 정의 | **TS JIT**: interface, 유니온, 제네릭 |
| 4 | `mdx.ts` | MDX → React 변환 설정 | 플러그인 시스템 이해 |
| 5 | `BlogArticle.tsx` | 최종 HTML 렌더링 | 컴포넌트 조합 |

```
📍 TS JIT: 제네릭과 Promise
   async function getAllPosts(): Promise<BlogPost[]>
   → Promise<T> = "나중에 T 타입의 데이터를 줄게"
   → BlogPost[] = "BlogPost의 배열"
```

### 4-3. Frontmatter ↔ 타입 매칭

📖 **비교하면서 읽기**: 마크다운 frontmatter ↔ `src/types/content.ts`

```markdown
---                              interface BlogFrontmatter {
slug: my-post                      slug: string
title: "첫 번째 포스트"             title?: string
date: "2026-03-01"                 date?: string
tags: [react, nextjs]              tags?: string[] | string
draft: false                       draft?: boolean
---                              }
```

🔧 **리팩토링 과제**:
- `posts.ts`의 정렬 로직 읽고 이해 → 날짜순 외에 시리즈별 그룹핑 추가 검토
- `BlogArticle.tsx` 스타일 점검 → 코드 블록, 인용문, 테이블 등 MDX 요소별 스타일 확인
- `obsidian.ts` 읽고 Obsidian 위키링크(`[[]]`) 변환 로직 이해

---

## Phase 5 — 상태관리 리팩토링 (1주)

> 이미 있는 Zustand 스토어를 분석하고, 새 스토어를 추가한다.

### 5-1. `useThemeStore.ts` 해부

📖 **열어볼 파일**: `src/store/useThemeStore.ts`

| 읽으면서 확인할 것 | 배우는 개념 |
|-------------------|------------|
| `create<ThemeStore>(...)` | **Zustand 기본** — `create`로 스토어 생성 |
| `set((state) => ...)` | **불변 업데이트** — 이전 상태 기반으로 새 상태 |
| `useThemeStore((s) => s.theme)` | **selector** — 필요한 것만 구독 (성능) |

```
📍 TS JIT: 유니온 타입과 리터럴 타입
   theme: 'light' | 'dark'
   → 문자열이지만 이 두 값만 허용
   → 오타 치면 빨간 줄 → 컴파일러가 잡아줌
```

**왜 Zustand인가? (vs Props Drilling)**
```
Props로 전달하면:
  App → Layout → Header → DarkModeToggle  (4단계 전달)
  App → Layout → BlogLayout → SideMenu    (여기서도 theme 필요하면 또 전달)

Zustand:
  아무 컴포넌트에서 useThemeStore() 호출 → 바로 사용
```

🔧 **리팩토링 과제**:
- `useThemeStore`가 `DarkModeToggle`에서 제대로 사용되는지 확인
- 불필요한 로컬 `useState`가 있으면 Zustand로 통합
- localStorage 연동 persist 미들웨어 검토

### 5-2. 새 스토어 만들기: `useSidebarStore`

```typescript
// src/store/useSidebarStore.ts — 직접 만들어볼 것
import { create } from 'zustand'

type SidebarStore = {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

// TODO: create()로 스토어 구현
```

**연결할 컴포넌트**:
- `Header.tsx` — 햄버거 버튼에서 `toggle()` 호출
- `BlogSideMenu.tsx` (모바일) — `isOpen`에 따라 표시/숨김
- 오버레이 클릭 시 `close()` 호출

---

## Phase 6 — 비동기 & 데이터 (1~2주)

> 외부 API를 호출하는 레이어를 구축한다.

### 6-1. 현재 데이터 흐름 분석

📖 프로젝트의 현재 데이터 소스:

| 데이터 | 소스 | 방식 |
|--------|------|------|
| 블로그 포스트 | 로컬 `.md` 파일 | `fs.readFile` (서버 사이드) |
| Works 프로젝트 | 로컬 `.md` 파일 | `fs.readFile` (서버 사이드) |
| 테마 | Zustand 스토어 | 클라이언트 상태 |
| GitHub 데이터 | ❌ 아직 없음 | → Axios로 구현 예정 |

### 6-2. Axios 클라이언트 구축

```typescript
// src/lib/api/client.ts — 직접 만들어볼 것
import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// TODO: 응답 인터셉터로 에러 공통 처리
```

```
📍 TS JIT: async/await와 Promise
   async function fetchRepos(): Promise<GitHubRepo[]> { ... }
   → async = "이 함수는 비동기"
   → await = "완료될 때까지 기다림"
   → Promise<T> = "나중에 T를 반환"
```

### 6-3. Server Component vs Client Component 데이터 페칭

| 위치 | 방법 | 언제 사용 |
|------|------|----------|
| Server Component | `await fetch()` 직접 | 페이지 로드 시 (대부분) |
| Client Component | `useEffect` + Axios | 사용자 인터랙션 이후 |
| API Route | `app/api/*/route.ts` | 외부 webhook, 프록시 |

🔧 **리팩토링 과제**:
- About 페이지에 GitHub 리포지토리 목록 추가
  - `https://api.github.com/users/{username}/repos`
  - 로딩 → 스켈레톤 UI, 에러 → 재시도 버튼
- 블로그 포스트에 GitHub 커밋 히스토리 연동 검토

---

## Phase 7 — 인터랙션 고도화 (2주)

> 기존 기능을 개선하고, 새로운 UX 요소를 추가한다.

### 7-1. `BlogSideMenu.tsx` 애니메이션 추가

📖 현재 상태: 폴더 접힘/펼침이 즉시 토글
🔧 목표: 높이 트랜지션으로 부드럽게

| 기법 | 설명 |
|------|------|
| CSS `transition` | `max-height` + `overflow-hidden` |
| `useRef` | 자식 높이 측정용 DOM 참조 |
| `aria-expanded` | 이미 적용됨 → 접근성 OK |

```
📍 TS JIT: useRef 제네릭
   const listRef = useRef<HTMLUListElement>(null)
   → <> 안에 참조할 DOM 요소의 타입을 지정
   → null 초기값 = "아직 DOM에 연결 안 됨"
```

### 7-2. 블로그 검색 기능

| 단계 | 구현 내용 | 파일 |
|------|----------|------|
| 1 | 검색 인풋 UI | `components/blog/SearchInput.tsx` |
| 2 | FlexSearch 인덱스 구축 | `lib/search/index.ts` |
| 3 | 디바운스 처리 | 커스텀 Hook 또는 `setTimeout` |
| 4 | 결과 표시 + 하이라이팅 | `components/blog/SearchResults.tsx` |
| 5 | Zustand `useSearchStore` | 검색 상태 전역 관리 |

### 7-3. 목차 (Table of Contents)

```
마크다운 → Heading 추출 (이미 types/content.ts에 Heading 타입 존재)
  → TOC 렌더링
  → IntersectionObserver로 현재 읽는 위치 추적
  → 활성 항목 하이라이트
```

### 7-4. 트랜지션 & 마이크로 인터랙션

📖 **기존 코드에서 개선할 부분 찾기**:

| 위치 | 현재 | 개선 |
|------|------|------|
| BlogSideMenu 화살표 | `transition-transform` ✅ | 폴더 높이도 트랜지션 |
| Header 메뉴 | 즉시 전환 | `transition-colors` 추가 |
| Works 카드 | 정적 | hover 시 살짝 올라오는 효과 |
| 페이지 전환 | 즉시 | (향후) View Transitions API |

---

## Phase 8 — 최적화 & 배포 (1주)

> 실제 사용자에게 보여줄 준비. 기존 코드의 성능을 점검한다.

### 8-1. 성능 점검 체크리스트

📖 **기존 코드에서 확인할 것**:

| 항목 | 확인 파일 | 개선 |
|------|----------|------|
| 이미지 최적화 | Works, Blog | `next/image` 사용 여부 |
| 폰트 로딩 | `layout.tsx` | `next/font` 사용 여부 |
| 불필요한 리렌더링 | BlogSideMenu, DarkModeToggle | `useMemo` / selector 최적화 |
| 번들 크기 | `package.json` | 사용 안 하는 의존성 제거 |

### 8-2. SEO 점검

| 항목 | 구현 파일 |
|------|----------|
| 정적 메타데이터 | 각 `page.tsx`의 `metadata` export |
| 동적 메타데이터 | `blog/[slug]`의 `generateMetadata()` |
| 사이트맵 | `src/app/sitemap.ts` (생성 필요 시) |
| robots.txt | `src/app/robots.ts` (생성 필요 시) |

### 8-3. GitHub Pages 배포

```bash
# next.config.ts 확인
output: 'export'     # 정적 HTML 생성

# 빌드
npm run build

# GitHub Actions 워크플로우 확인
.github/workflows/deploy.yml
```

---

## TypeScript JIT 참조표

> 리팩토링 중 만나는 TS 개념을 Phase별로 정리.
> 외우지 말고 필요할 때 돌아와서 확인.

| Phase | 만나는 상황 | TS 개념 | 핵심 |
|-------|-----------|---------|------|
| 1 | Button props 정의 | `type`, `?` optional | `type Props = { label: string; size?: number }` |
| 1 | 이벤트 핸들러 | 함수 타입 | `onClick: () => void` |
| 2 | Layout children | `React.ReactNode` | 렌더 가능한 모든 것 |
| 3 | 동적 params | `Promise<T>` | `params: Promise<{ slug: string }>` |
| 4 | 포스트 목록 | 제네릭, 배열 | `Promise<BlogPost[]>` |
| 4 | 콘텐츠 타입 구분 | interface, extends | `BlogPost extends BaseContent` |
| 5 | 스토어 상태 | 유니온, 리터럴 | `theme: 'light' \| 'dark'` |
| 5 | 트리 노드 분기 | 타입 좁히기 | `if (node.type === 'post')` → 자동 타입 추론 |
| 6 | API 응답 | `async/await` | `async (): Promise<Repo[]>` |
| 7 | DOM 참조 | `useRef<T>` | `useRef<HTMLDivElement>(null)` |
| 7 | 유틸리티 타입 | `Partial`, `Pick`, `Omit` | `Partial<BlogPost>` = 모든 필드 optional |

---

## 학습 리소스

| 주제 | 리소스 |
|------|--------|
| React 공식 | https://react.dev/learn |
| Next.js 공식 | https://nextjs.org/docs |
| Tailwind 공식 | https://tailwindcss.com/docs |
| Zustand 공식 | https://zustand.docs.pmnd.rs |
| TypeScript | https://www.typescriptlang.org/docs/handbook |

---

## 진행 체크리스트

- [ ] **Phase 0** — 프로젝트 구조 지도 그리기, dev 서버로 전체 확인
- [ ] **Phase 1** — Button 리팩토링, DarkModeToggle 분석, BlogSideMenu 이해
- [ ] **Phase 2** — Header 활성 메뉴, blog/layout.tsx 2열 Grid, 반응형 적용
- [ ] **Phase 3** — [slug] 페이지 분석, generateMetadata 구현, loading.tsx 추가
- [ ] **Phase 4** — 콘텐츠 파이프라인 추적 (posts → mdx → BlogArticle)
- [ ] **Phase 5** — useThemeStore 분석, useSidebarStore 구현
- [ ] **Phase 6** — Axios 클라이언트 구축, GitHub API 연동
- [ ] **Phase 7** — 검색 기능, 목차, 애니메이션 고도화
- [ ] **Phase 8** — 성능 점검, SEO, GitHub Pages 배포
