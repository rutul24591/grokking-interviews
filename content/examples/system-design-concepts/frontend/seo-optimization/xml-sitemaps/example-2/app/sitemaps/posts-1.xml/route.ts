import { NextResponse } from "next/server";
import { urlset } from "@/lib/xml";

export async function GET() {
  const xml = urlset([
    { loc: "http://localhost:3000/posts/p1", lastmod: "2026-03-24" },
    { loc: "http://localhost:3000/posts/p2", lastmod: "2026-03-24" }
  ]);
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

