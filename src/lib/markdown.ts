/**
 * Markdown rendering pipeline — replaces Astro's built-in markdown processing
 * Uses unified with remark/rehype plugins matching the Astro config
 */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Element } from "hast";
import type { Heading } from "./types";

// Custom Obsidian plugins (unchanged from Astro)
import { remarkObsidianWikilinks } from "../plugins/remark-obsidian-wikilinks";
import { remarkObsidianCallouts } from "../plugins/remark-obsidian-callouts";
import { remarkObsidianHighlights } from "../plugins/remark-obsidian-highlights";

/**
 * Rehype plugin to extract headings from the AST
 * Collects h1-h6 with their depth, slug, and text content
 */
function rehypeExtractHeadings(headings: Heading[]) {
  return () => {
    return (tree: any) => {
      visit(tree, "element", (node: Element) => {
        const match = node.tagName.match(/^h([1-6])$/);
        if (!match) return;

        const depth = parseInt(match[1], 10);
        const slug =
          (node.properties?.id as string) ?? "";
        const text = toString(node);

        headings.push({ depth, slug, text });
      });
    };
  };
}

function createProcessor(headings: Heading[]) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkObsidianWikilinks)
    .use(remarkObsidianCallouts)
    .use(remarkObsidianHighlights)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex, { strict: false } as any)
    .use(rehypePrettyCode as any, {
      theme: {
        light: "vitesse-light",
        dark: "one-dark-pro",
      },
      keepBackground: false,
    })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["heading-anchor"] },
    })
    .use(rehypeExtractHeadings(headings))
    .use(rehypeStringify, { allowDangerousHtml: true });
}

/**
 * Render markdown string to HTML + extract headings
 * Replaces Astro's `render(post)` → `{ Content, headings }`
 */
export async function renderMarkdown(
  body: string,
): Promise<{ html: string; headings: Heading[] }> {
  const headings: Heading[] = [];

  // Create a fresh processor each time with a new headings array
  const processor = createProcessor(headings);
  const result = await processor.process(body);

  return {
    html: String(result),
    headings,
  };
}
