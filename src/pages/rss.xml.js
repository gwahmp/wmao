import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {

  const base = "https://www.wikimint.com";

  const posts = await getCollection("posts");

  /* --------------------------------
     SORT LATEST FIRST
  -------------------------------- */

  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.data.updatedDate ?? b.data.date) -
      new Date(a.data.updatedDate ?? a.data.date)
  );

  /* --------------------------------
     LAST BUILD DATE
  -------------------------------- */

  const lastBuildDate =
    sortedPosts.length > 0
      ? new Date(
          sortedPosts[0].data.updatedDate ??
          sortedPosts[0].data.date
        ).toUTCString()
      : new Date().toUTCString();

  return rss({
    title: "Wikimint Blog",
    description: "Personal finance & business strategies in India",
    site: context.site,

    /* --------------------------------
       NAMESPACES
    -------------------------------- */

    xmlns: {
      atom: "http://www.w3.org/2005/Atom",
      media: "http://search.yahoo.com/mrss/",
    },

    /* --------------------------------
       CHANNEL LEVEL SEO DATA
    -------------------------------- */

    customData: `
      <language>en-IN</language>

      <lastBuildDate>${lastBuildDate}</lastBuildDate>

      <generator>Astro</generator>

      <atom:link
        href="${base}/rss.xml"
        rel="self"
        type="application/rss+xml" />

      <image>
        <title>Wikimint</title>
        <link>${base}</link>
        <url>${base}/assets/images/wikimint.webp</url>
      </image>
    `,

    /* --------------------------------
       POSTS
    -------------------------------- */

    items: sortedPosts.map((post) => {

      const modified =
        post.data.updatedDate ?? post.data.date;

      const url =
        `${base}/${post.slug}`.replace(/\/$/, "");

      /* IMAGE SUPPORT */
      const imageUrl = post.data.image
        ? `${base}/assets/images/blog/${post.data.image}`
        : null;

      return {
        title: post.data.title,
        description: post.data.description ?? "",
        pubDate: modified,

        link: url,
        guid: url,

        customData: imageUrl
          ? `
            <media:content
              url="${imageUrl}"
              medium="image" />

            <enclosure
              url="${imageUrl}"
              type="image/webp"
              length="0" />
          `
          : "",
      };
    }),
  });
}