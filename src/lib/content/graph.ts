import { getAllBlogPosts, getBlogPostBySlug, getBlogReferenceLookup } from './posts'
import { resolveLinkedSlugs } from './references'

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

export type Backlink = {
  slug: string
  title: string
  description: string
}

async function getGraphLinks() {
  const [posts, references] = await Promise.all([getAllBlogPosts(), getBlogReferenceLookup()])
  const links: GraphLink[] = []
  const linkCounts = new Map(posts.map((post) => [post.slug, 0]))

  for (const post of posts) {
    for (const targetSlug of resolveLinkedSlugs(post, references)) {
      const key = `${post.slug}::${targetSlug}`
      if (links.some((link) => `${link.source}::${link.target}` === key)) continue

      links.push({ source: post.slug, target: targetSlug })
      linkCounts.set(post.slug, (linkCounts.get(post.slug) ?? 0) + 1)
      linkCounts.set(targetSlug, (linkCounts.get(targetSlug) ?? 0) + 1)
    }
  }

  return { posts, links, linkCounts }
}

export async function getBlogGraphData(): Promise<GraphData> {
  const { posts, links, linkCounts } = await getGraphLinks()

  return {
    nodes: posts.map((post) => ({
      id: post.slug,
      title: post.title,
      slug: post.slug,
      linkCount: linkCounts.get(post.slug) ?? 0,
    })),
    links,
  }
}

export async function getLocalBlogGraphData(slug: string): Promise<GraphData> {
  const graph = await getBlogGraphData()
  const localSlugs = new Set([slug])

  for (const link of graph.links) {
    if (link.source === slug) localSlugs.add(link.target)
    if (link.target === slug) localSlugs.add(link.source)
  }

  return {
    nodes: graph.nodes.filter((node) => localSlugs.has(node.slug)),
    links: graph.links.filter((link) => localSlugs.has(link.source) && localSlugs.has(link.target)),
  }
}

export async function getBacklinks(slug: string): Promise<Backlink[]> {
  const [targetPost, posts, references] = await Promise.all([
    getBlogPostBySlug(slug),
    getAllBlogPosts(),
    getBlogReferenceLookup(),
  ])

  if (!targetPost) return []

  return posts
    .filter((post) => post.slug !== slug && resolveLinkedSlugs(post, references).includes(slug))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
    }))
}
