// ════════════════════════════════════════
// 마크다운 → HTML 렌더링 파이프라인
// unified 생태계의 플러그인 체인으로 변환
// ════════════════════════════════════════
//
// 📝 학습 포인트:
//   - unified: 텍스트 변환 프레임워크 (https://unifiedjs.com/)
//   - remark 계열: 마크다운 처리
//   - rehype 계열: HTML 처리
//   - .use() 체인: 각 플러그인이 AST를 순서대로 변환

import { unified } from 'unified'
import remarkParse from 'remark-parse'       // 마크다운 텍스트 → MDAST (마크다운 AST)
import remarkGfm from 'remark-gfm'           // GFM 확장 (테이블, 체크박스, 취소선)
import remarkMath from 'remark-math'         // $..$ / $$...$$ 수식 구문 파싱
import remarkRehype from 'remark-rehype'     // MDAST → HAST (HTML AST)로 변환
import rehypeKatex from 'rehype-katex'       // 수식 AST → KaTeX HTML 렌더링
import rehypeRaw from 'rehype-raw'           // 마크다운 내 raw HTML을 AST에 포함
import rehypeSlug from 'rehype-slug'         // <h2>제목</h2> → <h2 id="제목">제목</h2>
import rehypeAutolinkHeadings from 'rehype-autolink-headings'  // 제목에 앵커 링크 추가
import rehypePrettyCode from 'rehype-pretty-code'  // shiki 기반 코드 하이라이팅
import rehypeStringify from 'rehype-stringify'     // HAST → HTML 문자열
import { visit } from 'unist-util-visit'     // AST 노드를 순회
import type { Heading } from '$lib/types/content'
import {
  remarkObsidian,
  type ObsidianRenderOptions,
} from './obsidian'

type HastNode = {
  type: string
  value?: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

// 수식은 MathML + 화면용 HTML 두 벌로 렌더되므로 화면용(katex-html)만 제목 텍스트로 쓴다
function headingText(node: HastNode): string {
  if (node.type === 'text') return node.value ?? ''

  const classNames = node.properties?.className
  if (Array.isArray(classNames) && classNames.includes('katex-mathml')) return ''

  return (node.children ?? []).map(headingText).join('')
}

// 목차는 렌더된 결과(rehype-slug가 붙인 id)에서 뽑는다. 마크다운 소스를 정규식으로 다시 훑으면
// 렌더러와 어긋나 목차가 틀리거나 slug가 중복되고, 중복 key 하나로 Svelte가 페이지 전체를 지운다.
// (예: `<br>` 바로 아래 `### 제목`은 raw HTML 블록에 먹혀 제목이 아닌데 정규식은 제목으로 센다)
function rehypeCollectHeadings(headings: Heading[]) {
  return (tree: HastNode) => {
    visit(tree, 'element', (node: HastNode) => {
      const level = /^h([2-4])$/.exec(node.tagName ?? '')?.[1]
      const slug = node.properties?.id
      if (!level || typeof slug !== 'string' || !slug) return

      headings.push({
        level: Number(level) as Heading['level'],
        text: headingText(node).replace(/\s+/g, ' ').trim(),
        slug,
      })
    })
  }
}

export type RenderedMarkdown = { html: string; headings: Heading[] }

// async 함수는 항상 Promise를 반환
// 마크다운 문자열을 받아서 HTML 문자열과 목차용 제목(h2~h4) 목록을 반환
export async function renderMarkdownWithHeadings(
  source: string,
  options: ObsidianRenderOptions = {},
): Promise<RenderedMarkdown> {
  const headings: Heading[] = []
  const result = await unified()
    // ── remark 단계: 마크다운 처리 ──
    .use(remarkParse)             // 1. 마크다운 텍스트를 AST로 파싱
    .use(remarkGfm)               // 2. GFM 확장 문법 지원
    .use(remarkMath)              // 3. $..$ / $$...$$ 수식 구문 파싱
    .use(remarkObsidian, options) // 4. Obsidian 문법 확장 처리
    // ── remark → rehype 전환 ──
    .use(remarkRehype, {
      allowDangerousHtml: true,   // 마크다운에 직접 쓴 HTML 태그 허용
    })
    // ── rehype 단계: HTML 처리 ──
    .use(rehypeKatex, { strict: false }) // 5. 수식 AST → KaTeX HTML 렌더링
    .use(rehypeRaw)               // 6. raw HTML 문자열을 AST 노드로 변환
    .use(rehypeSlug)              // 5. 제목 태그에 id 속성 추가 (TOC용)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',           // 제목 텍스트 전체를 <a>로 감쌈
    })
    .use(rehypeCollectHeadings, headings) // 렌더된 h2~h4를 목차용으로 수집
    .use(rehypePrettyCode, {
      theme: {
        dark: 'one-dark-pro',
        light: 'one-light',
      }
      // shiki 테마 (코드 블록 색상)
      // 다른 테마 옵션: 'one-dark-pro', 'vitesse-dark', 'nord' 등
      // 전체 목록: https://shiki.style/themes
    })
    .use(rehypeStringify)         // 6. 최종 AST → HTML 문자열로 출력
    .process(source)
  // .process()가 반환하는 VFile 객체에서 문자열 추출

  return { html: String(result), headings }
}

// HTML만 필요한 곳(works, 테스트)용
export async function renderMarkdown(
  source: string,
  options: ObsidianRenderOptions = {},
): Promise<string> {
  return (await renderMarkdownWithHeadings(source, options)).html
}
