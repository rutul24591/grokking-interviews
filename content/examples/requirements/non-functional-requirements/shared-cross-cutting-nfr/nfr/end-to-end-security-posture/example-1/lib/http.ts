import { NextResponse } from "next/server";

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
    {
      status,
      ...init,
      headers: { "Cache-Control": "no-store", ...(init?.headers || {}) },
    },
  );
}

export function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (!xf) return "local";
  const first = xf.split(",")[0]?.trim();
  return first || "local";
}

