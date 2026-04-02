import { NextResponse } from "next/server";
import { createExperiment, listExperiments } from "@/lib/store";

export async function GET() {
  const experiments = await listExperiments();
  return NextResponse.json(experiments, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const created = await createExperiment(body);
  return NextResponse.json(created, { status: 201, headers: { "Cache-Control": "no-store" } });
}

