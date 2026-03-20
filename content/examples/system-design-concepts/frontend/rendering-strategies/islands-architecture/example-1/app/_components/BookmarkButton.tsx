"use client";

import { useEffect, useState, useTransition } from "react";
import { getBookmarks, toggleBookmark } from "@/lib/bookmarksClient";

export default function BookmarkButton({ articleId }: { articleId: string }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let mounted = true;
    getBookmarks()
      .then((set) => {
        if (!mounted) return;
        setIsBookmarked(set.has(articleId));
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "failed");
      });
    return () => {
      mounted = false;
    };
  }, [articleId]);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              const set = await toggleBookmark(articleId);
              setIsBookmarked(set.has(articleId));
            } catch (e: unknown) {
              setError(e instanceof Error ? e.message : "failed");
            }
          });
        }}
        className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
          isBookmarked
            ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-100"
            : "border-slate-800 bg-slate-950/30 text-slate-200 hover:border-slate-600"
        } disabled:opacity-60`}
        aria-pressed={isBookmarked}
      >
        {isPending ? "Saving…" : isBookmarked ? "Bookmarked" : "Bookmark"}
      </button>
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </div>
  );
}

