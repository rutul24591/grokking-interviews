"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const HeavyEditor = dynamic(() => import("./HeavyEditor"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200">
      Loading editor chunk…
    </div>
  ),
});

export default function EditorSlot() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6">
      <button
        className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-2 text-sm text-slate-200 hover:border-slate-600"
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close editor" : "Open editor"}
      </button>

      <div className="mt-4">
        {open ? (
          <HeavyEditor />
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-200">
            Editor is not mounted yet → avoids parsing/executing heavy JS during initial hydration.
          </div>
        )}
      </div>
    </div>
  );
}

