const ALLOWED_OG_PATHS = new Set<string>([
  "/api/og-default",
  "/api/og-tenant"
]);

export function allowlistedOgImage(path: string) {
  return ALLOWED_OG_PATHS.has(path) ? path : "/api/og-default";
}

