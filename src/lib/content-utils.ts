import readingTime from "reading-time";
import type { Post, Project } from "./types";

type DatedEntity = { data: { date?: Date | null } };

function sortByDateDesc<T extends DatedEntity>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = a.data.date?.getTime() ?? 0;
    const dateB = b.data.date?.getTime() ?? 0;
    return dateB - dateA;
  });
}

export function groupBy<T>(
  items: T[],
  getKey: (item: T) => string,
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  for (const item of items) {
    const key = getKey(item);
    const bucket = grouped.get(key);
    if (bucket) {
      bucket.push(item);
    } else {
      grouped.set(key, [item]);
    }
  }

  return grouped;
}

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
  return sortByDateDesc(posts);
}

/** Sort projects by weight (higher first), then by date */
export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
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

/** 마크다운 본문에서 첫 번째 이미지 URL 추출 */
export function extractFirstImage(markdown: string): string | undefined {
  const match = markdown.match(/!\[.*?\]\((.*?)\)/);
  return match?.[1] || undefined;
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
  return groupBy(posts, (post) => getPostCategory(post.id));
}

/** Count posts per tag */
export function countTags(posts: Post[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return counts;
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
