import { NextResponse } from "next/server";
import { z } from "zod";
import { createProposal, listProposals } from "@/lib/store";

const UpgradeSchema = z.object({
  name: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
});

const BodySchema = z.object({
  upgrades: z.array(UpgradeSchema).min(1),
});

export async function GET() {
  return NextResponse.json({ proposals: listProposals() });
}

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const rec = createProposal(body.upgrades);
  return NextResponse.json({ ok: true, proposal: rec });
}

