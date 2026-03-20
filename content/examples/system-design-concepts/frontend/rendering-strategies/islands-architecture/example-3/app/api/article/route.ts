import { NextResponse } from "next/server";

function makeLargeBody() {
  return (
    "This is a simulated large article body. ".repeat(900) +
    "In production, avoid passing huge serialized objects into client islands."
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = (url.searchParams.get("id") ?? "a-1").slice(0, 32);
  return NextResponse.json({ id, body: makeLargeBody() });
}

