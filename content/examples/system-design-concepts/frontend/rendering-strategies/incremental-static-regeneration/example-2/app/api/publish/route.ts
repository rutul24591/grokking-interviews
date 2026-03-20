import { NextResponse } from "next/server";

const globalForOrigin = globalThis as unknown as {
  __isrOrigin?: { version: number; updatedAt: string; message: string };
};
globalForOrigin.__isrOrigin ??= {
  version: 1,
  updatedAt: new Date().toISOString(),
  message: "Initial publish",
};

export async function POST() {
  globalForOrigin.__isrOrigin = {
    version: globalForOrigin.__isrOrigin.version + 1,
    updatedAt: new Date().toISOString(),
    message: "Published from /api/publish",
  };

  return NextResponse.json({ ok: true, version: globalForOrigin.__isrOrigin.version });
}

