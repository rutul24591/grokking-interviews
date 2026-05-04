const SECRET_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /ssn/i,
  /credit/i,
  /card/i,
];

export function shouldRedactField(labelOrId: string) {
  return SECRET_PATTERNS.some((r) => r.test(labelOrId));
}

export function redactSnapshot(snapshot: {
  fields: Record<string, { label: string; value: unknown }>;
  locale: string;
}) {
  const redacted: typeof snapshot = { ...snapshot, fields: { ...snapshot.fields } };
  for (const [id, f] of Object.entries(snapshot.fields)) {
    if (shouldRedactField(id) || shouldRedactField(f.label)) {
      redacted.fields[id] = { ...f, value: "[REDACTED]" };
    }
  }
  return redacted;
}

