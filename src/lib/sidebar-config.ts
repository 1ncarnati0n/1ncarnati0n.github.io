import type { Post, Project } from "./types";
import { getPostCategory, deriveTitle, cleanSlug, groupPostsByCategory } from "./content-utils";

export interface SidebarItem {
  title: string;
  href: string;
}

export interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

/** Build sidebar sections from blog posts grouped by category */
export function buildBlogSidebar(posts: Post[]): SidebarSection[] {
  const grouped = groupPostsByCategory(posts);
  const categories = [...grouped.keys()].sort();

  return categories.map((cat) => {
    const catPosts = grouped.get(cat)!;
    return {
      label: cat,
      items: catPosts.map((post) => ({
        title: deriveTitle(post.id, post.data.title),
        href: `/posts/${cleanSlug(post.id)}/`,
      })),
    };
  });
}

/** Build sidebar sections from projects grouped by category */
export function buildProjectsSidebar(projects: Project[]): SidebarSection[] {
  const grouped = new Map<string, Project[]>();
  for (const project of projects) {
    const cat = project.data.category ?? "other";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(project);
  }

  const categories = [...grouped.keys()].sort();
  return categories.map((cat) => ({
    label: cat,
    items: grouped.get(cat)!.map((p) => ({
      title: p.data.title,
      href: `/projects/${cleanSlug(p.id)}/`,
    })),
  }));
}
