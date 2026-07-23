import { getCollection } from "astro:content";

export async function GET() {
  const posts = await getCollection("posts");

  // Sort by date (newest first)
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  // Shape the output
  const data = posts.map((post) => ({
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    date: post.data.date.toISOString(), // keep ISO string (safe for JSON)
    author: post.data.author,
    image: post.data.image ?? "/default-thumbnail.webp", // fallback
    category: post.data.category,
    tags: post.data.tags ?? [],
  }));

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
