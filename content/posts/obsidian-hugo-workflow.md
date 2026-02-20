---
title: "Obsidian + Hugo 워크플로우"
date: 2024-01-20
description: "Obsidian으로 글을 쓰고 Hugo로 배포하는 방법"
tags: ["obsidian", "hugo", "workflow"]
categories: ["개발"]
draft: false
---

## Obsidian에서 블로그 글 작성하기

이 사이트는 **Obsidian**에서 마크다운으로 글을 작성하고, **Hugo**로 빌드하여 **GitHub Pages**에 배포하는 구조입니다.

### 워크플로우

1. Obsidian에서 `content/posts/` 폴더에 새 노트 생성
2. YAML frontmatter 작성 (템플릿 활용)
3. 마크다운으로 글 작성
4. Git으로 커밋 & 푸시
5. GitHub Actions가 자동으로 Hugo 빌드 & 배포

### Frontmatter 템플릿

Obsidian의 **Templater** 플러그인으로 다음 템플릿을 사용하세요:

```yaml
---
title: ""
date: {{date}}
description: ""
tags: []
categories: []
draft: false
---
```

### Callout 예시

> [!note] 참고
> Obsidian의 callout 문법도 지원됩니다.

> [!tip] 팁
> `content/posts/` 폴더에 마크다운 파일을 넣으면 자동으로 블로그 글이 됩니다.

### 테이블 예시

| 기능 | 지원 여부 |
|------|-----------|
| 마크다운 | O |
| 코드 블록 | O |
| 수식 | O |
| 이미지 | O |
| 테이블 | O |
| Callout | O |

이 워크플로우로 편리하게 블로그를 운영할 수 있습니다.
