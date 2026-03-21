export type FieldType = "string" | "number" | "boolean" | "object";

export type Field = {
  name: string;
  type: FieldType;
  required: boolean;
};

export type Schema = { subject: string; version: number; fields: Field[]; createdAt: string };

function index(fields: Field[]) {
  const out = new Map<string, Field>();
  for (const f of fields) out.set(f.name, f);
  return out;
}

export function checkBackwardCompatible(prev: Field[], next: Field[]) {
  const p = index(prev);
  const n = index(next);

  // Cannot remove fields.
  for (const [name] of p.entries()) {
    if (!n.has(name)) return { ok: false as const, reason: `removed field '${name}'` };
  }

  // Cannot make optional -> required (breaks old producers or clients).
  for (const [name, pf] of p.entries()) {
    const nf = n.get(name)!;
    if (!pf.required && nf.required) return { ok: false as const, reason: `field '${name}' changed optional -> required` };
    if (pf.type !== nf.type) return { ok: false as const, reason: `field '${name}' changed type '${pf.type}' -> '${nf.type}'` };
  }

  // Cannot add new required fields (breaks old consumers for strict validation).
  for (const [name, nf] of n.entries()) {
    if (!p.has(name) && nf.required) return { ok: false as const, reason: `added new required field '${name}'` };
  }

  return { ok: true as const };
}

function validatePayload(fields: Field[], payload: any) {
  const errors: Array<{ field: string; error: string }> = [];
  const obj = payload && typeof payload === "object" ? payload : null;
  if (!obj) return [{ field: "$", error: "payload must be an object" }];

  for (const f of fields) {
    const v = (obj as any)[f.name];
    if (v == null) {
      if (f.required) errors.push({ field: f.name, error: "missing required field" });
      continue;
    }
    const t = typeof v;
    if (f.type === "object") {
      if (t !== "object") errors.push({ field: f.name, error: `expected object, got ${t}` });
    } else if (t !== f.type) {
      errors.push({ field: f.name, error: `expected ${f.type}, got ${t}` });
    }
  }
  return errors;
}

class Registry {
  private subjects = new Map<string, Schema[]>();

  register(subject: string, fields: Field[]) {
    const list = this.subjects.get(subject) ?? [];
    const prev = list.length ? list[list.length - 1]!.fields : null;
    if (prev) {
      const compat = checkBackwardCompatible(prev, fields);
      if (!compat.ok) return { ok: false as const, reason: compat.reason };
    }
    const schema: Schema = { subject, version: list.length + 1, fields, createdAt: new Date().toISOString() };
    list.push(schema);
    this.subjects.set(subject, list);
    return { ok: true as const, schema };
  }

  get(subject: string) {
    return this.subjects.get(subject) ?? [];
  }

  validate(subject: string, version: number, payload: unknown) {
    const schemas = this.get(subject);
    const schema = schemas.find((s) => s.version === version);
    if (!schema) return { ok: false as const, error: "schema_not_found" as const };
    const errors = validatePayload(schema.fields, payload);
    if (errors.length) return { ok: false as const, error: "validation_failed" as const, errors };
    return { ok: true as const };
  }
}

export const registry = new Registry();

