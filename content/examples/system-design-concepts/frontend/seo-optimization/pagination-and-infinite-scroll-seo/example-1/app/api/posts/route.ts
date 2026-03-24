import { NextResponse } from "next/server";
import { listPosts } from "@/lib/posts";

export async function GET(request: Request) {
  const u = new URL(request.url);
  const page = Number(u.searchParams.get("page") ?? "1");
  const pageSize = Number(u.searchParams.get("pageSize") ?? "10");
  const data = await listPosts(page, pageSize);
  return NextResponse.json({ page, pageSize, ...data });
}

