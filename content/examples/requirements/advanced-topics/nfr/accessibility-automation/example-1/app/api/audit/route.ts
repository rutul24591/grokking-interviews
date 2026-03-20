import { NextResponse } from "next/server";
import { z } from "zod";
import { getVariant } from "@/lib/variants";
import { AuditRequestSchema, runA11yAudit } from "@/lib/audit";
import { getBaseline } from "@/lib/store";

const QuerySchema = z.object({
  variantId: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  const body = AuditRequestSchema.parse(await req.json());
  const summary = await runA11yAudit(body.html);
  return NextResponse.json({ summary });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = QuerySchema.parse(Object.fromEntries(url.searchParams.entries()));
  if (!query.variantId) {
    return NextResponse.json(
      { error: "Missing variantId" },
      { status: 400 },
    );
  }

  const variant = getVariant(query.variantId);
  if (!variant) {
    return NextResponse.json({ error: "Unknown variant" }, { status: 404 });
  }

  const summary = await runA11yAudit(variant.html);
  const baseline = getBaseline(variant.id);

  return NextResponse.json({
    variant: { id: variant.id, name: variant.name, description: variant.description },
    summary,
    baseline: baseline ? { capturedAt: baseline.capturedAt, summary: baseline.summary } : null,
    delta: baseline
      ? {
          newViolations: Math.max(0, summary.totalViolations - baseline.summary.totalViolations),
          byImpactDelta: {
            minor: summary.byImpact.minor - baseline.summary.byImpact.minor,
            moderate: summary.byImpact.moderate - baseline.summary.byImpact.moderate,
            serious: summary.byImpact.serious - baseline.summary.byImpact.serious,
            critical: summary.byImpact.critical - baseline.summary.byImpact.critical,
            unknown: summary.byImpact.unknown - baseline.summary.byImpact.unknown,
          },
        }
      : null,
  });
}

