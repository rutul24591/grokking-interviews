import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ThirdPartyMessageSchema } from "@/lib/messages";
import { appendMetric } from "@/lib/metricsStore";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = ThirdPartyMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_message" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  appendMetric(parsed.data, {
    ip: req.headers.get("x-forwarded-for"),
    ua: req.headers.get("user-agent"),
  });

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

