# 1ncarnati0n.github.io

SvelteKit + Obsidian Markdown 기반 기술 블로그.

## Workflow

```txt
Obsidian -> contents/blog/**/*.md -> GitHub Actions -> SvelteKit static build -> GitHub Pages
```

## Commands

```bash
pnpm install
pnpm dev
pnpm check
pnpm lint
pnpm test:run
pnpm build
pnpm check:out   # build 결과에 미해결 wikilink·draft 글이 없는지 검사
```

## 포트폴리오 편집 (Works)

블로그는 Obsidian에서 쓰고, 포트폴리오는 로컬 편집기로 쓴다.

1. `pnpm dev` 실행 후 <http://localhost:5173/admin/works/> 접속
2. 새 작업 또는 기존 작업 선택 → 내용 입력, 대표 이미지·갤러리·본문 이미지 업로드 (자동 WebP 변환, 최대 1920px)
3. 저장 → `contents/works/<slug>.md`, `static/images/works/<slug>/`에 파일 생성
4. 확인 후 commit/push → GitHub Pages 배포

편집기는 인증이 없으므로 localhost 전용이다. `vite dev --host`로 열지 말 것. 정적 빌드에는 포함되지 않는다.

로컬 `pnpm`이 dependency 재설치를 요구하면 현재 repo에서는 직접 실행도 가능하다.

```bash
./node_modules/.bin/vitest run
./node_modules/.bin/svelte-kit sync
./node_modules/.bin/svelte-check --tsconfig ./tsconfig.json
./node_modules/.bin/eslint .
./node_modules/.bin/vite build
```

## Markdown Rules

공개 글은 `contents/blog/**/*.md`에 둔다. `draft: true` 글은 build 대상에서 제외된다.

```md
---
title: "Post title"
description: "120-180자 정도의 목록/SEO 요약"
slug: "post-title"
date: "2026-07-05"
updated: "2026-07-05"
tags:
  - sveltekit
category: "Software Engineering"
series: ""
aliases: []
draft: true
cover: ""
cssclasses: []
---
```

Slug 규칙:

- 영문 소문자, 숫자, hyphen만 사용
- `/`, space, underscore 사용 금지
- 발행 후 변경 금지

이미지 규칙:

```txt
static/images/blog/{slug}/cover.png
static/images/blog/{slug}/diagram.png
```

Markdown:

```md
![Architecture](/images/blog/post-title/diagram.png)
![[images/blog/post-title/diagram.png]]
```

상세 규칙: [docs/markdown-authoring-guide.md](docs/markdown-authoring-guide.md)
