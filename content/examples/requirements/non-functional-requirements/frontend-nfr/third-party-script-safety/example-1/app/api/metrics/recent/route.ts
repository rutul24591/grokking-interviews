import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { listRecent } from "@/lib/metricsStore";

function limitFromParam(value: string | null) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 10;
  return Math.max(1, Math.min(50, Math.floor(parsed)));
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = limitFromParam(url.searchParams.get("limit"));
  return NextResponse.json({ ok: true, items: listRecent(limit) }, { headers: { "Cache-Control": "no-store" } });
}

