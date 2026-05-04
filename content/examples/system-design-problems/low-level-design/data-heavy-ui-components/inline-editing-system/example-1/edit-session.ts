export type RowId = string;

export type Row = { id: RowId; [k: string]: unknown };

export type EditSession = {
  rowId: RowId;
  draft: Record<string, unknown>;
  startedAt: number;
  revision: number; // server revision at start
};

export type ValidationErrors = Record<string, string[]>;

export type RowValidator = (draft: Record<string, unknown>) => ValidationErrors;

export function beginEdit(row: Row, revision: number): EditSession {
  return { rowId: row.id, draft: { ...row }, startedAt: Date.now(), revision };
}

export function setDraftValue(s: EditSession, key: string, value: unknown): EditSession {
  return { ...s, draft: { ...s.draft, [key]: value } };
}

export function validate(session: EditSession, validator: RowValidator) {
  const errors = validator(session.draft);
  const ok = Object.values(errors).every((arr) => arr.length === 0);
  return { ok, errors };
}

export async function commit(args: {
  session: EditSession;
  validator: RowValidator;
  save: (rowId: RowId, patch: Record<string, unknown>, revision: number) => Promise<{ nextRevision: number }>;
}) {
  const checked = validate(args.session, args.validator);
  if (!checked.ok) return { ok: false as const, errors: checked.errors };
  const res = await args.save(args.session.rowId, args.session.draft, args.session.revision);
  return { ok: true as const, nextRevision: res.nextRevision };
}

