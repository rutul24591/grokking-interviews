const KEY = "localstorage-example:v2";

export type DraftSettings = {
  draft: string;
  theme: "dark" | "light";
  fontScale: number;
};

const FALLBACK: DraftSettings = {
  draft: "",
  theme: "dark",
  fontScale: 100
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadSettings(): DraftSettings {
  if (!canUseLocalStorage()) return FALLBACK;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return FALLBACK;
    const parsed = JSON.parse(raw) as Partial<DraftSettings> & { version?: number };
    return {
      draft: typeof parsed.draft === "string" ? parsed.draft : "",
      theme: parsed.theme === "light" ? "light" : "dark",
      fontScale: typeof parsed.fontScale === "number" ? parsed.fontScale : 100
    };
  } catch {
    return FALLBACK;
  }
}

export function saveSettings(next: DraftSettings) {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(KEY, JSON.stringify({ version: 2, ...next }));
}

export function saveDraft(draft: string) {
  saveSettings({ ...loadSettings(), draft });
}

