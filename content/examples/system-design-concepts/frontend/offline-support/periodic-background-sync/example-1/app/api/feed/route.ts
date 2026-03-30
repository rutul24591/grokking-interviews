export async function GET(req: Request) {
  const url = new URL(req.url);
  const reason = url.searchParams.get("reason") || "unknown";

  return Response.json({
    generatedAt: new Date().toISOString(),
    policy: reason,
    items: [
      { id: "1", title: "Homepage hero content", freshnessHint: "Refresh on visible or periodic budget" },
      { id: "2", title: "Recommended interviews", freshnessHint: "Cheap to refresh; cache aggressively" },
      { id: "3", title: "Team activity feed", freshnessHint: "Needs freshness, but should not burn battery" }
    ]
  });
}

