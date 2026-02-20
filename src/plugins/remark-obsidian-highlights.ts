/**
 * Remark plugin for Obsidian-style highlights: ==text== → <mark>
 * Based on Quartz ofm.ts highlightRegex (line 131)
 */
import { findAndReplace } from "mdast-util-find-and-replace";
import type { Plugin } from "unified";
import type { Root } from "mdast";

// From Quartz ofm.ts:131
const highlightRegex = /==([^=]+)==/g;

// Also handle Obsidian comments: %%text%%
const commentRegex = /%%[\s\S]*?%%/g;

export const remarkObsidianHighlights: Plugin<[], Root> = () => {
  return (tree) => {
    findAndReplace(tree, [
      [
        highlightRegex,
        (_value: string, inner: string) => {
          return {
            type: "html",
            value: `<mark class="text-highlight">${inner}</mark>`,
          } as any;
        },
      ],
      [
        commentRegex,
        () => {
          // Remove Obsidian comments entirely
          return { type: "text", value: "" } as any;
        },
      ],
    ]);
  };
};
