import { getCollection } from "astro:content";
import fs from "node:fs";
import path from "node:path";

export async function GET() {

  const base = "https://www.wikimint.com";
  let urls = [];

  /* --------------------------------
     AUTO LOAD ALL ASTRO PAGES
  -------------------------------- */

  const pagesDir = path.resolve("src/pages");

  function getPages(dir) {

    const files = fs.readdirSync(dir);

    files.forEach((file) => {

      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      /* recursive folders */
      if (stat.isDirectory()) {
        getPages(fullPath);
        return;
      }

      if (
        file.endsWith(".astro") &&
        !file.startsWith("[") &&
        file !== "404.astro"
      ) {

        let route = fullPath
          .replace(pagesDir, "")
          .replace(/index\.astro$/, "")
          .replace(/\.astro$/, "")
          .replace(/\\/g, "/");

        if (route.endsWith("/")) {
          route = route.slice(0, -1);
        }

        const content = fs.readFileSync(fullPath, "utf8");

        /* skip noindex */
        if (/noindex\s*:\s*true/.test(content)) return;

        /* detect date */
        const dateMatch = content.match(
          /date\s*:\s*["']?([0-9\-T:\.Z]+)["']?/
        );

        const pageDate = dateMatch
          ? new Date(dateMatch[1])
          : new Date();

        /* homepage logic */
        const isHome = route === "";

        const changefreq = isHome ? "daily" : "weekly";
        const priority = isHome ? "1.0" : "0.8";

        /* detect image frontmatter */
        const imageMatch = content.match(
          /image\s*:\s*["']?([^"'\n]+)["']?/
        );

        const imageTag = imageMatch
          ? `
  <image:image>
    <image:loc>${base}${imageMatch[1]}</image:loc>
  </image:image>`
          : "";

        urls.push(`
<url>
  <loc>${base}${route}</loc>
  <lastmod>${pageDate.toISOString()}</lastmod>
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
  ${imageTag}
</url>
`);
      }
    });
  }

  getPages(pagesDir);


  /* --------------------------------
     BLOG POSTS
  -------------------------------- */

  const posts = await getCollection("posts");

  posts.forEach((post) => {

    if (post.data.noindex === true) return;

    const modified =
      post.data.updatedDate ??
      post.data.date;

    const imageTag = post.data.image
      ? `
  <image:image>
    <image:loc>${base}/assets/images/blog/${post.data.image}</image:loc>
  </image:image>`
      : "";

    urls.push(`
<url>
  <loc>${base}/${post.slug}</loc>
  <lastmod>${modified.toISOString()}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
  ${imageTag}
</url>
`);
  });


  /* --------------------------------
     CATEGORIES
  -------------------------------- */

  const categories = await getCollection("categories");

  categories.forEach((cat) => {

    if (cat.data.noindex === true) return;

    const modified =
      cat.data.updatedDate ??
      cat.data.date ??
      new Date();

    urls.push(`
<url>
  <loc>${base}/${cat.slug}</loc>
  <lastmod>${modified.toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
`);
  });


  /* --------------------------------
     FINAL XML
  -------------------------------- */

  return new Response(
`<?xml version="1.0" encoding="UTF-8"?>
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${urls.join("")}

</urlset>`,
{
headers:{
  "Content-Type":"application/xml"
}
});
}