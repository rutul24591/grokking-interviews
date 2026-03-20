type Pattern = { id: string; html: string };

export type Finding = { patternId: string; rule: string; message: string };

function hasLabelFor(html: string): boolean {
  const labelFor = /<label[^>]*for=["']([^"']+)["'][^>]*>/i.exec(html)?.[1];
  if (!labelFor) return false;
  const idRe = new RegExp(
    "<(?:input|select|textarea)[^>]*id=[\"']" + labelFor + "[\"']",
    "i",
  );
  return idRe.test(html);
}

function hasButtonType(html: string): boolean {
  const buttons = [...html.matchAll(/<button([^>]*)>/gi)];
  if (!buttons.length) return true;
  return buttons.every((b) => /type\s*=\s*["'](button|submit|reset)["']/i.test(b[1] || ""));
}

function dialogHasAria(html: string): boolean {
  if (!/role\s*=\s*["']dialog["']/i.test(html)) return true;
  const labelled = /aria-labelledby\s*=\s*["'][^"']+["']/i.test(html);
  const described = /aria-describedby\s*=\s*["'][^"']+["']/i.test(html);
  return labelled && described;
}

export function auditPatterns(patterns: Pattern[]): Finding[] {
  const out: Finding[] = [];
  for (const p of patterns) {
    if (/<(input|select|textarea)\b/i.test(p.html) && !hasLabelFor(p.html)) {
      out.push({
        patternId: p.id,
        rule: "form-control-has-label",
        message: "Associate controls with <label for=...> (screen reader naming).",
      });
    }
    if (!hasButtonType(p.html)) {
      out.push({
        patternId: p.id,
        rule: "button-has-explicit-type",
        message: "Buttons inside forms should have an explicit type to avoid accidental submits.",
      });
    }
    if (!dialogHasAria(p.html)) {
      out.push({
        patternId: p.id,
        rule: "dialog-has-aria-labels",
        message: "Dialogs should include aria-labelledby and aria-describedby.",
      });
    }
  }
  return out;
}

