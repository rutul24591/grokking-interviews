import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(500).default(120),
});

type Row = { index: number; label: string; hash: number };

function hashForIndex(index: number) {
  // Cheap deterministic hash to simulate IDs coming from a datastore.
  return (index * 2654435761) >>> 0;
}

function buildRows(offset: number, limit: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < limit; i++) {
    const index = offset + i;
    rows.push({ index, label: `Row #${index + 1}`, hash: hashForIndex(index) });
  }
  return rows;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_query" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const total = 10_000;
  const { offset, limit } = parsed.data;
  const safeOffset = Math.min(offset, total);
  const safeLimit = Math.max(0, Math.min(limit, total - safeOffset));

  return NextResponse.json(
    { ok: true, total, offset: safeOffset, limit: safeLimit, rows: buildRows(safeOffset, safeLimit) },
    {
      headers: {
        // Deterministic + safe to cache. In real systems, include tenant/user in the key.
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    }
  );
}

