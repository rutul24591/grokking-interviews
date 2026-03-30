function makePayload(version: string) {
  return {
    etag: `"feed-${version}"`,
    generatedAt: new Date().toISOString(),
    items: [
      `Version ${version}: top story`,
      `Version ${version}: trending interview topic`,
      `Version ${version}: recently updated article`
    ]
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const version = url.searchParams.get("version") || "v1";
  const payload = makePayload(version);
  const ifNoneMatch = req.headers.get("if-none-match");

  if (ifNoneMatch === payload.etag) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: payload.etag,
        "Cache-Control": "private, max-age=0, must-revalidate"
      }
    });
  }

  return Response.json(payload, {
    headers: {
      ETag: payload.etag,
      "Cache-Control": "private, max-age=0, must-revalidate"
    }
  });
}

