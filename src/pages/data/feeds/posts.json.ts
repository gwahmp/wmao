import posts from "../../../data/feeds/posts.json";

export const prerender = true;

export async function GET() {
  return new Response(JSON.stringify(posts), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
