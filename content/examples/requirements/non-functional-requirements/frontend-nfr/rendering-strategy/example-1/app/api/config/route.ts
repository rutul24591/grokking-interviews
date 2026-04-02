import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";

export async function GET() {
  // Example: CDN-cacheable config for many users (no personalization).
  return NextResponse.json(getConfig(), {
    headers: {
      "Cache-Control": "public, max-age=30, stale-while-revalidate=60"
    }
  });
}

