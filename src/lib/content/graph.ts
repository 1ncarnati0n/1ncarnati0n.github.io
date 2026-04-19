import { getAllBlogPosts } from './posts'
import { normalizeBlogReference } from './blog-slug'

export type GraphNode = {
  id: string
  title: string
  slug: string
  linkCount: number
}

export type GraphLink = {
  source: string
  target: string
}

export type GraphData = {
  nodes: GraphNode[]
  links: GraphLink[]
}

const WIKILINK_PATTERN = /\[\[([^[\]|]+)(?:\|[^\]]+)?\]\]/g

/** 모든 블로그 포스트에서 위키링크 관계를 추출하여 그래프 데이터 생성 */
export async function getBlogGraphData(): Promise<GraphData> {
  const posts = await getAllBlogPosts()

  // slug → post 매핑
  const slugMap = new Map<string, { title: string; slug: string }>()
  // reference → slug 매핑 (위키링크 해석용)
  const refMap = new Map<string, string>()

  for (const post of posts) {
    slugMap.set(post.slug, { title: post.title, slug: post.slug })
    refMap.set(normalizeBlogReference(post.sourceFileName), post.slug)
    refMap.set(normalizeBlogReference(post.title), post.slug)
  }

  // 각 포스트의 콘텐츠에서 위키링크 추출
  const links: GraphLink[] = []
  const linkCounts = new Map<string, number>()

  for (const post of posts) {
    linkCounts.set(post.slug, 0)

    let match
    WIKILINK_PATTERN.lastIndex = 0

    while ((match = WIKILINK_PATTERN.exec(post.content)) !== null) {
      const ref = normalizeBlogReference(match[1].trim())
      const targetSlug = refMap.get(ref)

      if (targetSlug && targetSlug !== post.slug) {
        links.push({ source: post.slug, target: targetSlug })
        linkCounts.set(post.slug, (linkCounts.get(post.slug) ?? 0) + 1)
        linkCounts.set(targetSlug, (linkCounts.get(targetSlug) ?? 0) + 1)
      }
    }
  }

  // 중복 링크 제거
  const uniqueLinks = Array.from(
    new Map(
      links.map((l) => {
        const key = [l.source, l.target].sort().join('::')
        return [key, l]
      }),
    ).values(),
  )

  const nodes: GraphNode[] = posts.map((post) => ({
    id: post.slug,
    title: post.title,
    slug: post.slug,
    linkCount: linkCounts.get(post.slug) ?? 0,
  }))

  return { nodes, links: uniqueLinks }
}
