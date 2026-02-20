/**
 * Build-time search index generation.
 * Called from a static endpoint to produce /search-index.json
 */
import type { CollectionEntry } from "astro:content";
import { getPostCategory, deriveTitle, cleanSlug } from "./content-utils";

interface SearchItem {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  category: string;
}

export function buildSearchIndex(
  posts: CollectionEntry<"posts">[],
  projects: CollectionEntry<"projects">[],
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
