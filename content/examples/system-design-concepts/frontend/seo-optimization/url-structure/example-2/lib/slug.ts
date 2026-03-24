const RESERVED = new Set(["admin", "api", "login", "signup"]);

export function slugify(input: string) {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "untitled";
}

export function uniqueSlug(base: string, existing: Set<string>) {
  let candidate = base;
  let i = 2;
  if (RESERVED.has(candidate)) candidate = `${candidate}-page`;
  while (existing.has(candidate)) {
    candidate = `${base}-${i++}`;
  }
  existing.add(candidate);
  return candidate;
}

