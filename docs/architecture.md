# Architecture — 1ncarnati0n.github.io

> Architecture Portfolio & Tech Blog
> Next.js 15 정적 사이트 · GitHub Pages 배포

---

## 1. 기술 스택 요약

| 레이어 | 기술 | 버전 |
|--------|------|------|
| **프레임워크** | Next.js (App Router) | 15.1.0 |
| **UI 런타임** | React | 19.0.0 |
| **언어** | TypeScript (strict) | 5.7.0 |
| **빌드 출력** | Static Export (`output: "export"`) | — |
| **호스팅** | GitHub Pages | — |
| **CI/CD** | GitHub Actions | Node.js 22 |
| **패키지 관리** | npm | — |
| **모듈 시스템** | ESM (`"type": "module"`) | — |

---

## 2. 디렉토리 구조

```
1ncarnati0n.github.io/
├── src/
│   ├── app/                         # Next.js App Router (페이지)
│   │   ├── layout.tsx               # 루트 레이아웃 (HTML 셸)
│   │   ├── page.tsx                 # 홈 페이지
│   │   ├── not-found.tsx            # 404 페이지
│   │   ├── posts/
│   │   │   ├── page.tsx             # 블로그 목록
│   │   │   └── [...slug]/page.tsx   # 개별 포스트 (동적 라우트)
│   │   ├── projects/
│   │   │   ├── page.tsx             # 프로젝트 그리드 (카테고리 필터)
│   │   │   └── [...slug]/page.tsx   # 개별 프로젝트 (동적 라우트)
│   │   └── tags/
│   │       ├── page.tsx             # 태그 인덱스
│   │       └── [tag]/page.tsx       # 태그별 포스트 목록
│   │
│   ├── components/                  # React 컴포넌트 (15개)
│   ├── lib/                         # 유틸리티 & 콘텐츠 로더 (6개)
│   ├── plugins/                     # 커스텀 Remark/Rehype 플러그인 (3개)
│   └── styles/                      # 글로벌 CSS (5개)
│
├── content/                         # 마크다운 콘텐츠
│   ├── posts/                       # 블로그 포스트 (카테고리별 디렉토리)
│   ├── projects/                    # 건축 프로젝트 (21개)
│   └── _images/                     # Wikilink 이미지
│
├── public/                          # 정적 에셋
│   ├── thumbs/                      # 프로젝트 썸네일 (27개 jpg)
│   ├── favicon.svg
│   ├── robots.txt
│   ├── .nojekyll
│   └── search-index.json           # 빌드 시 생성
│
├── scripts/
│   └── generate-search-index.ts     # 검색 인덱스 빌드 스크립트
│
├── .github/workflows/
│   └── deploy.yml                   # CI/CD 워크플로우
│
├── docs/                            # 프로젝트 문서
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

---

## 3. Next.js 설정

```typescript
// next.config.ts
{
  output: "export",            // 정적 HTML 생성 → /out 디렉토리
  trailingSlash: true,         // URL 끝에 / 추가 (GitHub Pages 호환)
  images: { unoptimized: true } // 이미지 최적화 비활성화 (정적 호스팅)
}
```

**핵심 결정:**
- `output: "export"` — 서버 없이 GitHub Pages에 직접 배포
- `unoptimized: true` — Next.js 이미지 최적화 API 없이 원본 이미지 직접 서빙
- `trailingSlash: true` — `/posts/slug/index.html` 형태로 빌드, 정적 호스팅 호환

---

## 4. 라우팅 구조

### 정적 라우트

| URL | 파일 | 설명 |
|-----|------|------|
| `/` | `app/page.tsx` | 히어로 + 최근 프로젝트 6개 + 최근 포스트 5개 |
| `/posts/` | `app/posts/page.tsx` | 카테고리별 그룹 포스트 목록 |
| `/projects/` | `app/projects/page.tsx` | 2컬럼 그리드 + 카테고리 필터 |
| `/tags/` | `app/tags/page.tsx` | 전체 태그 인덱스 (빈도순 정렬) |

### 동적 라우트 (빌드 시 생성)

| URL 패턴 | 파일 | 예시 |
|-----------|------|------|
| `/posts/[category]/[slug]/` | `app/posts/[...slug]/page.tsx` | `/posts/rust/ownership/` |
| `/projects/[slug]/` | `app/projects/[...slug]/page.tsx` | `/projects/castle-of-kafka/` |
| `/tags/[tag]/` | `app/tags/[tag]/page.tsx` | `/tags/typescript/` |

모든 동적 라우트는 `generateStaticParams()`로 빌드 시점에 경로를 생성합니다.

---

## 5. 콘텐츠 시스템

### 콘텐츠 로딩 (`src/lib/content.ts`)

Astro의 `getCollection()` 대체. 파일 시스템에서 마크다운을 직접 읽어 파싱합니다.

```
content/posts/**/*.md  →  getAllPosts()  →  Post[]
content/projects/*.md  →  getAllProjects()  →  Project[]
```

**주요 함수:**

| 함수 | 반환 | 설명 |
|------|------|------|
| `getAllPosts()` | `Post[]` | 전체 포스트 (캐시됨) |
| `getPublishedPosts()` | `Post[]` | `draft: true` 제외 |
| `getSortedPublishedPosts()` | `Post[]` | 날짜순 정렬 (최신 먼저) |
| `getPostBySlug(slug)` | `Post \| undefined` | 슬러그로 조회 |
| `getAllProjects()` | `Project[]` | 전체 프로젝트 (캐시됨) |
| `getSortedProjects()` | `Project[]` | weight → 날짜순 정렬 |
| `getProjectBySlug(slug)` | `Project \| undefined` | 슬러그로 조회 |

### 프론트매터 스키마

**Post:**
```yaml
title: "포스트 제목"
date: 2024-01-01
tags: [typescript, web]
categories: [web]
description: "설명"
draft: false           # true면 빌드에서 제외
aliases: []            # Obsidian alias
thumbnail: "/thumbs/x.jpg"
```

**Project:**
```yaml
title: "프로젝트명"
date: 2023-06-01
category: "Academic"
thumbnail: "/thumbs/a01.jpg"
description: "설명"
tags: [academic, graduation]
weight: 18              # 정렬 우선순위 (높을수록 위)
location: "서울"
role: "설계 담당"
```

### 카테고리 구조 (Posts)

```
content/posts/
├── bim/                    # Building Information Modeling
├── blog/                   # 일반 블로그
├── csharp/                 # C# 튜토리얼
├── deep-learning/          # 딥러닝
├── math/                   # 수학
├── python/                 # Python
├── reinforcement-learning/ # 강화학습
├── rust/                   # Rust
├── tools/                  # 개발 도구 (Unix, Git)
└── web/                    # 웹 개발 (TypeScript, REST)
```

카테고리는 디렉토리 이름에서 자동 추출됩니다 (`getPostCategory(slug)`).

---

## 6. 마크다운 렌더링 파이프라인

`src/lib/markdown.ts` — Unified 기반 처리 파이프라인:

```
Markdown Source
  ↓
[remarkParse]              # 마크다운 → MDast
  ↓
[remarkGfm]                # 테이블, 취소선, 자동링크
[remarkMath]               # $...$ 인라인, $$...$$ 블록 수식
[remarkObsidianWikilinks]  # [[page]], ![[image]] 처리
[remarkObsidianCallouts]   # > [!note], > [!tip] 등
[remarkObsidianHighlights] # ==하이라이트==, %%주석%%
  ↓
[remarkRehype]             # MDast → HAst 변환
  ↓
[rehypeRaw]                # 원시 HTML 허용
[rehypeKatex]              # 수식 → HTML (KaTeX)
[rehypePrettyCode]         # 코드 블록 구문 강조 (Shiki)
[rehypeSlug]               # 헤딩에 자동 ID 부여
[rehypeAutolinkHeadings]   # 헤딩 앵커 링크 래핑
[rehypeExtractHeadings]    # 목차용 헤딩 추출
  ↓
[rehypeStringify]          # HAst → HTML 문자열
  ↓
{ html: string, headings: Heading[] }
```

**코드 하이라이팅 테마:**
- Light: `vitesse-light`
- Dark: `one-dark-pro`

Shiki의 CSS 변수 모드로 다크/라이트 테마가 자동 전환됩니다.

---

## 7. 커스텀 Obsidian 플러그인

### remark-obsidian-wikilinks

| 문법 | 렌더링 | 용도 |
|------|--------|------|
| `[[page]]` | `<a href="/posts/page/">page</a>` | 포스트 간 링크 |
| `[[page\|별칭]]` | `<a href="/posts/page/">별칭</a>` | 커스텀 텍스트 링크 |
| `[[page#heading]]` | `<a href="/posts/page/#heading">` | 헤딩 앵커 링크 |
| `![[image.png]]` | `<img src="/_images/image.png">` | 이미지 임베드 |
| `![[video.mp4]]` | `<video controls>` | 비디오 임베드 |

### remark-obsidian-callouts

```markdown
> [!note] 제목
> 내용

> [!warning]
> 경고 내용

> [!tip-]           ← 접힌 상태로 시작
> 접을 수 있는 내용
```

지원 타입: `note`, `abstract`, `info`, `todo`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`

### remark-obsidian-highlights

| 문법 | 결과 |
|------|------|
| `==강조 텍스트==` | `<mark class="text-highlight">강조 텍스트</mark>` |
| `%%주석%%` | 완전 제거 (렌더링되지 않음) |

---

## 8. 컴포넌트 아키텍처

### 레이아웃 계층

```
RootLayout (app/layout.tsx)
├── <head>
│   ├── Google Fonts (Space Grotesk, Noto Sans KR, JetBrains Mono)
│   ├── KaTeX CSS (CDN)
│   └── 다크모드 초기화 스크립트 (FOUC 방지)
├── Header          ← 스티키 헤더 (블러 배경)
├── site-canvas
│   └── {children}  ← 페이지 컨텐츠
├── Footer
└── CodeBlockSetup  ← 코드 블록 복사 버튼 주입
```

### 3-Column 문서 레이아웃 (`DocLayout`)

```
┌─────────────────────────────────────────────┐
│ Header (sticky, blur backdrop)              │
├──────────┬──────────────────┬───────────────┤
│ Sidebar  │ Content          │ TableOfContents│
│ (240px)  │ (max 760px)      │ (240px)       │
│          │                  │               │
│ 카테고리  │ Breadcrumbs      │ 헤딩 네비게이터 │
│ 목록      │ 본문             │               │
│ (접기/펼기)│ (prose 스타일)    │               │
├──────────┴──────────────────┴───────────────┤
│ Footer                                      │
└─────────────────────────────────────────────┘
```

Posts, Projects 상세 페이지에서 사용됩니다.

### 전체 컴포넌트 목록

| 컴포넌트 | 렌더링 | 역할 |
|----------|--------|------|
| `Header` | Client | 스티키 헤더, 네비게이션, 검색 트리거, 다크모드 토글 |
| `Footer` | Server | 저작권, 푸터 링크 |
| `Hero` | Server | 홈페이지 히어로 섹션 |
| `DocLayout` | Server | 3-컬럼 레이아웃 래퍼 |
| `Sidebar` | Client | 좌측 카테고리 네비게이션 (접기/펼기) |
| `ProjectCard` | Server | 프로젝트 썸네일 카드 (3:2 비율) |
| `PostItem` | Server | 포스트 목록 아이템 (제목, 날짜, 설명) |
| `ProjectFilter` | Client | 프로젝트 카테고리 필터 버튼 |
| `SearchOverlay` | Client | `Cmd+K` 검색 모달 (클라이언트 사이드) |
| `DarkModeToggle` | Client | 라이트/다크 테마 토글 (localStorage 기반) |
| `TableOfContents` | Server | 우측 헤딩 네비게이터 |
| `Breadcrumbs` | Server | 네비게이션 브레드크럼 |
| `TagList` | Server | 인라인 태그 링크 목록 |
| `CodeBlockSetup` | Client | 코드 블록에 복사 버튼 동적 주입 (MutationObserver) |
| `SidebarToggleScript` | Client | 모바일 사이드바 토글 핸들러 |

---

## 9. 디자인 시스템

### 디자인 철학

**DCA(David Chipperfield Architects) 영감의 미니멀 갤러리 미학**

### 컬러 토큰

| 토큰 | Light | Dark |
|------|-------|------|
| `--bg` | `#ffffff` | `#111111` |
| `--bg-secondary` | `#fafafa` | `#181818` |
| `--surface` | `#f5f5f5` | `#1a1a1a` |
| `--text` | `#1a1a1a` | `#e0e0e0` |
| `--text-heading` | `#111111` | `#f5f5f5` |
| `--gray` | `#888888` | `#999999` |
| `--accent` | `#2c2c2c` | `#cccccc` |
| `--tertiary` | `#b85c3e` | `#d08f76` |
| `--line` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` |

### 타이포그래피

| 용도 | 폰트 | 비고 |
|------|------|------|
| 헤더 / UI | Space Grotesk | 기하학적 산세리프 |
| 본문 | Noto Sans KR | 한국어 지원 |
| 코드 | JetBrains Mono | 모노스페이스 |

### 스페이싱 스케일 (Base-8)

```
--space-1: 0.25rem (4px)
--space-2: 0.5rem  (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem    (16px)
--space-5: 1.5rem  (24px)
--space-6: 2rem    (32px)
--space-7: 3rem    (48px)
--space-8: 4rem    (64px)
--space-9: 6rem    (96px)
```

### 레이아웃 상수

```
--max-width:     1280px   # 사이트 전체 최대 너비
--content-width: 760px    # 본문 콘텐츠 너비
--sidebar-width: 240px    # 사이드바 너비
--toc-width:     240px    # 목차 너비
--header-height: 52px     # 헤더 높이
```

### CSS 파일 구성

| 파일 | 역할 |
|------|------|
| `global.css` | 리셋, 토큰, 헤더, 푸터, 버튼, 반응형 |
| `sidebar.css` | 사이드바, DocLayout, 모바일 오버레이 |
| `prose.css` | 마크다운 콘텐츠 타이포그래피 |
| `code.css` | 코드 블록, 언어 라벨, 복사 버튼, 라인 넘버 |
| `callouts.css` | Obsidian 콜아웃 스타일 (13종 타입) |

### 반응형 브레이크포인트

| 구간 | 레이아웃 |
|------|---------|
| **1180px+** | 데스크톱 네비게이션 표시 |
| **1024px+** | 3-컬럼 (사이드바 + 콘텐츠 + TOC) |
| **760px–1024px** | 사이드바 모달 오버레이, TOC 숨김 |
| **~700px** | 모바일 단일 컬럼, 모바일 네비 드로어 |

---

## 10. 검색 시스템

### 빌드 타임 인덱스 생성

```
npm run build
  → scripts/generate-search-index.ts
    → public/search-index.json
```

`SearchItem` 구조:
```typescript
{
  title: string;
  slug: string;        // URL 경로
  description: string;
  tags: string[];
  category: string;
}
```

### 클라이언트 사이드 검색

`SearchOverlay` 컴포넌트가 `Cmd+K` (또는 `Ctrl+K`)로 활성화됩니다.
- 빌드 시 생성된 JSON 인덱스를 fetch
- 제목, 설명, 태그, 카테고리에서 퍼지 검색
- 결과를 실시간으로 필터링하여 표시

---

## 11. 다크 모드

### 동작 방식

1. **초기화** (FOUC 방지): `<head>`에 인라인 스크립트로 `data-theme` 즉시 설정
2. **우선순위**: `localStorage("theme")` → `prefers-color-scheme` 시스템 설정
3. **토글**: `DarkModeToggle` 컴포넌트가 `data-theme` 속성과 `localStorage` 갱신
4. **스타일링**: CSS 커스텀 프로퍼티가 `[data-theme="dark"]` 선택자로 전환

```javascript
// layout.tsx <head> 인라인 스크립트
(function(){
  var s = localStorage.getItem("theme");
  var p = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", s || p);
})();
```

---

## 12. 이미지 전략

| 위치 | 방식 | 비율 처리 |
|------|------|----------|
| **ProjectCard (그리드)** | Next.js `Image` + `fill` | `aspect-ratio: 3/2` + `object-fit: cover` (크롭) |
| **프로젝트 히어로** | `<img>` 네이티브 | `max-width: 100%; height: auto` (원본 비율 유지) |
| **마크다운 내 이미지** | `<img>` (렌더링됨) | 글로벌 CSS `max-width: 100%; height: auto` |
| **Wikilink 이미지** | `![[file.png]]` → `<img>` | `/_images/` 디렉토리에서 서빙 |

`images: { unoptimized: true }` — 정적 호스팅이므로 Next.js 이미지 최적화 API 미사용.

---

## 13. 빌드 & 배포

### 빌드 프로세스

```bash
npm run build
# 1. tsx scripts/generate-search-index.ts  → public/search-index.json 생성
# 2. next build                            → /out 디렉토리에 정적 HTML 출력
```

### GitHub Actions 워크플로우

```
main 브랜치 push 또는 수동 트리거
  ↓
[build] ubuntu-latest, Node.js 22
  ├── npm ci
  ├── npm run build
  ├── actions/configure-pages
  └── actions/upload-pages-artifact (./out)
  ↓
[deploy]
  └── actions/deploy-pages → GitHub Pages
```

**배포 URL:** `https://1ncarnati0n.github.io`

### 정적 파일 호환

- `.nojekyll` — GitHub Pages의 Jekyll 처리 비활성화
- `robots.txt` — 검색엔진 크롤링 허용
- `trailingSlash: true` — `/posts/slug/index.html` 형태 (정적 서버 호환)

---

## 14. TypeScript 설정

```jsonc
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve"
  }
}
```

### 경로 별칭

| 별칭 | 경로 |
|------|------|
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@layouts/*` | `src/layouts/*` |
| `@lib/*` | `src/lib/*` |

---

## 15. 의존성 맵

### 프로덕션 의존성

```
next, react, react-dom          # 프레임워크 코어
├── unified                     # AST 프로세서
│   ├── remark-parse            # 마크다운 파서
│   ├── remark-gfm              # GitHub Flavored Markdown
│   ├── remark-math             # 수식 구문
│   └── remark-rehype           # Remark → Rehype 변환
│
├── rehype-raw                  # 원시 HTML 허용
├── rehype-katex                # KaTeX 수식 렌더링
├── rehype-pretty-code          # Shiki 코드 하이라이팅
│   └── shiki                   # VS Code 테마 엔진
├── rehype-slug                 # 헤딩 ID 자동 생성
├── rehype-autolink-headings    # 헤딩 앵커 링크
├── rehype-stringify            # HAst → HTML
│
├── gray-matter                 # YAML 프론트매터 파싱
├── github-slugger              # 슬러그 생성
├── reading-time                # 읽기 시간 추정
├── hast-util-to-string         # HAst 노드 → 텍스트
├── mdast-util-find-and-replace # AST 검색/치환
└── unist-util-visit            # AST 트리 순회
```

### 개발 의존성

```
typescript                      # 타입 시스템
@types/react, @types/react-dom  # React 타입 정의
@types/node                     # Node.js 타입 정의
eslint, eslint-config-next      # 린팅
tsx                             # 빌드 스크립트 실행 (TypeScript → Node.js)
```

---

## 16. 주요 아키텍처 결정

| 결정 | 이유 |
|------|------|
| **정적 Export** | 서버 없이 GitHub Pages 배포, 무료 호스팅 |
| **커스텀 콘텐츠 로더** | Astro에서 마이그레이션, fs 기반 직접 파싱으로 유연성 확보 |
| **Obsidian 플러그인** | Obsidian에서 작성한 노트를 변환 없이 바로 렌더링 |
| **Shiki 코드 하이라이팅** | VS Code 수준의 구문 강조, CSS 변수로 테마 자동 전환 |
| **KaTeX** | 수학/과학 콘텐츠의 수식 렌더링 |
| **클라이언트 사이드 검색** | 서버 없이 JSON 인덱스 기반 즉시 검색 |
| **3-Column 레이아웃** | 문서 사이트 UX (네비게이션 + 콘텐츠 + 목차) |
| **CSS 커스텀 프로퍼티** | 다크모드 전환, 디자인 토큰 일관성 |
| **Trailing Slash** | 정적 호스팅 호환, SEO 일관성 |
| **ESM (`type: module`)** | 최신 모듈 시스템, tree-shaking 최적화 |
