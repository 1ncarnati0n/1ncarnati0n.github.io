import { describe, expect, it } from 'vitest'

import type { BlogPost } from '$lib/types/content'
import { applyRenderedHeadingIds, extractHeadings } from './frontmatter'
import { getWikiLinkReferences, resolveLinkedSlugs } from './references'
import { createSearchDocument } from './search'
import { groupPostsBySeries, groupPostsByTag } from './posts'
import { xmlEscape } from './site'

function post(overrides: Partial<BlogPost>): BlogPost {
  return {
    type: 'blog',
    slug: 'post',
    sourcePathParts: [],
    sourceFileName: 'Post',
    title: 'Post',
    description: 'Description',
    date: new Date('2026-07-05'),
    tags: [],
    draft: false,
    aliases: [],
    cssClasses: [],
    readingTime: 1,
    content: '# Post',
    headings: [],
    ...overrides,
  }
}

describe('content helpers', () => {
  it('syncs TOC slugs with rendered heading ids', () => {
    const headings = extractHeadings('## 배열 <sup>Arrays</sup>')
    const synced = applyRenderedHeadingIds(
      headings,
      '<h2 id="배열-arrays">배열 <sup>Arrays</sup></h2>',
    )

    expect(synced[0].slug).toBe('배열-arrays')
  })

  it('groups posts by tag and series', () => {
    const posts = [
      post({ slug: 'a', tags: ['svelte'], series: 'Blog' }),
      post({ slug: 'b', tags: ['svelte', 'seo'], series: 'Blog' }),
    ]

    expect(groupPostsByTag(posts)[0]).toMatchObject({ name: 'svelte', count: 2 })
    expect(groupPostsBySeries(posts)[0]).toMatchObject({ name: 'Blog', count: 2 })
  })

  it('resolves backlinks by title, slug, and aliases', () => {
    const target = post({ slug: 'target', title: 'Target', aliases: ['Alias'] })
    const source = post({ slug: 'source', content: '[[Alias#Part|label]]' })
    const references = new Map<string, BlogPost | null>([
      ['target', target],
      ['alias', target],
    ])

    expect(getWikiLinkReferences(source.content)).toEqual(['Alias'])
    expect(resolveLinkedSlugs(source, references)).toEqual(['target'])
  })

  it('creates search documents and escapes XML', () => {
    const document = createSearchDocument(
      post({
        slug: 'search-post',
        tags: ['ai'],
        headings: [{ level: 2, text: 'Heading', slug: 'heading' }],
        content: '# Search Post\n\nBody',
      }),
    )

    expect(document).toMatchObject({ slug: 'search-post', tags: ['ai'], headings: ['Heading'] })
    expect(xmlEscape('<title>&"')).toBe('&lt;title&gt;&amp;&quot;')
  })
})
