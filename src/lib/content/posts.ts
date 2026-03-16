// ════════════════════════════════════════
// 블로그 콘텐츠 로더
// 마크다운 파일을 읽고 → frontmatter 파싱 → BlogPost 객체로 변환
// ════════════════════════════════════════
//
// 📝 TS 복습 포인트:
//   - fs/promises: Node.js 파일 시스템 (비동기)
//   - as (타입 단언): gray-matter가 any를 반환하므로 우리가 타입을 지정
//   - try/catch: 파일이 없을 때 에러 처리
//   - Promise<T>: 비동기 함수의 반환 타입

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost, BlogFrontmatter } from '@/types/content'

// process.cwd() = 프로젝트 루트 경로
// path.join()으로 OS에 맞는 경로 구분자(/, \)를 자동 처리
const BLOG_DIR = path.join(process.cwd(), 'src', 'contents', 'blog')

// ── 모든 블로그 글 가져오기 ──────────────────────────
// Server Component에서 await getAllBlogPosts()로 호출
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // 1. 디렉터리 내 파일 목록 읽기
  let entries: string[]
  try {
    entries = await fs.readdir(BLOG_DIR)
    // readdir: 해당 폴더의 파일/폴더 이름 목록을 문자열 배열로 반환
    // 예: ['hello-world.md', 'Rust', 'Web', ...]
  } catch {
    // 폴더가 없으면 빈 배열 반환 (에러로 죽지 않게)
    return []
  }

  const posts: BlogPost[] = []

  for (const entry of entries) {
    // .md 또는 .mdx 파일만 처리 (카테고리 폴더는 건너뜀)
    if (!entry.endsWith('.md') && !entry.endsWith('.mdx')) continue

    // 2. 파일 읽기
    const filePath = path.join(BLOG_DIR, entry)
    const raw = await fs.readFile(filePath, 'utf-8')
    // raw = 파일 전체 텍스트 (frontmatter + 본문)

    // 3. gray-matter로 frontmatter와 본문 분리
    // ---
    // title: "Hello"
    // tags: ["test"]
    // ---
    // # 본문 시작...
    //
    // → data = { title: "Hello", tags: ["test"] }
    // → content = "# 본문 시작..."
    const { data, content } = matter(raw)

    // 4. 타입 단언 (as)
    // gray-matter의 data는 타입이 { [key: string]: any }
    // 우리가 정의한 BlogFrontmatter 타입으로 "이 형태임을 보장한다"고 알려줌
    const fm = data as BlogFrontmatter

    // frontmatter가 없는 파일은 건너뜀 (기존 카테고리 폴더의 파일 대비)
    if (!fm.title || !fm.date) continue

    // draft 글은 목록에서 제외
    if (fm.draft) continue

    // 5. 파일명에서 slug 추출
    // 'hello-world.md' → 'hello-world'
    const slug = entry.replace(/\.mdx?$/, '')

    // 6. BlogPost 객체 생성
    posts.push({
      type: 'blog',
      slug,
      title: fm.title,
      description: fm.description || '',
      date: new Date(fm.date),
      // ↑ 문자열 "2026-03-16" → Date 객체로 변환
      tags: fm.tags || [],
      draft: fm.draft || false,
      series: fm.series,
      cover: fm.cover,
      updated: fm.updated ? new Date(fm.updated) : undefined,
      readingTime: Math.ceil(content.split(/\s+/).length / 200),
      // ↑ 단어 수 / 200 = 분 단위 읽기 시간 (올림)
      content,
      // ↑ raw 마크다운 텍스트. 렌더링은 페이지에서 별도 처리
    })
  }

  // 7. 날짜 내림차순 정렬 (최신 글이 먼저)
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime())
}

// ── 특정 slug의 글 하나 가져오기 ─────────────────────
// blog/[slug]/page.tsx에서 사용
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // .md와 .mdx 두 확장자 모두 시도
  for (const ext of ['.md', '.mdx']) {
    try {
      const filePath = path.join(BLOG_DIR, `${slug}${ext}`)
      const raw = await fs.readFile(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const fm = data as BlogFrontmatter

      // frontmatter 없는 파일이면 null
      if (!fm.title || !fm.date) return null

      return {
        type: 'blog',
        slug,
        title: fm.title,
        description: fm.description || '',
        date: new Date(fm.date),
        tags: fm.tags || [],
        draft: fm.draft || false,
        series: fm.series,
        cover: fm.cover,
        updated: fm.updated ? new Date(fm.updated) : undefined,
        readingTime: Math.ceil(content.split(/\s+/).length / 200),
        content,
      }
    } catch {
      // 파일 없으면 다음 확장자 시도
      continue
    }
  }

  // 둘 다 없으면 null
  return null
}
