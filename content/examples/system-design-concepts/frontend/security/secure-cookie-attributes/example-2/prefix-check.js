function checkCookie({ name, attrs }) {
  const secure = attrs.includes("Secure");
  const hasDomain = attrs.some((a) => a.toLowerCase().startsWith("domain="));
  const path = attrs.find((a) => a.toLowerCase().startsWith("path=")) ?? "";

  if (name.startsWith("__Secure-")) return { ok: secure, reason: secure ? "ok" : "__Secure- requires Secure" };
  if (name.startsWith("__Host-")) {
    if (!secure) return { ok: false, reason: "__Host- requires Secure" };
    if (hasDomain) return { ok: false, reason: "__Host- must not include Domain" };
    if (path.toLowerCase() !== "path=/") return { ok: false, reason: "__Host- requires Path=/" };
    return { ok: true, reason: "ok" };
  }
  return { ok: true, reason: "no prefix rules" };
}

const samples = [
  { name: "__Host-session", attrs: ["Secure", "HttpOnly", "SameSite=Lax", "Path=/"] },
  { name: "__Host-session", attrs: ["HttpOnly", "SameSite=Lax", "Path=/"] },
  { name: "__Secure-token", attrs: ["Secure", "Path=/"] },
  { name: "__Secure-token", attrs: ["Path=/"] }
];

for (const s of samples) process.stdout.write(`${s.name} -> ${JSON.stringify(checkCookie(s))}\n`);

