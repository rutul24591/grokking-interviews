export type MutationGuardInput = {
  method: string;
  origin: string | null;
  allowedOrigins: string[];
  secFetchSite: string | null;
  csrfHeader: string | null;
  expectedCsrfToken: string;
};

export type GuardResult =
  | { ok: true }
  | { ok: false; status: 403; reason: "bad_origin" | "cross_site" | "bad_csrf" };

export function enforceSameOriginCsrf(input: MutationGuardInput): GuardResult {
  const method = input.method.toUpperCase();
  const mutating = method !== "GET" && method !== "HEAD" && method !== "OPTIONS";
  if (!mutating) return { ok: true };

  if (input.origin && !input.allowedOrigins.includes(input.origin)) {
    return { ok: false, status: 403, reason: "bad_origin" };
  }

  if (input.secFetchSite === "cross-site") {
    return { ok: false, status: 403, reason: "cross_site" };
  }

  if (!input.csrfHeader || input.csrfHeader !== input.expectedCsrfToken) {
    return { ok: false, status: 403, reason: "bad_csrf" };
  }

  return { ok: true };
}

