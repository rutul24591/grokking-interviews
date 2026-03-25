export function buildCsp({ nonce }: { nonce: string }) {
  // Keep this focused: nonce-based inline scripts allowed, everything else locked down.
  const directives = [
    "default-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src 'nonce-${nonce}'`,
    "img-src 'self' data:",
    "style-src 'self'",
    "connect-src 'self'"
  ];
  return directives.join("; ");
}

