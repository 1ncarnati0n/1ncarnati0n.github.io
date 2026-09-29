import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import type { BlogPost } from '$lib/types/content'
import { cleanMarkdownText, normalizeBlogPost } from './frontmatter'
import { renderMarkdownWithHeadings } from './mdx'
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
  it('builds the TOC from rendered headings, so it cannot drift from the page', async () => {
    // `<br>` 바로 아래 줄은 raw HTML 블록에 먹혀 제목이 아니다. 소스를 정규식으로 훑던 예전 목차는
    // 이걸 제목으로 세어 slug가 어긋나고 중복되어, Svelte가 페이지 전체를 지웠다.
    const source = [
      '## 개요',
      '',
      '<br>',
      '### 삼켜진 제목',
      '',
      '## 개요',
      '',
      '### 배열 <sup>Arrays</sup>',
      '',
      '### $\\gamma$ 는 왜 필요한가?',
    ].join('\n')

    const { headings } = await renderMarkdownWithHeadings(source)

    expect(headings.map(({ level, slug, text }) => [level, slug, text])).toEqual([
      [2, '개요', '개요'],
      [2, '개요-1', '개요'],
      [3, '배열-arrays', '배열 Arrays'],
      [3, expect.any(String), 'γ 는 왜 필요한가?'],
    ])
    expect(new Set(headings.map((heading) => heading.slug)).size).toBe(headings.length)
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

  it('strips Obsidian syntax and table rules from generated text', () => {
    const source = [
      '> [!quote] 제목',
      '==강조== [[Note#Part|라벨]] [[Plain]] ![[img.png|300]]',
      '',
      '|a|b|',
      '|---|---|',
      '|1|2|',
      '',
      '---',
      '끝',
    ].join('\n')

    expect(cleanMarkdownText(source)).toBe('제목 강조 라벨 Plain a b 1 2 끝')
  })

  it('sorts dated posts newest first, then undated posts in source order', () => {
    const posts = [
      post({ slug: 'undated-a', tags: ['t'], date: undefined }),
      post({ slug: 'old', tags: ['t'], date: new Date('2026-01-01') }),
      post({ slug: 'undated-b', tags: ['t'], date: undefined }),
      post({ slug: 'new', tags: ['t'], date: new Date('2026-02-01') }),
    ]

    expect(groupPostsByTag(posts)[0].posts.map((item) => item.slug)).toEqual([
      'new',
      'old',
      'undated-a',
      'undated-b',
    ])
  })

  it('never invents a date: frontmatter only, no file mtime fallback', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-date-'))
    const file = path.join(dir, 'a.md')

    try {
      await fs.writeFile(file, '---\nslug: "a"\n---\n# A\n')
      expect((await normalizeBlogPost(file, ['a']))?.date).toBeUndefined()

      await fs.writeFile(file, '---\nslug: "a"\ndate: "2026-07-05"\n---\n# A\n')
      expect((await normalizeBlogPost(file, ['a']))?.date?.toISOString()).toBe(
        '2026-07-05T00:00:00.000Z',
      )
    } finally {
      await fs.rm(dir, { recursive: true })
    }

    expect(createSearchDocument(post({ date: undefined })).date).toBeUndefined()
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
