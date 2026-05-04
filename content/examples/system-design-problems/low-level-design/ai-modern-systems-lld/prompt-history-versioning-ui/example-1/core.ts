export type PromptVersion = { id: string; createdAt: number; content: string; notes?: string };

export type PromptHistory = { promptId: string; versions: PromptVersion[] };

export function addVersion(h: PromptHistory, content: string, notes?: string) {
  const v: PromptVersion = { id: `v:${Date.now()}`, createdAt: Date.now(), content, notes };
  return { ...h, versions: [v, ...h.versions] };
}

export function diff(a: string, b: string) {
  // simplified diff marker for interview discussion
  return { before: a, after: b };
}
