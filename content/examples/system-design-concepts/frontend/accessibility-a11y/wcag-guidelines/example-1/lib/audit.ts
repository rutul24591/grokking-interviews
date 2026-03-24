export type AuditFinding = {
  ruleId: string;
  severity: "error" | "warn";
  message: string;
};

function hasAccessibleName(el: Element) {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel && ariaLabel.trim().length > 0) return true;
  const text = (el.textContent ?? "").trim();
  return text.length > 0;
}

export function runAudit(root: HTMLElement): AuditFinding[] {
  const out: AuditFinding[] = [];

  // 1) Skip link present.
  const skip = root.querySelector('a[href^="#"]');
  if (!skip) out.push({ ruleId: "nav.skip-link", severity: "warn", message: "No skip link found." });

  // 2) Inputs need labels.
  const inputs = Array.from(root.querySelectorAll("input"));
  for (const input of inputs) {
    const id = input.getAttribute("id");
    const hasLabel = id ? Boolean(root.querySelector(`label[for="${CSS.escape(id)}"]`)) : false;
    if (!hasLabel) out.push({ ruleId: "form.label", severity: "error", message: "Input is missing an associated label." });
  }

  // 3) Buttons need accessible name.
  const buttons = Array.from(root.querySelectorAll("button"));
  for (const b of buttons) {
    if (!hasAccessibleName(b)) out.push({ ruleId: "button.name", severity: "error", message: "Button has no accessible name." });
  }

  // 4) Images should have alt (empty allowed only for decorative, but keep simple here).
  const imgs = Array.from(root.querySelectorAll("img"));
  for (const img of imgs) {
    if (!img.hasAttribute("alt")) out.push({ ruleId: "img.alt", severity: "error", message: "Image missing alt attribute." });
  }

  return out;
}

