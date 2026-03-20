import { NextResponse } from "next/server";

const globalForContent = globalThis as unknown as { __publicContent?: { version: number } };
globalForContent.__publicContent ??= { version: 1 };

export async function GET() {
  return NextResponse.json({
    version: globalForContent.__publicContent!.version,
    ts: new Date().toISOString(),
    message: "Shareable content for ISR",
  });
}

