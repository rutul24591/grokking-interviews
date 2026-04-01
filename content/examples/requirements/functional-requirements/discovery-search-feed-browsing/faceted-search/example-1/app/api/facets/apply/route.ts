import { NextRequest, NextResponse } from "next/server";

const dataset = [
  { id: "1", title: "SSR basics", level: "intermediate", category: "frontend" },
  { id: "2", title: "Feed ranking", level: "advanced", category: "backend" },
  { id: "3", title: "Caching strategy", level: "beginner", category: "backend" },
  { id: "4", title: "Search UI", level: "intermediate", category: "frontend" }
];

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { level: string; category: string };
  const results = dataset.filter((item) => (body.level === "all" || item.level === body.level) && (body.category === "all" || item.category === body.category));
  return NextResponse.json({
    applied: body,
    available: { level: ["all", "beginner", "intermediate", "advanced"], category: ["all", "frontend", "backend"] },
    results,
    counts: {
      level: { beginner: 1, intermediate: 2, advanced: 1 },
      category: { frontend: 2, backend: 2 }
    },
    lastMessage: results.length ? `Applied ${body.level}/${body.category} facets.` : "No results match the selected facets."
  });
}
