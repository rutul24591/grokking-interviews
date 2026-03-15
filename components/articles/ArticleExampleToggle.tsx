"use client";

import { useCallback, useSyncExternalStore } from "react";
import { classNames } from "@/lib/classNames";

export type ArticleViewMode = "article" | "example";

type ArticleExampleToggleProps = {
  value: ArticleViewMode;
  onChange: (mode: ArticleViewMode) => void;
};

const STORAGE_KEY = "ips-article-view";
const EVENT_NAME = "ips-article-view-change";

function readStoredView(): ArticleViewMode {
  if (typeof window === "undefined") return "article";
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "example" || stored === "article") return stored;
  } catch {
    // ignore
  }
  return "article";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  // Useful if another tab/window changes a shared storage strategy.
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useArticleViewMode(): [ArticleViewMode, (mode: ArticleViewMode) => void] {
  const value = useSyncExternalStore<ArticleViewMode>(
    subscribe,
    readStoredView,
    () => "article"
  );
  const setValue = useCallback((mode: ArticleViewMode) => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(STORAGE_KEY, mode);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch {
      // ignore
    }
  }, []);

  return [value, setValue];
}

export function ArticleExampleToggle({ value, onChange }: ArticleExampleToggleProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-theme bg-panel p-1 shadow-soft-theme">
      <button
        type="button"
        onClick={() => onChange("article")}
        className={classNames(
          "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition",
          value === "article" ? "bg-accent text-white" : "text-muted hover:text-body"
        )}
      >
        Article
      </button>
      <button
        type="button"
        onClick={() => onChange("example")}
        className={classNames(
          "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition",
          value === "example" ? "bg-accent text-white" : "text-muted hover:text-body"
        )}
      >
        Example
      </button>
    </div>
  );
}
