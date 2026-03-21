export type ApiVersion = 1 | 2;

export function parseVersion(req: Request): ApiVersion {
  const url = new URL(req.url);
  const qv = url.searchParams.get("v");
  if (qv === "1" || qv === "2") return Number(qv) as ApiVersion;

  const header = req.headers.get("x-api-version");
  if (header === "1" || header === "2") return Number(header) as ApiVersion;

  const accept = req.headers.get("accept") || "";
  // Vendor media type example: application/vnd.sdp.users.v2+json
  const m = accept.match(/vnd\.[^;]+\.v(\d+)\+json/i);
  if (m?.[1] === "1" || m?.[1] === "2") return Number(m[1]) as ApiVersion;

  return 2; // default to latest
}

export function versionHeaders(v: ApiVersion) {
  const headers: Record<string, string> = {
    "X-API-Version": String(v),
    Vary: "Accept, X-API-Version"
  };

  if (v === 1) {
    headers.Deprecation = "true";
    headers.Sunset = "Wed, 01 Jul 2026 00:00:00 GMT";
    headers.Link = '</docs/api/users/v2>; rel="successor-version"';
  }
  return headers;
}

