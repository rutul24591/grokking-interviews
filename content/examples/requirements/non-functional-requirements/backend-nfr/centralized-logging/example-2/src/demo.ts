function redact(obj: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (["password", "token", "email"].includes(k.toLowerCase())) out[k] = "[redacted]";
    else out[k] = v;
  }
  return out;
}

const log = {
  level: "info",
  msg: "login",
  email: "alice@example.com",
  token: "secret",
  ip: "1.2.3.4"
};

console.log(JSON.stringify({ log, redacted: redact(log) }, null, 2));

