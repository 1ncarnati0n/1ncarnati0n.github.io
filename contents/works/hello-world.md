---
title: "Hello World — 콘텐츠 파이프라인 테스트"
description: "gray-matter + unified 파이프라인이 정상 동작하는지 확인하는 첫 번째 글"
date: "2026-03-16"
tags: ["next.js", "test"]
draft: false
---

# Hello World

콘텐츠 파이프라인이 동작하는지 확인하는 테스트 글입니다.

## 코드 하이라이팅 테스트

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`
}

console.log(greet('World'))
```

## 마크다운 기능 테스트

- **볼드** 텍스트
- *이탤릭* 텍스트
- `인라인 코드`

> 인용문 테스트입니다.

### GFM 테이블

| 기능 | 상태 |
|------|------|
| frontmatter 파싱 | ✅ |
| 코드 하이라이팅 | ✅ |
| GFM 확장 | ✅ |

일반 문단 텍스트입니다. 읽기 시간 계산과 slug 생성이 잘 되는지 확인합니다.
이 글의 slug는 파일명 `hello-world`에서 자동으로 추출됩니다.
