/** Frontmatter fields for blog posts (mirrors Astro Zod schema) */
export interface PostFrontmatter {
  title?: string | null;
  date?: Date | null;
  description?: string;
  tags?: string[];
  categories?: string[];
  draft?: boolean;
  aliases?: string[];
  thumbnail?: string | null;
  cssclasses?: unknown;
  edits?: { date: Date; description: string }[];
  [key: string]: unknown; // passthrough for unknown Obsidian fields
}

/** Frontmatter fields for projects */
export interface ProjectFrontmatter {
  title: string;
  date?: Date | null;
  category?: string;
  thumbnail?: string | null;
  location?: string | null;
  description?: string;
  tags?: string[];
  weight?: number;
  year?: number | null;
  role?: string | null;
}

/** Replaces CollectionEntry<"posts"> */
export interface Post {
  id: string;
  data: PostFrontmatter;
  body: string;
}

/** Replaces CollectionEntry<"projects"> */
export interface Project {
  id: string;
  data: ProjectFrontmatter;
  body: string;
}

/** Heading extracted from markdown rendering */
export interface Heading {
  depth: number;
  slug: string;
  text: string;
}
