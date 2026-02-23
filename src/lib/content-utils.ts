import readingTime from "reading-time";
import type { Post, Project } from "./types";

/** Remove .md extension from collection IDs */
export function cleanSlug(id: string): string {
  return id.replace(/\.md$/, "");
}

/** Calculate reading time from raw markdown content */
export function getReadingTime(content: string): string {
  const result = readingTime(content);
  const minutes = Math.ceil(result.minutes);
  return `${minutes}분`;
}

/** Sort posts by date (newest first), fallback to title */
export function sortPostsByDate(posts: Post[]): Post[] {
  return posts.sort((a, b) => {
    const dateA = a.data.date?.getTime() ?? 0;
    const dateB = b.data.date?.getTime() ?? 0;
    return dateB - dateA;
  });
}

/** Sort projects by weight (higher first), then by date */
export function sortProjects(projects: Project[]): Project[] {
  return projects.sort((a, b) => {
    const weightDiff = (b.data.weight ?? 0) - (a.data.weight ?? 0);
    if (weightDiff !== 0) return weightDiff;
    const dateA = a.data.date?.getTime() ?? 0;
    const dateB = b.data.date?.getTime() ?? 0;
    return dateB - dateA;
  });
}

/** Extract category from post slug (e.g. "csharp/hello" → "csharp") */
export function getPostCategory(slug: string): string {
  const clean = cleanSlug(slug);
  const parts = clean.split("/");
  return parts.length > 1 ? parts[0] : "blog";
}

/** Get unique tags from a collection of posts */
export function getAllTags(posts: Post[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.data.tags?.forEach((tag) => tags.add(tag));
  });
  return [...tags].sort();
}

/** Get unique project categories */
export function getProjectCategories(projects: Project[]): string[] {
  const cats = new Set<string>();
  projects.forEach((p) => {
    if (p.data.category) cats.add(p.data.category);
  });
  return [...cats].sort();
}

/** Format date for display */
export function formatDate(date: Date | undefined | null): string {
  if (!date) return "";
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Group posts by category into a Map */
export function groupPostsByCategory(posts: Post[]): Map<string, Post[]> {
  const grouped = new Map<string, Post[]>();
  for (const post of posts) {
    const cat = getPostCategory(post.id);
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(post);
  }
  return grouped;
}

/** Derive title from filename if frontmatter title is missing */
export function deriveTitle(slug: string, frontmatterTitle?: string | null): string {
  if (frontmatterTitle) return frontmatterTitle;
  const clean = cleanSlug(slug);
  const filename = clean.split("/").pop() ?? clean;
  return filename
    .replace(/[-_]/g, " ")
    .replace(/^\d+\s*/, "")
    .trim();
}
