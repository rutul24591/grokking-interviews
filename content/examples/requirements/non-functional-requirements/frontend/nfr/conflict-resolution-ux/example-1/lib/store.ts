export type Doc = { id: string; version: number; content: string; updatedAtMs: number };

let doc: Doc = {
  id: "doc-1",
  version: 0,
  content: "Hello.\n\nEdit me in two tabs to trigger a conflict.\n",
  updatedAtMs: Date.now(),
};

export function getDoc(): Doc {
  return doc;
}

export function reset() {
  doc = {
    id: "doc-1",
    version: 0,
    content: "Hello.\n\nEdit me in two tabs to trigger a conflict.\n",
    updatedAtMs: Date.now(),
  };
}

export function updateDoc(
  baseVersion: number,
  nextContent: string,
  opts?: { force?: boolean },
): { ok: true; doc: Doc } | { ok: false; reason: "conflict"; doc: Doc } {
  if (!opts?.force && baseVersion !== doc.version) return { ok: false, reason: "conflict", doc };
  doc = { ...doc, version: doc.version + 1, content: nextContent, updatedAtMs: Date.now() };
  return { ok: true, doc };
}

