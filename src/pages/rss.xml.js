import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts");

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.date) - new Date(a.data.date)
  );

  return rss({
    title: "Wikimint Blog",
    description: "Personal finance & business strategies in India",
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date ? new Date(post.data.date) : new Date(),
      description: post.data.description ?? "",
      link: `/${post.slug}`,
    })),
  });
}
