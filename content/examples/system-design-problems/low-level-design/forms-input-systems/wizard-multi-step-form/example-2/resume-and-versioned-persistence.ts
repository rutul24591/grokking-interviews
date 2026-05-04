export type PersistedWizard<TValues> = {
  version: number;
  stepId: string;
  values: TValues;
  updatedAt: number;
};

export function safeLocalStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadWizard<TValues>(key: string, expectedVersion: number) {
  const ls = safeLocalStorage();
  if (!ls) return null;
  const raw = ls.getItem(key);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as PersistedWizard<TValues>;
  if (parsed.version !== expectedVersion) return null;
  return parsed;
}

export function saveWizard<TValues>(key: string, state: PersistedWizard<TValues>) {
  const ls = safeLocalStorage();
  if (!ls) return;
  ls.setItem(key, JSON.stringify(state));
}

