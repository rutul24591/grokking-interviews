"use client";

import { useState } from "react";

export function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button
      type="button"
      onClick={() => setLikes((v) => v + 1)}
      className="rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-200 hover:border-slate-500"
    >
      Like {likes ? `(${likes})` : ""}
    </button>
  );
}

