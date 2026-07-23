import { defineCollection, z } from "astro:content";

const basePostSchema = z.object({
  title: z.string(),
  description: z.string(),
  h1: z.string(),
  date: z.coerce.date(),                   // auto convert string → Date
  author: z.string().default("Admin"),     // default if not provided
  image: z.string().optional(),            // optional thumbnail
  category: z.string().default("General"),
  tags: z.array(z.string()).default([]),   // no need to repeat empty array
  toc: z.boolean().default(false),
  summary: z.string().optional(),
  updatedDate: z.coerce.date().optional(),
  canonical: z.string().optional(),
  faq: z
    .array(
      z.object({
        q: z.string(),
        a: z.string(),
      })
    )
    .optional(),
  noindex: z.boolean().optional(),
});

const postsCollection = defineCollection({
  schema: basePostSchema,
});

// ✅ New schema for category markdown files
const categorySchema = z.object({
  title: z.string(),             // Category name (e.g. "Business")
  description: z.string(),       // Meta description for SEO
  sidebar: z.string().optional() // Optional sidebar markdown/html
});

const categoriesCollection = defineCollection({
  schema: categorySchema,
});

export const collections = {
  posts: postsCollection,
  categories: categoriesCollection, // ✅ Added
};