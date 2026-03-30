function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push("Secure");
  if (options.httpOnly) parts.push("HttpOnly");
  return parts.join("; ");
}

function parseCookieHeader(header) {
  return Object.fromEntries(
    header.split("; ").map((entry) => {
      const idx = entry.indexOf("=");
      return [entry.slice(0, idx), decodeURIComponent(entry.slice(idx + 1))];
    })
  );
}

const serialized = serializeCookie("theme", "dark", {
  maxAge: 3600,
  path: "/",
  sameSite: "Lax",
  secure: true
});
console.log(serialized);
console.log(parseCookieHeader("theme=dark; role=staff"));

