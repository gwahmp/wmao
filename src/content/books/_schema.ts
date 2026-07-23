import { z, defineCollection } from "astro:content";

const booksCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    image: z.string().url(),
    author: z.string(),
    pages: z.number(),
    description: z.string(),
    summary: z.string().optional(),
    publishedDate: z.date().optional(),
  }),
});

export const collections = {
  books: booksCollection,
};
