export type Doc = {
  title: string;
  body: string;
  tags: string;
};

export type Conflict = {
  field: keyof Doc;
  ancestor: string;
  local: string;
  server: string;
};

export type MergeResult = {
  merged: Doc;
  autoResolved: Array<keyof Doc>;
  conflicts: Conflict[];
};

export function createDraft(base: Doc, patch: Partial<Doc>): Doc {
  return { ...base, ...patch };
}

function valueChanged(a: string, b: string) {
  return a !== b;
}

export function mergeDocuments(ancestor: Doc, local: Doc, server: Doc): MergeResult {
  const merged: Doc = { ...ancestor };
  const autoResolved: Array<keyof Doc> = [];
  const conflicts: Conflict[] = [];

  (Object.keys(ancestor) as Array<keyof Doc>).forEach((field) => {
    const ancestorValue = ancestor[field];
    const localValue = local[field];
    const serverValue = server[field];

    const localChanged = valueChanged(localValue, ancestorValue);
    const serverChanged = valueChanged(serverValue, ancestorValue);

    if (!localChanged && !serverChanged) return;
    if (localChanged && !serverChanged) {
      merged[field] = localValue;
      autoResolved.push(field);
      return;
    }
    if (!localChanged && serverChanged) {
      merged[field] = serverValue;
      autoResolved.push(field);
      return;
    }
    if (localValue === serverValue) {
      merged[field] = localValue;
      autoResolved.push(field);
      return;
    }

    conflicts.push({
      field,
      ancestor: ancestorValue,
      local: localValue,
      server: serverValue
    });
  });

  return { merged, autoResolved, conflicts };
}

export function applyConflictChoice(
  result: MergeResult,
  field: keyof Doc,
  winner: "local" | "server"
): MergeResult {
  const conflict = result.conflicts.find((entry) => entry.field === field);
  if (!conflict) return result;

  return {
    merged: {
      ...result.merged,
      [field]: winner === "local" ? conflict.local : conflict.server
    },
    autoResolved: result.autoResolved.includes(field) ? result.autoResolved : [...result.autoResolved, field],
    conflicts: result.conflicts.filter((entry) => entry.field !== field)
  };
}

