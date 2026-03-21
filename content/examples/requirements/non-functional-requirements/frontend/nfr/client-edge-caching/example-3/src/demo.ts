type Req = { path: string; headers: Record<string, string> };

function cacheKey(req: Req, vary: string[]): string {
  const parts = [req.path];
  for (const h of vary) parts.push(h + "=" + (req.headers[h.toLowerCase()] || ""));
  return parts.join("|");
}

const vary = ["accept-language"];

const a: Req = { path: "/home", headers: { "accept-language": "en-US" } };
const b: Req = { path: "/home", headers: { "accept-language": "fr-FR" } };

console.log(JSON.stringify({ keyA: cacheKey(a, vary), keyB: cacheKey(b, vary) }, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));

