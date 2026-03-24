import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { strongEtag } from "@/lib/etag";

export async function GET(request: Request, { params }: { params: { name: string } }) {
  const { name } = params;

  const p = path.join(process.cwd(), "assets", name);
  if (!fs.existsSync(p)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const bytes = fs.readFileSync(p);
  const etag = strongEtag(bytes);

  const headers = new Headers();
  headers.set("Content-Type", "text/plain; charset=utf-8");
  headers.set("ETag", etag);
  // Stable URL: use revalidation instead of immutable caching.
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");

  const inm = request.headers.get("if-none-match");
  if (inm && inm === etag) {
    return new NextResponse(null, { status: 304, headers });
  }

  return new NextResponse(bytes, { status: 200, headers });
}
