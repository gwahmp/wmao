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

  // ✅ newest first using updatedDate if exists
  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.data.updatedDate ?? b.data.date) -
      new Date(a.data.updatedDate ?? a.data.date)
  );

  // ✅ feed updated = latest article update
  const lastUpdated =
    sortedPosts.length > 0
      ? new Date(
          sortedPosts[0].data.updatedDate ??
          sortedPosts[0].data.date
        ).toISOString()
      : new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="utf-8"?>

<feed
 xmlns="http://www.w3.org/2005/Atom"
 xmlns:media="http://search.yahoo.com/mrss/">

  <title>${escapeXML("Wikimint Blog")}</title>

  <!-- Google Feed Discovery -->
  <link
    href="${site}atom.xml"
    rel="self"
    type="application/atom+xml"/>

  <link
    href="${site}"
    rel="alternate"
    type="text/html"/>

  <id>${site}</id>

  <updated>${lastUpdated}</updated>

  <author>
    <name>Wikimint</name>
    <uri>${site}</uri>
  </author>

  <!-- Branding -->
  <icon>${site}favicon.ico</icon>

  <logo>${site}assets/images/wikimint.webp</logo>

${sortedPosts
  .map((post) => {

    const postUrl =
      `${site}${post.slug}`.replace(/\/$/, "");

    const updatedDate = new Date(
      post.data.updatedDate ?? post.data.date
    ).toISOString();

    const imageUrl =
      `${site}assets/images/blog/${post.slug}.webp`;

    return `
  <entry>

    <title>${escapeXML(post.data.title)}</title>

    <link
      href="${postUrl}"
      rel="alternate"
      type="text/html"/>

    <id>${postUrl}</id>

    <updated>${updatedDate}</updated>

    <summary>
${escapeXML(post.data.description ?? "")}
    </summary>

    <media:content
      url="${imageUrl}"
      medium="image"
      type="image/webp" />
    <author>
      <name>Selvakumaran Krishnan</name>
    </author>

  </entry>`;
  })
  .join("")}

</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}