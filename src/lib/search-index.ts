/**
 * Build-time search index generation.
 * Called from scripts/generate-search-index.mjs and SearchOverlay
 */
import type { Post, Project } from "./types";
import { getPostCategory, deriveTitle, cleanSlug } from "./content-utils";

export interface SearchItem {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  category: string;
}

export function buildSearchIndex(
  posts: Post[],
  projects: Project[],
): SearchItem[] {
  const items: SearchItem[] = [];

  for (const post of posts) {
    items.push({
      title: deriveTitle(post.id, post.data.title),
      slug: cleanSlug(post.id),
      description: post.data.description ?? "",
      tags: post.data.tags ?? [],
      category: getPostCategory(post.id),
    });
  }

  for (const project of projects) {
    items.push({
      title: project.data.title,
      slug: `projects/${cleanSlug(project.id)}`,
      description: project.data.description ?? "",
      tags: project.data.tags ?? [],
      category: project.data.category ?? "Other",
    });
  }

  return items;
}
