import { NextResponse } from "next/server";
import { sitemapIndex } from "@/lib/xml";

export async function GET() {
  const xml = sitemapIndex([
    { loc: "http://localhost:3000/sitemaps/posts-1.xml" },
    { loc: "http://localhost:3000/sitemaps/posts-2.xml" }
  ]);
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

