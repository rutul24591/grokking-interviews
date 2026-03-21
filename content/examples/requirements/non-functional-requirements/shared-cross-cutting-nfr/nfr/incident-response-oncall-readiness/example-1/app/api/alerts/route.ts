import { NextResponse } from "next/server";
import { z } from "zod";
import { ingestAlert } from "@/lib/store";

const BodySchema = z.object({
  fingerprint: z.string().min(3),
  severity: z.enum(["low", "medium", "high", "critical"]),
  summary: z.string().min(3).max(200),
  source: z.string().min(2).max(50).default("demo"),
});

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const r = ingestAlert(body);
  return NextResponse.json({
    ok: true,
    deduped: r.deduped,
    incidentId: r.incident.id,
    alertId: r.alert.id,
  });
}

