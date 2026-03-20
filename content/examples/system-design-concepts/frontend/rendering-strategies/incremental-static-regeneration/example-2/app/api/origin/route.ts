import { NextResponse } from "next/server";

type OriginState = {
  version: number;
  updatedAt: string;
  message: string;
};

// Demo-only: in real systems this would be a database/CMS.
const globalForOrigin = globalThis as unknown as { __isrOrigin?: OriginState };
globalForOrigin.__isrOrigin ??= {
  version: 1,
  updatedAt: new Date().toISOString(),
  message: "Initial publish",
};

export async function GET() {
  return NextResponse.json(globalForOrigin.__isrOrigin);
}

