export const prerender = true;
export function GET() {
  return new Response(
`User-agent: *
Allow: /
Sitemap: https://www.wikimint.com/sitemap.xml
`, { headers: { "Content-Type": "text/plain" }});
}
