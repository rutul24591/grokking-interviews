import { NextResponse } from "next/server";
import { z } from "zod";
import { createChange, listChanges } from "@/lib/store";

const BodySchema = z.object({
  title: z.string().min(3).max(120),
  risk: z.enum(["low", "medium", "high", "critical"]),
  emergency: z.boolean().default(false),
  actor: z.string().default("author"),
});

export async function GET() {
  return NextResponse.json({ changes: listChanges() });
}

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const c = createChange(body);
  return NextResponse.json({ ok: true, change: c });
}

