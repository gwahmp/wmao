import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return new Response(
`User-agent: *
Allow: /

Sitemap: /sitemap.xml
`, {
    headers: { "Content-Type": "text/plain" }
  });
};
