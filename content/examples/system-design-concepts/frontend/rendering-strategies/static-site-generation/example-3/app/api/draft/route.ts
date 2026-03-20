import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const slug = url.searchParams.get("slug") ?? "hello-world";

  // Demo-only. In production, validate auth and use a stronger secret.
  if (secret !== "dev") {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  draftMode().enable();
  return NextResponse.redirect(new URL(`/posts/${encodeURIComponent(slug)}`, url));
}

