import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { buildSearchIndex } from "../lib/search-index";

export const GET: APIRoute = async () => {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  const projects = await getCollection("projects");
  const index = buildSearchIndex(posts, projects);

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};
