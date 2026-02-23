/**
 * Content loader — replaces Astro's getCollection()
 * Reads markdown files from /content directory using fs + gray-matter
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, Project, PostFrontmatter, ProjectFrontmatter } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Directories to skip when scanning for markdown files */
const SKIP_DIRS = new Set([".obsidian", "_images", "node_modules"]);

/** Recursively find all .md files in a directory */
function findMarkdownFiles(dir: string, base: string = ""): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const relativePath = base ? `${base}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath, relativePath));
    } else if (entry.name.endsWith(".md")) {
      results.push(relativePath);
    }
  }
  return results;
}

/** Parse a date value from frontmatter (handles string, Date, null) */
function parseDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

/** Normalize an array field that may be null/undefined */
function normalizeArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  return [];
}

/** Parse a single post markdown file */
function parsePost(filePath: string, id: string): Post {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const fm: PostFrontmatter = {
    ...data,
    title: data.title ?? undefined,
    date: parseDate(data.date),
    description: data.description ?? "",
    tags: normalizeArray(data.tags),
    categories: normalizeArray(data.categories),
    draft: data.draft ?? false,
    aliases: normalizeArray(data.aliases),
    thumbnail: data.thumbnail ?? undefined,
    edits: Array.isArray(data.edits)
      ? data.edits.map((e: any) => ({
          date: parseDate(e.date) ?? new Date(),
          description: String(e.description ?? ""),
        }))
      : [],
  };

  return { id, data: fm, body: content };
}

/** Parse a single project markdown file */
function parseProject(filePath: string, id: string): Project {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const fm: ProjectFrontmatter = {
    title: data.title ?? "Untitled",
    date: parseDate(data.date),
    category: data.category ?? "Other",
    thumbnail: data.thumbnail ?? undefined,
    location: data.location ?? undefined,
    description: data.description ?? "",
    tags: normalizeArray(data.tags),
    weight: typeof data.weight === "number" ? data.weight : 0,
    year: typeof data.year === "number" ? data.year : undefined,
    role: data.role ?? undefined,
  };

  return { id, data: fm, body: content };
}

// ─── Cached collections ───────────────────────────────────────────
let _postsCache: Post[] | null = null;
let _projectsCache: Project[] | null = null;

/** Get all posts (cached) — replaces getCollection("posts") */
export function getAllPosts(): Post[] {
  if (_postsCache) return _postsCache;

  const postsDir = path.join(CONTENT_DIR, "posts");
  if (!fs.existsSync(postsDir)) return [];

  const files = findMarkdownFiles(postsDir);
  _postsCache = files.map((relPath) => {
    const fullPath = path.join(postsDir, relPath);
    return parsePost(fullPath, relPath);
  });

  return _postsCache;
}

/** Get published posts (non-draft) — replaces getCollection("posts", filter) */
export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((p) => !p.data.draft);
}

/** Get all projects (cached) — replaces getCollection("projects") */
export function getAllProjects(): Project[] {
  if (_projectsCache) return _projectsCache;

  const projectsDir = path.join(CONTENT_DIR, "projects");
  if (!fs.existsSync(projectsDir)) return [];

  const files = findMarkdownFiles(projectsDir);
  _projectsCache = files.map((relPath) => {
    const fullPath = path.join(projectsDir, relPath);
    return parseProject(fullPath, relPath);
  });

  return _projectsCache;
}
