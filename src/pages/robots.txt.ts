import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return new Response(
`User-agent: *
Allow: /

Sitemap: https://wikimint.com/sitemap.xml
`, {
    headers: { "Content-Type": "text/plain" }
  });
};
