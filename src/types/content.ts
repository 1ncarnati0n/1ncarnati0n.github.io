// ════════════════════════════════════════
// Frontmatter 스키마 (마크다운 파일의 --- 사이 메타데이터)
// ════════════════════════════════════════

/** 블로그 포스트 frontmatter */
export interface BlogFrontmatter {
  title: string
  description: string
  date: string        // "2026-03-01" 같은 ISO 날짜 문자열
  updated?: string    // 수정일 (선택)
  tags: string[]
  draft?: boolean     // true면 목록에서 숨김
  cover?: string      // 커버 이미지 경로
  series?: string     // 시리즈 이름 (선택)
}

/** Works(건축 및 기술 포트폴리오) frontmatter */
export interface WorksFrontmatter {
  title: string
  description: string
  date: string
  role: string            // "설계 담당" / "PM" 등
  location?: string       // "서울 강남구"
  status: 'completed' | 'in-progress' | 'concept'
  tools: string[]         // ["Revit", "Rhino", "Grasshopper"]
  cover: string
  gallery?: string[]      // 이미지 경로 배열
  category: string        // "residential" / "commercial" 등
  area?: string           // "연면적 2,500㎡"
  client?: string
}

// ════════════════════════════════════════
// 파싱된 콘텐츠 객체 (frontmatter + 본문 합친 최종 형태)
// ════════════════════════════════════════

/** 공통 필드 — 블로그와 Works 모두 가지는 것 */
interface BaseContent {
  slug: string                // URL용 식별자 (파일명에서 추출)
  title: string
  description: string
  date: Date                  // 문자열이 아닌 Date 객체로 변환
  cover?: string
  readingTime: number         // 분 단위
  content: string             // raw 마크다운 소스
}

/** 블로그 포스트 */
export interface BlogPost extends BaseContent {
  type: 'blog'                // 어떤 콘텐츠인지 구분하는 태그
  tags: string[]
  draft: boolean
  series?: string
  updated?: Date
}

/** Works 프로젝트 */
export interface WorksProject extends BaseContent {
  type: 'works'
  role: string
  location?: string
  status: 'completed' | 'in-progress' | 'concept'
  tools: string[]
  gallery: string[]
  category: string
  area?: string
  client?: string
}

/** 유니온 타입 — 두 타입을 하나로 묶어 공통 처리 가능 */
export type AnyContent = BlogPost | WorksProject

// ════════════════════════════════════════
// UI / 유틸리티 타입
// ════════════════════════════════════════

/** 마크다운 제목 (목차 TOC용) */
export interface Heading {
  level: 1 | 2 | 3 | 4 | 5 | 6
  text: string
  slug: string                // #anchor-link용
}

/** 검색 인덱스 항목 */
export interface SearchItem {
  id: string
  type: 'blog' | 'works'
  title: string
  slug: string
  tags: string[]              // blog는 tags, works는 tools
  content: string             // 플레인텍스트
  description: string
}
