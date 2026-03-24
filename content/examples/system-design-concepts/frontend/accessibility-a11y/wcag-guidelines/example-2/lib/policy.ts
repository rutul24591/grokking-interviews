import type { Inventory } from "@/lib/inventory";

export type Finding = {
  ruleId: string;
  severity: "error" | "warn";
  message: string;
  targetId: string;
};

export type Report = {
  summary: { errors: number; warnings: number };
  findings: Finding[];
};

function hasName(x: { label?: string; ariaLabel?: string }) {
  const a = x.ariaLabel?.trim();
  const l = x.label?.trim();
  return Boolean((l && l.length > 0) || (a && a.length > 0));
}

export function evaluate(inv: Inventory): Report {
  const findings: Finding[] = [];

  for (const b of inv.buttons) {
    if (!hasName(b)) {
      findings.push({
        ruleId: "button.name",
        severity: "error",
        message: "Button is missing label/aria-label.",
        targetId: b.id
      });
    }
  }

  for (const i of inv.inputs) {
    if (!i.label || i.label.trim().length === 0) {
      findings.push({
        ruleId: "form.label",
        severity: "error",
        message: "Input is missing a label.",
        targetId: i.id
      });
    }
  }

  for (const img of inv.images) {
    if (img.alt === undefined) {
      findings.push({
        ruleId: "img.alt",
        severity: "error",
        message: "Image is missing alt attribute.",
        targetId: img.id
      });
    }
  }

  const summary = {
    errors: findings.filter((f) => f.severity === "error").length,
    warnings: findings.filter((f) => f.severity === "warn").length
  };

  return { summary, findings };
}

