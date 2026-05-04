export type StorageKind = "memory" | "sessionStorage" | "httpOnlyCookie";

export type TokenBundle = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
};

export type TokenStore = {
  kind: StorageKind;
  load: () => TokenBundle | null;
  save: (t: TokenBundle) => void;
  clear: () => void;
};

export function createMemoryTokenStore(): TokenStore {
  let current: TokenBundle | null = null;
  return {
    kind: "memory",
    load: () => current,
    save: (t) => { current = t; },
    clear: () => { current = null; },
  };
}

export function needsRefresh(t: TokenBundle, now = Date.now()) {
  return t.expiresAt - now <= 30_000;
}
