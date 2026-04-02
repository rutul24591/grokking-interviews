import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const audience = url.searchParams.get("aud") ?? "default";
  // Demo token only (never do this in production).
  return NextResponse.json({ token: `demo-token:${audience}:${Date.now()}` });
}

