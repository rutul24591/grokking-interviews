export type Finding = {
  ruleId: string;
  message: string;
  selector: string;
};

function selectorFor(el: Element) {
  const id = (el as HTMLElement).id;
  if (id) return `#${id}`;
  const tag = el.tagName.toLowerCase();
  const cls = (el as HTMLElement).className?.toString()?.split(/\s+/).filter(Boolean).at(0);
  return cls ? `${tag}.${cls}` : tag;
}

function hasAccessibleName(el: Element) {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel && ariaLabel.trim().length > 0) return true;
  const text = (el.textContent ?? "").trim();
  return text.length > 0;
}

export function auditSubtree(root: HTMLElement): Finding[] {
  const out: Finding[] = [];
  const buttons = Array.from(root.querySelectorAll("button"));

  for (const b of buttons) {
    if (!b.hasAttribute("data-ds")) {
      out.push({
        ruleId: "ds.data-attribute",
        message: "DS element missing data-ds attribute (harder to audit at scale).",
        selector: selectorFor(b)
      });
    }
    if (!hasAccessibleName(b)) {
      out.push({
        ruleId: "a11y.button-name",
        message: "Button has no accessible name.",
        selector: selectorFor(b)
      });
    }
  }

  return out;
}

