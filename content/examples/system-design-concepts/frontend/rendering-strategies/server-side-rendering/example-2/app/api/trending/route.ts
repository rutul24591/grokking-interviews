import { NextResponse } from "next/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  await sleep(420);
  return NextResponse.json({
    source: "trending",
    items: ["SSR fundamentals", "Hydration", "Caching", "TTFB and waterfalls"],
    ts: new Date().toISOString(),
  });
}

