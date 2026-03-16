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
import remarkRehype from 'remark-rehype'     // MDAST → HAST (HTML AST)로 변환
import rehypeRaw from 'rehype-raw'           // 마크다운 내 raw HTML을 AST에 포함
import rehypeSlug from 'rehype-slug'         // <h2>제목</h2> → <h2 id="제목">제목</h2>
import rehypeAutolinkHeadings from 'rehype-autolink-headings'  // 제목에 앵커 링크 추가
import rehypePrettyCode from 'rehype-pretty-code'  // shiki 기반 코드 하이라이팅
import rehypeStringify from 'rehype-stringify'     // HAST → HTML 문자열

// async 함수는 항상 Promise를 반환
// 마크다운 문자열을 받아서 HTML 문자열을 반환
export async function renderMarkdown(source: string): Promise<string> {
  const result = await unified()
    // ── remark 단계: 마크다운 처리 ──
    .use(remarkParse)             // 1. 마크다운 텍스트를 AST로 파싱
    .use(remarkGfm)               // 2. GFM 확장 문법 지원
    // ── remark → rehype 전환 ──
    .use(remarkRehype, {
      allowDangerousHtml: true,   // 마크다운에 직접 쓴 HTML 태그 허용
    })
    // ── rehype 단계: HTML 처리 ──
    .use(rehypeRaw)               // 3. raw HTML 문자열을 AST 노드로 변환
    .use(rehypeSlug)              // 4. 제목 태그에 id 속성 추가 (TOC용)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',           // 제목 텍스트 전체를 <a>로 감쌈
    })
    .use(rehypePrettyCode, {
      theme: 'github-dark-dimmed', // shiki 테마 (코드 블록 색상)
      // 다른 테마 옵션: 'one-dark-pro', 'vitesse-dark', 'nord' 등
      // 전체 목록: https://shiki.style/themes
    })
    .use(rehypeStringify)         // 5. 최종 AST → HTML 문자열로 출력
    .process(source)
    // .process()가 반환하는 VFile 객체에서 문자열 추출

  return String(result)
}
