# Markdown Authoring Guide

## Frontmatter

```md
---
title: ""
description: ""
slug: ""
date: "2026-07-05"
updated: "2026-07-05"
tags: []
category: ""
series: ""
aliases: []
draft: true
cover: ""
cssclasses: []
---
```

필수:

- `slug`: public URL. 발행 후 변경 금지.
- `draft`: 공개 전 `true`, 공개 시 `false`.

권장:

- `title`: 목록, 상세, RSS, Open Graph에 사용.
- `description`: 목록, SEO, RSS에 사용.
- `date`: 최초 작성일.
- `tags`: `/tags/` 탐색과 search weight에 사용.

## Slug

좋음:

```txt
sveltekit-obsidian-blog
local-llm-workflow
ifc-viewer-architecture
```

피함:

```txt
SvelteKit Obsidian Blog
sveltekit_obsidian_blog
blog/slug
```

## Images

파일:

```txt
static/images/blog/{slug}/cover.png
static/images/blog/{slug}/architecture.png
```

Markdown:

```md
![Architecture](/images/blog/{slug}/architecture.png)
```

Obsidian embed:

```md
![[images/blog/{slug}/architecture.png]]
![[images/blog/{slug}/architecture.png|640]]
```

## Obsidian Syntax

지원:

- `[[Wiki Link]]`
- `[[Wiki Link|Label]]`
- `[[Note#Heading]]`
- `![[Embed]]`
- `> [!note] Callout`
- `==highlight==`

미해결 wiki link는 dashed text로 표시된다.

## Safety Checklist

- 회사 내부 정보 없음
- 개인정보 없음
- 공개 가능한 image만 사용
- code sample 실행 가능
- `pnpm build` warning 확인
