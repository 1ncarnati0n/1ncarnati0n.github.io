# ROADMAP — 디지털 가든 계획서 대비 현황

`personal_digital_garden_implementation_plan.md`(v1.0, 2026-11-05)를 **요구사항 체크리스트**로 사용한다.
이 저장소에 이미 구현된 것이 많으므로 계획서의 이름 대신 저장소의 기존 이름을 유지한다.

| 계획서 | 이 저장소 (유지) | 이유 |
|---|---|---|
| `content/` | `contents/` | 기존 경로 |
| `build/` | `out/` | `svelte.config.js` adapter 설정 |
| npm | pnpm | 계획서 §15에서 변경 허용 |
| `pages.yml` | `deploy.yml` | 기존 워크플로 |
| `/projects/` | `/works/` | 공개 URL 유지 원칙(§6.6) |

상태: ✅ 완료 · 🟡 일부 · ⬜ 없음 · ❓ 사용자 결정 필요

## 결정 사항 (2026-11-05)

- 게시 방식: **`draft: true` 제외 방식 유지**. 대신 `out/`에 draft 글이 섞이지 않았는지 검사하는 CI 단계를 추가한다 (ADR-002 대체).
- Supabase: **보류**. `contents/works` 마크다운을 계속 사용한다.
- `/garden` 분리: **보류**. `/blog` 하나로 운영한다.
- 편집 도구: **블로그는 Obsidian에서 작성**해 `contents/blog/`로 올린다. **포트폴리오(works)는 로컬 편집기 `/admin/works/`**로 글과 이미지를 넣는다 (Supabase Dashboard 대신).

## Phase 0. 기반 — ✅

| 항목 | 상태 | 근거 |
|---|---|---|
| SvelteKit 5 + TS + Tailwind 4 | ✅ | `package.json` |
| adapter-static + Pages + Actions | ✅ | `svelte.config.js`, `.github/workflows/deploy.yml` |
| prerender / trailingSlash | ✅ | `src/routes/+layout.ts` |
| 404, favicon, 다크 모드, `.nojekyll` | ✅ | `+error.svelte`, `static/`, `DarkModeToggle.svelte` |
| CI 게이트 (check / lint / test / check:out) | ✅ | `deploy.yml` (2026-11-05 추가, main 반영 전) |

## Phase 1. 포트폴리오·블로그 MVP — 🟡

| 항목 | 상태 | 근거 / 다음 작업 |
|---|---|---|
| 블로그 목록/상세, 태그, 시리즈 | ✅ | `src/routes/blog`, `tags`, `series` |
| 마크다운 렌더, Shiki, KaTeX, TOC | ✅ | `src/lib/content/mdx.ts` |
| RSS, sitemap, robots | ✅ | `feed.xml`, `sitemap.xml`, `robots.txt` 라우트 |
| 홈/소개/작업 페이지 | 🟡 | `about/+page.svelte`는 8줄짜리 껍데기 → 소개 내용 작성 |
| 태그 실데이터 | ⬜ | 55개 글 모두 `tags` 비어 있음 → `/tags/` 빈 화면 |
| description 실데이터 | 🟡 | 본문 앞 180자 자동 추출 중 |
| `01 Vector` 날짜 | ⬜ | `contents/blog/Math/Linear Algebra/01 Vector.md` 볼트 원본 없음 → 사용자가 날짜 제공 |
| canonical/OG 메타 점검 | ⬜ | JS 끈 상태에서 HTML 확인 |

## Phase 2. Obsidian 게시 자동화 — ⬜ (가장 중요한 공백)

| 항목 | 상태 | 주의 |
|---|---|---|
| 볼트 → `contents/` 복사 스크립트 | ⬜ ❓ | 그냥 복사하면 저장소에만 있는 `slug`/`date`가 덮어써지고, `<br>` 뒤 빈 줄 수정 2곳(`Python/1. About Python.md`, `Python/OOP Polymorphism.md`)이 사라짐. **frontmatter 병합 + NFC 경로 정규화** 필수. 볼트는 읽기 전용 |
| `publish: true` 허용 목록 (ADR-002) | 보류 | draft 방식 유지로 결정. 현재는 `draft: true` 제외 방식(`frontmatter.ts:134`). `publish:` 가진 파일 0개 → 그대로 전환하면 **글 55개가 전부 내려감** |
| slug 중복 검사 | ✅ | `posts.ts` `addPostToIndex` |
| alias 충돌 | 🟡 | `references.ts`에서 모호하면 `null` 처리, 빌드 실패는 아님 |
| 미해결 wikilink 빌드 실패 | ✅ | 렌더된 HTML에 `obsidian-(wikilink\|embed)-unresolved`가 있으면 `scripts/check-out.mjs`가 실패. 렌더 단계 기준이라 코드 블록·외부 링크 문법은 자동 제외 (2026-11-05 기준 0건) |
| dry-run / 게시 로그 | ⬜ | 복사 스크립트와 함께 |

## Phase 3. 디지털 가든 — 🟡

| 항목 | 상태 | 근거 / 다음 작업 |
|---|---|---|
| Wikilink(기본/별칭/헤딩), 이미지·노트 임베드, Callout, 하이라이트 | ✅ | `obsidian.ts` + `obsidian.test.ts` |
| Backlinks | ✅ | `graph.ts:72`, `RightPanel.svelte` |
| 로컬 그래프 | ✅ | `forceX/forceY`(0.3) 추가 — `/blog/` 198px 프레임 안 노드 2→55/55 (브라우저 측정) |
| 실제 글 사이 링크 | ⬜ | 글 사이 wikilink 0개 → 그래프에 연결선 없음. 내용 작업 |
| Explorer 트리 | ✅ | `tree.ts`, `BlogSideMenu.svelte` |
| 검색 (FlexSearch) | 🟡 | `search/+page.svelte:46` `tokenize: 'forward'`는 한국어 부분 검색에 약함 → 2~3자 n-gram 또는 `full` 평가(§7.3) |
| `Cmd/Ctrl+K` 검색 모달 | ⬜ | 지금은 `/search/` 페이지 |
| `/garden` 분리 | 보류 | frontmatter에 `type` 없음 |
| Mermaid | ⬜ | 2단계 |
| 검색 본문의 코드펜스 정규식 오차 | 🟡 | `basic-data-types`, `built-in-objects` 검색 텍스트 약간 틀림(무해) |

## Phase 4. 포트폴리오 편집기 — ✅ (Supabase 대체)

`contents/works/*.md` + `static/images/works/<slug>/`가 원본이다. Supabase는 보류(갤러리가 커서 저장소 용량이
문제가 되면 재검토; 그때 계획서 §8 SQL을 `supabase/migrations/`로).

| 항목 | 상태 | 근거 |
|---|---|---|
| 로컬 편집기 `/admin/works/` (목록·새 작업·수정) | ✅ | `src/routes/admin/works/+page.svelte` |
| frontmatter 필드 폼 + Markdown 본문 | ✅ | 제목/설명/날짜/상태/역할/분류/도구/위치/규모/클라이언트/draft |
| 대표 이미지·갤러리(순서 변경)·본문 커서 위치 이미지 삽입 | ✅ | 같은 파일 |
| 업로드 시 브라우저에서 WebP 변환 + 최대 폭 1920px (GIF 제외) | ✅ | `toWebp()` |
| 파일 저장 API (PUT 작업, POST 이미지) | ✅ | `src/routes/admin/works/api/+server.ts`, `src/lib/server/works-editor.ts` |
| 안전장치: slug 정규화 검사, 파일명 정리, png/jpg/webp/gif만(svg 제외), 5MB, 같은 이름 덮어쓰기 금지 | ✅ | `works-editor.test.ts` |
| 정적 빌드 제외 (`prerender = false` + `dev` 아니면 404) | ✅ | `out/admin` 없음 확인 |
| `/works/` 카드에 대표 이미지, 상세에 대표 이미지·갤러리 표시 | ✅ | `src/routes/works/**` |
| 저장 후 dev 서버 재시작 없이 반영 | ✅ | `resetWorksCache()` |

**한계 (의도적):** 인증이 없다. `pnpm dev`를 localhost에서 돌릴 때만 쓰고 `--host`로 외부에 열지 않는다.
배포는 저장 후 직접 commit/push. 삭제 기능은 없음 — 파일을 지우면 된다.

## Phase 5. 품질·보안 — 🟡

| 항목 | 상태 | 주의 |
|---|---|---|
| 단위 테스트 | 🟡 | vitest 21개 (`src/lib/**/*.test.ts`) |
| HTML sanitize | ⬜ | `rehype-raw` 사용 중. 글이 `<p align>`, `<img width>`, `<br>`에 의존하므로 기본 스키마는 이걸 지움 → 사용자 정의 스키마 + 브라우저 확인을 별도 작업으로 |
| 산출물 스캔 (draft 글 제목이 `out/`에 없는지) | ✅ | `pnpm check:out` (CI build 다음 단계). 비밀 키 패턴 검사는 아직 없음 |
| Playwright E2E | ⬜ | 지금은 수동 레시피만 있음(vite build + http.server + Python Playwright) |
| Lighthouse / 접근성 | ⬜ | |
| 산출물 크기 확인 (1GB 한도) | ⬜ | |

## Phase 6. 확장 — ⬜

링크 미리보기 팝오버, 블록 참조, Canvas, 다국어 등. 필요해질 때 진행.

## 다음 순서 (권장)

1. ~~그래프 `forceX/forceY`~~ ✅
2. ~~미해결 wikilink 빌드 실패 게이트~~ ✅
3. ~~`out/` 산출물 스캔~~ ✅
4. ~~포트폴리오 편집기~~ ✅
5. 한국어 검색 tokenize 평가
6. 볼트 → `contents/` 병합 복사 스크립트 (dry-run 먼저)
7. sanitize 스키마
8. 태그/description/소개 페이지 내용 작업, 첫 works 작성 (사용자)
