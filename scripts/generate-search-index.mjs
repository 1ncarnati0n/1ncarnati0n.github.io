/**
 * Build-time script to generate /public/search-index.json
 * Replaces the Astro API endpoint (src/pages/search-index.json.ts)
 * Run before `next build`: "node scripts/generate-search-index.mjs"
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const OUTPUT_PATH = path.join(process.cwd(), "public", "search-index.json");

const SKIP_DIRS = new Set([".obsidian", "_images", "node_modules"]);

function findMarkdownFiles(dir, base = "") {
  const results = [];
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

function cleanSlug(id) {
  return id.replace(/\.md$/, "");
}

function getPostCategory(slug) {
  const clean = cleanSlug(slug);
  const parts = clean.split("/");
  return parts.length > 1 ? parts[0] : "blog";
}

function deriveTitle(slug, frontmatterTitle) {
  if (frontmatterTitle) return frontmatterTitle;
  const clean = cleanSlug(slug);
  const filename = clean.split("/").pop() ?? clean;
  return filename.replace(/[-_]/g, " ").replace(/^\d+\s*/, "").trim();
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value.map(String);
  return [];
}

// --- Build index ---
const items = [];

// Posts
const postsDir = path.join(CONTENT_DIR, "posts");
if (fs.existsSync(postsDir)) {
  const postFiles = findMarkdownFiles(postsDir);
  for (const relPath of postFiles) {
    const raw = fs.readFileSync(path.join(postsDir, relPath), "utf-8");
    const { data } = matter(raw);

    if (data.draft) continue;

    items.push({
      title: deriveTitle(relPath, data.title),
      slug: cleanSlug(relPath),
      description: data.description ?? "",
      tags: normalizeArray(data.tags),
      category: getPostCategory(relPath),
    });
  }
}

// Projects
const projectsDir = path.join(CONTENT_DIR, "projects");
if (fs.existsSync(projectsDir)) {
  const projectFiles = findMarkdownFiles(projectsDir);
  for (const relPath of projectFiles) {
    const raw = fs.readFileSync(path.join(projectsDir, relPath), "utf-8");
    const { data } = matter(raw);

    items.push({
      title: data.title ?? "Untitled",
      slug: `projects/${cleanSlug(relPath)}`,
      description: data.description ?? "",
      tags: normalizeArray(data.tags),
      category: data.category ?? "Other",
    });
  }
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(items, null, 0));
console.log(`[search-index] Generated ${items.length} items → ${OUTPUT_PATH}`);
