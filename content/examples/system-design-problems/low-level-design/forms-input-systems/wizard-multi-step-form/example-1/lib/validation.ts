export type FieldErrors = Record<string, string[]>;

export function isValid(errors: FieldErrors) {
  return Object.values(errors).every((arr) => arr.length === 0);
}

export function mergeErrors(a: FieldErrors, b: FieldErrors): FieldErrors {
  const out: FieldErrors = { ...a };
  for (const [k, msgs] of Object.entries(b)) out[k] = [...(out[k] ?? []), ...msgs];
  return out;
}

