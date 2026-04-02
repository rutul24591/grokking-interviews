import { z } from "zod";
import { createRequire } from "node:module";

export type AxeViolation = {
  id: string;
  impact: "minor" | "moderate" | "serious" | "critical" | null;
  help: string;
  helpUrl: string;
  nodes: Array<{
    target: string[];
    failureSummary?: string;
  }>;
};

export type AuditSummary = {
  auditedAt: string;
  totalViolations: number;
  byImpact: Record<"minor" | "moderate" | "serious" | "critical" | "unknown", number>;
  violations: AxeViolation[];
};

export const AuditRequestSchema = z.object({
  html: z.string().min(1),
  ruleset: z.enum(["wcag2aa"]).default("wcag2aa"),
});

function normalizeImpact(
  impact: AxeViolation["impact"],
): "minor" | "moderate" | "serious" | "critical" | "unknown" {
  return impact ?? "unknown";
}

export async function runA11yAudit(html: string): Promise<AuditSummary> {
  const require = createRequire(import.meta.url);
  // @axe-core/jsdom is CommonJS; use require for compatibility under ESM.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { JSDOM } = require("jsdom");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { configureAxe } = require("@axe-core/jsdom");

  const dom = new JSDOM(html, {
    pretendToBeVisual: true,
    url: "http://localhost/",
  });

  const axe = configureAxe(dom.window);
  const results = await axe.run(dom.window.document, {
    resultTypes: ["violations"],
  });

  const violations: AxeViolation[] = (results.violations || []).map((v: any) => ({
    id: String(v.id),
    impact: v.impact ?? null,
    help: String(v.help),
    helpUrl: String(v.helpUrl),
    nodes: (v.nodes || []).map((n: any) => ({
      target: Array.isArray(n.target) ? n.target.map(String) : [],
      failureSummary: n.failureSummary ? String(n.failureSummary) : undefined,
    })),
  }));

  const byImpact: AuditSummary["byImpact"] = {
    minor: 0,
    moderate: 0,
    serious: 0,
    critical: 0,
    unknown: 0,
  };

  for (const v of violations) byImpact[normalizeImpact(v.impact)]++;

  return {
    auditedAt: new Date().toISOString(),
    totalViolations: violations.length,
    byImpact,
    violations,
  };
}

