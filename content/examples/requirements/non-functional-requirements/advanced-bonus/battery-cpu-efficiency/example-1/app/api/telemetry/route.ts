import { NextResponse } from "next/server";
import { z } from "zod";
import { recordTelemetry } from "@/lib/store";

const BodySchema = z.object({
  type: z.enum(["longtask", "poll"]),
  durationMs: z.number().optional(),
  status: z.number().int().optional(),
  bytes: z.number().int().optional(),
  mode: z.enum(["naive", "optimized"]).optional(),
});

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const ts = new Date().toISOString();

  if (body.type === "longtask") {
    recordTelemetry({ type: "longtask", durationMs: body.durationMs ?? 0, ts });
  } else {
    recordTelemetry({
      type: "poll",
      status: body.status ?? 0,
      bytes: body.bytes ?? 0,
      ts,
      mode: body.mode ?? "naive",
    });
  }

  return NextResponse.json({ ok: true });
}

