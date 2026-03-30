import { NextResponse } from "next/server";

let attempts = 0;

export async function POST(request: Request) {
  attempts += 1;
  const body = await request.json();
  if (attempts % 2 === 1) {
    return NextResponse.json({ ok: false, body }, { status: 503 });
  }
  return NextResponse.json({ ok: true, body });
}
