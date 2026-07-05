import { describe, expect, it } from 'vitest'

import { renderMarkdown } from './mdx'

describe('renderMarkdown Obsidian compatibility', () => {
  it('renders wiki links, callouts, and highlights', async () => {
    const html = await renderMarkdown(
      [
        '[[MDP]]',
        '',
        '> [!quote] Markov Process',
        '> value',
        '',
        '==important==',
      ].join('\n'),
      {
        resolveWikiLink: () => ({
          href: '/blog/02-mdp',
          title: '2. 마르코프 결정 프로세스',
        }),
      },
    )

    expect(html).toContain('href="/blog/02-mdp"')
    expect(html).toContain('obsidian-wikilink')
    expect(html).toContain('obsidian-callout')
    expect(html).toContain('Markov Process')
    expect(html).toContain('obsidian-highlight')
  })

  it('renders note embeds as cards', async () => {
    const html = await renderMarkdown('![[MDP]]', {
      resolveEmbed: () => ({
        type: 'note',
        href: '/blog/02-mdp',
        title: '2. 마르코프 결정 프로세스',
        description: '강화학습의 의사결정 모델',
      }),
    })

    expect(html).toContain('obsidian-embed-card')
    expect(html).toContain('/blog/02-mdp')
    expect(html).toContain('강화학습의 의사결정 모델')
  })

  it('renders image embeds and unresolved wiki links', async () => {
    const html = await renderMarkdown('![[images/blog/post/diagram.png|320]]\n\n[[Missing Note]]')

    expect(html).toContain('src="/images/blog/post/diagram.png"')
    expect(html).toContain('width="320"')
    expect(html).toContain('obsidian-wikilink-unresolved')
  })

  it('keeps heading wiki links aligned with rendered heading ids', async () => {
    const html = await renderMarkdown('[[MDP#Bellman Equation]]', {
      resolveWikiLink: () => ({
        href: '/blog/02-mdp/',
        title: '2. 마르코프 결정 프로세스',
      }),
    })

    expect(html).toContain('href="/blog/02-mdp/#bellman-equation"')
  })
})
