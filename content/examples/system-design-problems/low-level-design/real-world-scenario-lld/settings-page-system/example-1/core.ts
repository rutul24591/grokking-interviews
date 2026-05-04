export type Setting = { key: string; value: unknown; updatedAt: number };

export function applyChange(settings: Setting[], key: string, value: unknown) {
  const next = settings.map((s) => (s.key === key ? { ...s, value, updatedAt: Date.now() } : s));
  if (!next.find((s) => s.key === key)) next.push({ key, value, updatedAt: Date.now() });
  return next;
}
