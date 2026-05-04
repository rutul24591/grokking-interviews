export type DocId = string;
export type Version = number;

export type Doc<T> = { id: DocId; version: Version; value: T; updatedAt: number };

export function applyIfNewer<T>(prev: Doc<T>, next: Doc<T>) {
  return next.version < prev.version ? prev : next;
}

export function makeLocalEdit<T>(doc: Doc<T>, patch: Partial<T>) {
  return { ...doc, version: doc.version + 1, value: { ...(doc.value as any), ...(patch as any) }, updatedAt: Date.now() };
}
