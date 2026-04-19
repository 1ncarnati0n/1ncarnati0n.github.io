import { findAndReplace } from 'mdast-util-find-and-replace'
import { slug as slugHeading } from 'github-slugger'
import { visit } from 'unist-util-visit'

type TextNode = {
  type: 'text'
  value: string
}

type HtmlNode = {
  type: 'html'
  value: string
}

type ParagraphNode = {
  type: 'paragraph'
  children: PhrasingContentNode[]
  data?: Record<string, unknown>
}

type LinkNode = {
  type: 'link'
  url: string
  children: PhrasingContentNode[]
  data?: Record<string, unknown>
}

type EmphasisNode = {
  type: 'emphasis'
  children: PhrasingContentNode[]
  data?: Record<string, unknown>
}

type BlockquoteNode = {
  type: 'blockquote'
  children: MarkdownContentNode[]
  data?: Record<string, unknown>
}

type MarkdownContentNode = ParagraphNode | HtmlNode | BlockquoteNode
type PhrasingContentNode = TextNode | LinkNode | EmphasisNode | HtmlNode
type RootNode = {
  type: 'root'
  children: MarkdownContentNode[]
}

const HIGHLIGHT_PATTERN = /==([^=\n][^=\n]*?)==/g
const EXTERNAL_WIKILINK_PATTERN = /\[\[([^[\]]+?)\]\]\(([^)\s]+)\)/g
const EMBED_PATTERN = /!\[\[([^[\]]+?)\]\]/g
const WIKILINK_PATTERN = /\[\[([^[\]]+?)\]\]/g
const IMAGE_EXTENSION_PATTERN = /\.(png|jpe?g|gif|webp|svg|avif)$/i
const CALLOUT_PATTERN = /^\[!([^\]]+)\]([+-])?\s*(.*)$/i

export type ObsidianResolvedLink = {
  href: string
  title?: string
  description?: string
}

export type ObsidianResolvedEmbed =
  | {
      type: 'image'
      src: string
      alt?: string
      width?: number
      height?: number
    }
  | {
      type: 'note'
      href: string
      title: string
      description?: string
    }

export type ObsidianRenderOptions = {
  resolveWikiLink?: (reference: string) => ObsidianResolvedLink | null
  resolveEmbed?: (reference: string) => ObsidianResolvedEmbed | null
}

function createText(value: string): TextNode {
  return { type: 'text', value }
}

function createSpan(
  value: string,
  className: string | string[],
): PhrasingContentNode {
  return {
    type: 'emphasis',
    data: {
      hName: 'span',
      hProperties: {
        className: Array.isArray(className) ? className : [className],
      },
    },
    children: [createText(value)],
  }
}

function createLink(
  href: string,
  label: string,
  className: string | string[],
): LinkNode {
  return {
    type: 'link',
    url: href,
    children: [createText(label)],
    data: {
      hProperties: {
        className: Array.isArray(className) ? className : [className],
      },
    },
  }
}

function createHtml(value: string): HtmlNode {
  return {
    type: 'html',
    value,
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function humanizeCalloutType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

function parseWikiReference(raw: string) {
  const [targetWithHeading, label] = raw.split('|')
  const [target, heading] = targetWithHeading.split('#')

  return {
    target: target.trim(),
    heading: heading?.trim(),
    label: label?.trim(),
  }
}

function parseEmbedReference(raw: string) {
  const [target, sizeSpec] = raw.split('|')
  const normalizedTarget = target.trim()
  const normalizedSize = sizeSpec?.trim()

  if (!normalizedSize) {
    return { target: normalizedTarget }
  }

  const match = normalizedSize.match(/^(\d+)(?:x(\d+))?$/)

  if (!match) {
    return { target: normalizedTarget }
  }

  return {
    target: normalizedTarget,
    width: Number(match[1]),
    height: match[2] ? Number(match[2]) : undefined,
  }
}

function resolveWikiHref(
  options: ObsidianRenderOptions,
  reference: string,
): ObsidianResolvedLink | null {
  const parsed = parseWikiReference(reference)

  if (!parsed.target) {
    return null
  }

  const resolved = options.resolveWikiLink?.(parsed.target)

  if (!resolved) {
    return null
  }

  if (!parsed.heading) {
    return resolved
  }

  return {
    ...resolved,
    href: `${resolved.href}#${slugHeading(parsed.heading)}`,
  }
}

function transformCallouts(tree: RootNode) {
  visit(tree, 'blockquote', (node) => {
    const callout = node as BlockquoteNode
    const firstChild = callout.children[0]

    if (!firstChild || firstChild.type !== 'paragraph' || firstChild.children.length === 0) {
      return
    }

    const firstText = firstChild.children[0]

    if (!firstText || firstText.type !== 'text') {
      return
    }

    const [firstLine, ...bodyLines] = firstText.value.split('\n')
    const match = firstLine.match(CALLOUT_PATTERN)

    if (!match) {
      return
    }

    const calloutType = match[1].toLowerCase()
    const titleText = match[3]?.trim() || humanizeCalloutType(calloutType)
    const bodyText = bodyLines.join('\n').trim()
    const titleNode: ParagraphNode = {
      type: 'paragraph',
      data: {
        hName: 'div',
        hProperties: {
          className: ['obsidian-callout-title'],
        },
      },
      children: [createText(titleText)],
    }
    const bodyNode = bodyText
      ? [{
          type: 'paragraph',
          children: [createText(bodyText)],
        } satisfies ParagraphNode]
      : []

    callout.data = {
      hName: 'aside',
      hProperties: {
        className: ['obsidian-callout', `obsidian-callout-${calloutType}`],
        'data-callout': calloutType,
      },
    }

    callout.children = [titleNode, ...bodyNode, ...callout.children.slice(1)]
  })
}

export function remarkObsidian(options: ObsidianRenderOptions = {}) {
  return function transformer(tree: RootNode) {
    transformCallouts(tree)

    findAndReplace(
      tree,
      [
        [
          EXTERNAL_WIKILINK_PATTERN,
          (_match, reference: string, href: string) => {
            const parsed = parseWikiReference(reference)
            return createLink(
              href,
              parsed.label || parsed.target,
              ['obsidian-wikilink', 'obsidian-wikilink-external'],
            )
          },
        ],
        [
          EMBED_PATTERN,
          (_match, reference: string) => {
            const parsed = parseEmbedReference(reference)
            const resolved = options.resolveEmbed?.(parsed.target)

            if (resolved?.type === 'image') {
              const properties: Record<string, string | number | string[]> = {
                src: resolved.src,
                alt: resolved.alt || parsed.target,
                className: ['obsidian-embed-image'],
              }

              if (parsed.width) properties.width = parsed.width
              if (parsed.height) properties.height = parsed.height

              return createHtml(
                `<img src="${escapeHtml(String(properties.src))}" alt="${escapeHtml(
                  String(properties.alt),
                )}" class="obsidian-embed-image"${
                  parsed.width ? ` width="${parsed.width}"` : ''
                }${parsed.height ? ` height="${parsed.height}"` : ''} />`,
              )
            }

            if (resolved?.type === 'note') {
              const description = resolved.description
                ? `<p class="obsidian-embed-card-description">${escapeHtml(
                    resolved.description,
                  )}</p>`
                : ''

              return createHtml(
                `<aside class="obsidian-embed-card"><a class="obsidian-embed-card-link" href="${escapeHtml(
                  resolved.href,
                )}">${escapeHtml(resolved.title)}</a>${description}</aside>`,
              )
            }

            if (IMAGE_EXTENSION_PATTERN.test(parsed.target)) {
              const src = parsed.target.startsWith('/') ? parsed.target : `/${parsed.target}`

              return createHtml(
                `<img src="${escapeHtml(src)}" alt="${escapeHtml(
                  parsed.target,
                )}" class="obsidian-embed-image"${
                  parsed.width ? ` width="${parsed.width}"` : ''
                }${parsed.height ? ` height="${parsed.height}"` : ''} />`,
              )
            }

            return createSpan(parsed.target, 'obsidian-embed-unresolved')
          },
        ],
        [
          WIKILINK_PATTERN,
          (_match, reference: string) => {
            const parsed = parseWikiReference(reference)
            const resolved = resolveWikiHref(options, reference)
            const label = parsed.label || parsed.target

            if (!resolved) {
              return createSpan(label, 'obsidian-wikilink-unresolved')
            }

            return createLink(resolved.href, label, 'obsidian-wikilink')
          },
        ],
        [
          HIGHLIGHT_PATTERN,
          (_match, value: string) => createSpan(value, 'obsidian-highlight'),
        ],
      ],
      {
        ignore: ['link', 'linkReference', 'image', 'imageReference', 'inlineCode', 'code', 'html'],
      },
    )
  }
}
