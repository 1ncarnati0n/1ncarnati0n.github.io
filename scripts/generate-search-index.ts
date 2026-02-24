/**
 * Build-time script to generate /public/search-index.json
 * Uses shared content/search-index utilities from src/lib.
 */
import fs from "node:fs";
import path from "node:path";
import { getAllProjects, getPublishedPosts } from "../src/lib/content";
import { buildSearchIndex } from "../src/lib/search-index";

const outputPath = path.join(process.cwd(), "public", "search-index.json");
const posts = getPublishedPosts();
const projects = getAllProjects();
const items = buildSearchIndex(posts, projects);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(items));
console.log(`[search-index] Generated ${items.length} items → ${outputPath}`);
