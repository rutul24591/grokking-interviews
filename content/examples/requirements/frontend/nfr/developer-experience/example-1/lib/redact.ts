const SECRET_KEYS = new Set(["apiKey", "token", "password", "secret", "dsn"]);

export function redactObject(input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (SECRET_KEYS.has(k)) out[k] = "REDACTED";
    else out[k] = v;
  }
  return out;
}

