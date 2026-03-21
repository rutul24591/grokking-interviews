import { NextResponse } from "next/server";
import { getConfig, setConfig, ConfigSchema } from "@/lib/store";

export async function GET() {
  const config = await getConfig();
  return NextResponse.json(config, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const current = await getConfig();
  const merged = {
    ...current,
    ...body,
    tenants: { ...current.tenants, ...(body?.tenants ?? {}) },
  };
  const updated = await setConfig(ConfigSchema.parse(merged));
  return NextResponse.json(updated, { headers: { "Cache-Control": "no-store" } });
}

