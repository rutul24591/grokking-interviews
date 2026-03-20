import { NextResponse } from "next/server";
import { z } from "zod";
import { getVariant } from "@/lib/variants";
import { runA11yAudit } from "@/lib/audit";
import { listBaselines, setBaseline } from "@/lib/store";

const CaptureSchema = z.object({
  variantId: z.string().min(1),
});

export async function GET() {
  return NextResponse.json({ baselines: listBaselines() });
}

export async function POST(req: Request) {
  const body = CaptureSchema.parse(await req.json());
  const variant = getVariant(body.variantId);
  if (!variant) return NextResponse.json({ error: "Unknown variant" }, { status: 404 });

  const summary = await runA11yAudit(variant.html);
  setBaseline({
    variantId: variant.id,
    capturedAt: new Date().toISOString(),
    summary,
  });

  return NextResponse.json({ ok: true, variantId: variant.id });
}

