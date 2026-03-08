"use client";

import { useRouter, usePathname } from "next/navigation";
import { useArticleStore } from "@/features/articles/article.store";
import type { ArticleVersion } from "@/types/article";
import { useEffect } from "react";

type VersionToggleProps = {
  currentVersion: ArticleVersion;
};

export function VersionToggle({ currentVersion }: VersionToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { preferredVersion, setPreferredVersion } = useArticleStore();

  // Sync preferred version with current version
  useEffect(() => {
    if (currentVersion !== preferredVersion) {
      setPreferredVersion(currentVersion);
    }
  }, [currentVersion, preferredVersion, setPreferredVersion]);

  const handleToggle = (version: ArticleVersion) => {
    if (version === currentVersion) return;

    setPreferredVersion(version);

    // Toggle between concise and extensive versions
    if (version === "extensive") {
      // Add /extensive to the path
      router.push(`${pathname}/extensive`);
    } else {
      // Remove /extensive from the path
      const newPath = pathname.replace(/\/extensive$/, "");
      router.push(newPath);
    }
  };

  return (
    <div className="inline-flex items-center rounded-full border border-theme bg-panel p-1 shadow-soft-theme">
      <button
        type="button"
        onClick={() => handleToggle("concise")}
        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
          currentVersion === "concise"
            ? "bg-accent text-white"
            : "text-muted hover:text-body"
        }`}
      >
        Concise
      </button>
      <button
        type="button"
        onClick={() => handleToggle("extensive")}
        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
          currentVersion === "extensive"
            ? "bg-accent text-white"
            : "text-muted hover:text-body"
        }`}
      >
        Extensive
      </button>
    </div>
  );
}
