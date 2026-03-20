import { NextResponse } from "next/server";

export function jsonOk(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: { "Cache-Control": "no-store", ...(init?.headers || {}) },
  });
}

export function jsonError(status: number, code: string, details?: Record<string, unknown>) {
  return NextResponse.json(
    { error: code, ...(details ? { details } : {}) },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

