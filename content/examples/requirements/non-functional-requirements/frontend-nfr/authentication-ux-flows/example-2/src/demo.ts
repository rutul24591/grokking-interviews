function validateReturnTo(returnTo: string, allowedOrigins: string[]): string | null {
  // Policy: allow only same-site relative paths. Block absolute URLs to prevent open redirect.
  if (!returnTo.startsWith("/")) return null;
  if (returnTo.startsWith("//")) return null;
  // Optionally allow a small set of known absolute origins (rarely needed).
  try {
    const u = new URL(returnTo);
    if (allowedOrigins.includes(u.origin)) return u.pathname + u.search + u.hash;
  } catch {
    // not a URL; that's fine for relative paths
  }
  return returnTo;
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

const allowed = ["https://app.example.com"];

assert(validateReturnTo("/dashboard", allowed) === "/dashboard", "allow relative path");
assert(validateReturnTo("https://evil.com/phish", allowed) === null, "block absolute URL");
assert(validateReturnTo("//evil.com/phish", allowed) === null, "block scheme-relative");
assert(validateReturnTo("dashboard", allowed) === null, "block non-path");

console.log(JSON.stringify({ ok: true }, null, 2));

