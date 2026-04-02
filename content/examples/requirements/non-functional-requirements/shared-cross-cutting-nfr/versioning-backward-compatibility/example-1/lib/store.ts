import type { ProfileV2 } from "./contracts";

type Store = {
  profile: ProfileV2;
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__VER_STORE__ as Store | undefined) ?? {
    profile: { id: "u-1", displayName: "Ada", name: "Ada", locale: "en" },
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__VER_STORE__ = store;

export function getProfile(): ProfileV2 {
  return store.profile;
}

export function setProfile(p: ProfileV2) {
  store.profile = p;
}

