import { getCollection } from "astro:content";

function escapeXML(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET({ site }) {
  const posts = await getCollection("posts");

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.date) - new Date(a.data.date)
  );

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXML("Wikimint Blog")}</title>
  <link href="${site}atom.xml" rel="self" />
  <link href="${site}" />
  <updated>${new Date().toISOString()}</updated>
  <id>${site}</id>
  ${sortedPosts
    .map(
      (post) => `
  <entry>
    <title>${escapeXML(post.data.title)}</title>
    <link href="${site}${post.slug}" />
    <id>${site}${post.slug}</id>
    <updated>${
      post.data.date
        ? new Date(post.data.date).toISOString()
        : new Date().toISOString()
    }</updated>
    <summary>${escapeXML(post.data.description ?? "")}</summary>
  </entry>`
    )
    .join("")}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
