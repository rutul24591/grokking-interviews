function scrub(payload) {
  return Object.fromEntries(Object.entries(payload).map(([key, value]) => {
    if (typeof value !== "string") return [key, value];
    if (/^[^@]+@[^@]+\.[^@]+$/.test(value)) return [key, "[redacted-email]"];
    if (/^\d+\.\d+\.\d+\.\d+$/.test(value)) return [key, "[redacted-ip]"];
    return [key, value];
  }));
}

console.log(scrub({ email: "reader@example.com", ip: "192.168.0.4", article: "oauth" }));
