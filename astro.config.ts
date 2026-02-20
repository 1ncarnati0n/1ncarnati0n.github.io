import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { remarkObsidianWikilinks } from "./src/plugins/remark-obsidian-wikilinks";
import { remarkObsidianCallouts } from "./src/plugins/remark-obsidian-callouts";
import { remarkObsidianHighlights } from "./src/plugins/remark-obsidian-highlights";

export default defineConfig({
  site: "https://1ncarnati0n.github.io",
  output: "static",
  integrations: [react(), sitemap()],
  markdown: {
    syntaxHighlight: false,
    remarkPlugins: [
      remarkGfm,
      remarkMath,
      remarkObsidianWikilinks,
      remarkObsidianCallouts,
      remarkObsidianHighlights,
    ],
    rehypePlugins: [
      rehypeRaw,
      [rehypeKatex, { strict: false }],
      [
        rehypePrettyCode,
        {
          theme: {
            light: "github-light",
            dark: "github-dark",
          },
          keepBackground: false,
        },
      ],
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: { className: ["heading-anchor"] },
        },
      ],
    ],
  },
});
