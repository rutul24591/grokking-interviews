import crypto from "node:crypto";
import { NextResponse } from "next/server";

export function requestId(): string {
  return crypto.randomBytes(8).toString("hex");
}

export function jsonOk(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: { "Cache-Control": "no-store", ...(init?.headers || {}) },
  });
}

export function jsonError(
  status: number,
  code: string,
  details?: Record<string, unknown>,
  init?: ResponseInit,
) {
  return NextResponse.json(
    { error: code, ...(details ? { details } : {}) },
    { status, ...init, headers: { "Cache-Control": "no-store", ...(init?.headers || {}) } },
  );
}

