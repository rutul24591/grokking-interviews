"use client";

import { useFormStatus } from "react-dom";

export default function LikeButton() {
  const status = useFormStatus();
  return (
    <button
      type="submit"
      disabled={status.pending}
      className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-sm text-slate-200 hover:border-slate-600 disabled:opacity-60"
    >
      {status.pending ? "Liking…" : "Like"}
    </button>
  );
}

