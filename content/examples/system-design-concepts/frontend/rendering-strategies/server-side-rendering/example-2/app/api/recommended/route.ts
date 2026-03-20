import { NextResponse } from "next/server";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  await sleep(360);
  return NextResponse.json({
    source: "recommended",
    items: ["Promise.all", "Request coalescing", "Avoiding cache leaks"],
    ts: new Date().toISOString(),
  });
}

