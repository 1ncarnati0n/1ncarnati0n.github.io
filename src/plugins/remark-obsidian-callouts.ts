/**
 * Remark plugin for Obsidian-style callouts: > [!note], > [!tip], etc.
 * Based on Quartz ofm.ts calloutMapping (line 63-91) + calloutRegex (line 134)
 */
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Blockquote, Paragraph, Html, BlockContent, DefinitionContent } from "mdast";

// From Quartz ofm.ts:63-91
const calloutMapping: Record<string, string> = {
  note: "note",
  abstract: "abstract",
  summary: "abstract",
  tldr: "abstract",
  info: "info",
  todo: "todo",
  tip: "tip",
  hint: "tip",
  important: "tip",
  success: "success",
  check: "success",
  done: "success",
  question: "question",
  help: "question",
  faq: "question",
  warning: "warning",
  attention: "warning",
  caution: "warning",
  failure: "failure",
  missing: "failure",
  fail: "failure",
  danger: "danger",
  error: "danger",
  bug: "bug",
  example: "example",
  quote: "quote",
  cite: "quote",
};

// From Quartz ofm.ts:134
const calloutRegex = /^\[\!([\w-]+)\|?(.+?)?\]([+-]?)/;

function canonicalizeCallout(name: string): string {
  return calloutMapping[name.toLowerCase()] ?? name;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const remarkObsidianCallouts: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "blockquote", (node: Blockquote) => {
      if (node.children.length === 0) return;

      const [firstChild, ...calloutContent] = node.children;
      if (firstChild.type !== "paragraph" || firstChild.children[0]?.type !== "text") {
        return;
      }

      const text = firstChild.children[0].value;
      const restOfTitle = firstChild.children.slice(1);
      const [firstLine, ...remainingLines] = text.split("\n");
      const remainingText = remainingLines.join("\n");

      const match = firstLine.match(calloutRegex);
      if (!match || !match.input) return;

      const [calloutDirective, typeString, _calloutMetaData, collapseChar] = match;
      const calloutType = canonicalizeCallout(typeString.toLowerCase());
      const collapse = collapseChar === "+" || collapseChar === "-";
      const defaultState = collapseChar === "-" ? "collapsed" : "expanded";
      const titleContent = match.input.slice(calloutDirective.length).trim();
      const useDefaultTitle = titleContent === "" && restOfTitle.length === 0;

      const displayTitle = useDefaultTitle
        ? capitalize(typeString).replace(/-/g, " ")
        : titleContent;

      const toggleIcon = collapse ? `<div class="fold-callout-icon"></div>` : "";

      const titleHtml: Html = {
        type: "html",
        value: `<div class="callout-title">
  <div class="callout-icon"></div>
  <div class="callout-title-inner">${displayTitle}</div>
  ${toggleIcon}
</div>`,
      };

      const blockquoteContent: (BlockContent | DefinitionContent)[] = [titleHtml];

      if (remainingText.length > 0) {
        blockquoteContent.push({
          type: "paragraph",
          children: [{ type: "text", value: remainingText }],
        });
      }

      // Wrap callout body content for collapsible animation
      if (calloutContent.length > 0) {
        node.children = [
          node.children[0],
          {
            data: { hProperties: { className: ["callout-content"] }, hName: "div" },
            type: "blockquote",
            children: [
              {
                data: {
                  hProperties: { className: ["callout-content-inner"] },
                  hName: "div",
                },
                type: "blockquote",
                children: [...calloutContent],
              },
            ],
          } as any,
        ];
      }

      node.children.splice(0, 1, ...blockquoteContent);

      const classNames = ["callout", calloutType];
      if (collapse) classNames.push("is-collapsible");
      if (defaultState === "collapsed") classNames.push("is-collapsed");

      node.data = {
        hProperties: {
          ...(node.data?.hProperties ?? {}),
          className: classNames.join(" "),
          "data-callout": calloutType,
          "data-callout-fold": String(collapse),
        },
      };
    });
  };
};
