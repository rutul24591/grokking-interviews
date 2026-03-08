"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ArticleVersion } from "@/types/article";

const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

type ArticleState = {
  preferredVersion: ArticleVersion;
  setPreferredVersion: (version: ArticleVersion) => void;
};

export const useArticleStore = create<ArticleState>()(
  persist(
    (set) => ({
      preferredVersion: "concise",
      setPreferredVersion: (version) => set({ preferredVersion: version }),
    }),
    {
      name: "ips-article-preference",
      skipHydration: true,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : localStorage
      ),
    }
  )
);
