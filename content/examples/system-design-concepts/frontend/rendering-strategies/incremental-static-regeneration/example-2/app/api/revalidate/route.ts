import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  revalidateTag("content");
  return NextResponse.json({ ok: true, revalidated: "content" });
}

