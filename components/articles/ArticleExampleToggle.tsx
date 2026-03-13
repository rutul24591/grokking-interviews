"use client";

import { useEffect, useState } from "react";
import { classNames } from "@/lib/classNames";

export type ArticleViewMode = "article" | "example";

type ArticleExampleToggleProps = {
  value: ArticleViewMode;
  onChange: (mode: ArticleViewMode) => void;
};

const STORAGE_KEY = "ips-article-view";

export function ArticleExampleToggle({ value, onChange }: ArticleExampleToggleProps) {
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
  }, [value]);

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

export function useInitialArticleView(): ArticleViewMode {
  const [value, setValue] = useState<ArticleViewMode>("article");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored === "example" || stored === "article") {
        setValue(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  return value;
}
