import { NextResponse } from "next/server";
import { getConfig, setConfig } from "@/lib/store";

export async function GET() {
  const config = await getConfig();
  return NextResponse.json(config, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const updated = await setConfig(body);
  return NextResponse.json(updated, { headers: { "Cache-Control": "no-store" } });
}

