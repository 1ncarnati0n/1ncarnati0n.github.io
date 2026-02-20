/**
 * Remark plugin for Obsidian-style wikilinks: [[page]], [[page|alias]], ![[image]]
 * Based on Quartz ofm.ts wikilinkRegex (line 119-121)
 */
import { findAndReplace } from "mdast-util-find-and-replace";
import type { Plugin } from "unified";
import type { Root } from "mdast";

// From Quartz ofm.ts:119-121
const wikilinkRegex =
  /!?\[\[([^\[\]\|\#\\]+)?(#+[^\[\]\|\#\\]+)?(\\?\|[^\[\]\#]*)?\]\]/g;

const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg", ".webp"];
const videoExtensions = [".mp4", ".webm", ".ogv", ".mov", ".mkv"];

function getExtension(fp: string): string {
  const idx = fp.lastIndexOf(".");
  return idx >= 0 ? fp.slice(idx).toLowerCase() : "";
}

export const remarkObsidianWikilinks: Plugin<[], Root> = () => {
  return (tree) => {
    findAndReplace(tree, [
      [
        wikilinkRegex,
        (value: string, rawFp?: string, rawHeader?: string, rawAlias?: string) => {
          const fp = rawFp?.trim() ?? "";
          const anchor = rawHeader?.trim() ?? "";
          const alias = rawAlias?.slice(1).trim();

          // Handle embeds: ![[file]]
          if (value.startsWith("!")) {
            const ext = getExtension(fp);

            if (imageExtensions.includes(ext)) {
              // Image embed: ![[image.png]] or ![[image.png|alt text]]
              const url = fp.startsWith("/") ? fp : `/_images/${fp}`;
              return {
                type: "image",
                url,
                alt: alias ?? fp,
                data: {
                  hProperties: { alt: alias ?? fp },
                },
              } as any;
            }

            if (videoExtensions.includes(ext)) {
              const url = fp.startsWith("/") ? fp : `/_images/${fp}`;
              return {
                type: "html",
                value: `<video src="${url}" controls></video>`,
              } as any;
            }

            // Other embeds (transclusion) — render as a link for now
            return {
              type: "html",
              value: `<blockquote class="transclude" data-url="${fp}"><a href="/posts/${fp}">${alias ?? fp}</a></blockquote>`,
            } as any;
          }

          // Regular wikilink: [[page]] or [[page|alias]] or [[page#heading]]
          const url = `/posts/${fp}${anchor}`;

          return {
            type: "link",
            url,
            children: [{ type: "text", value: alias ?? fp }],
          } as any;
        },
      ],
    ]);
  };
};
