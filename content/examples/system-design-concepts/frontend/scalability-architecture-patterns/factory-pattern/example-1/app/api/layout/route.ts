export async function GET() {
  return Response.json({
    widgets: [
      { type: "hero", title: "Server-driven UI", subtitle: "Factory maps widget type → implementation" },
      { type: "stat", label: "Build time", value: 1820 },
      { type: "stat", label: "p95 latency (ms)", value: 220 },
      { type: "cta", text: "Learn more", href: "https://example.com" }
    ]
  });
}

