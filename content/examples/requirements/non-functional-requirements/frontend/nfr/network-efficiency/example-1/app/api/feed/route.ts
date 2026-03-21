import { feedEtag, getFeed } from "@/lib/feed";

export async function GET(req: Request) {
  const { version, items } = getFeed();
  const etag = feedEtag(version);
  const inm = req.headers.get("if-none-match");
  if (inm && inm === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }

  const body = JSON.stringify({ version, items });
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
      ETag: etag,
    },
  });
}

