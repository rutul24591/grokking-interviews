import { NextResponse } from "next/server";
import { getConfig, setConfig } from "@/lib/store";

export async function GET() {
  const config = await getConfig();
  return NextResponse.json(config, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const current = await getConfig();
  const merged = {
    routing: { ...current.routing, ...(body?.routing ?? {}) },
    guardrails: { ...current.guardrails, ...(body?.guardrails ?? {}) },
    behavior: {
      baseline: {
        ...current.behavior.baseline,
        ...(body?.behavior?.baseline ?? {}),
      },
      canary: {
        ...current.behavior.canary,
        ...(body?.behavior?.canary ?? {}),
      },
    },
  };
  const updated = await setConfig(merged);
  return NextResponse.json(updated, { headers: { "Cache-Control": "no-store" } });
}
