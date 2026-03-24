// Minimal sanitizer for demo purposes.
// In production, use a battle-tested sanitizer and a strict allowlist.
export function sanitizeSvg(input: string): string {
  let s = input;

  // Remove scripts.
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

  // Remove event handler attributes (onload, onclick, ...).
  s = s.replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "");

  // Remove javascript: URLs.
  s = s.replace(/(href|xlink:href)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "");

  // Basic XML/doctype stripping.
  s = s.replace(/<\?xml[^>]*>/g, "").replace(/<!doctype[^>]*>/gi, "");

  return s.trim();
}

