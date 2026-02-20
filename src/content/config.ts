import { defineCollection, z } from "astro:content";

/** Helper: accept null or undefined arrays, normalize to [] */
const nullableStringArray = z
  .array(z.string())
  .nullable()
  .optional()
  .transform((v) => v ?? []);

const posts = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string().nullable().optional(),
      date: z.coerce.date().nullable().optional(),
      description: z.string().nullable().optional().default(""),
      tags: nullableStringArray,
      categories: nullableStringArray,
      draft: z.boolean().nullable().optional().default(false),
      aliases: nullableStringArray,
      thumbnail: z.string().nullable().optional(),
      cssclasses: z.any().optional(), // Obsidian metadata — ignored
      edits: z
        .array(
          z.object({
            date: z.coerce.date(),
            description: z.string(),
          }),
        )
        .nullable()
        .optional()
        .transform((v) => v ?? []),
    })
    .passthrough(), // Allow unknown Obsidian frontmatter fields
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().nullable().optional(),
    category: z.string().nullable().optional().default("Other"),
    thumbnail: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    description: z.string().nullable().optional().default(""),
    tags: nullableStringArray,
    weight: z.number().nullable().optional().default(0),
    year: z.number().nullable().optional(),
    role: z.string().nullable().optional(),
  }),
});

export const collections = { posts, projects };
