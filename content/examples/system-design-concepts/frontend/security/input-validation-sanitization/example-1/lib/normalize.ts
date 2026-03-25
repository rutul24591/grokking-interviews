export function normalizeText(input: string) {
  // Canonicalize unicode and remove control characters (keep newlines).
  const normalized = input.normalize("NFKC");
  return normalized.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

