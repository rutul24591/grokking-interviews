"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const AnalysisWidget = dynamic(() => import("./analysis-widget"), {
  ssr: false,
  loading: () => (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
      Loading analysis chunk...
    </div>
  ),
});

export default function LoadAnalysis() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
      >
        {open ? "Hide analysis" : "Load analysis on demand"}
      </button>
      <div className="mt-4">{open ? <AnalysisWidget /> : null}</div>
    </div>
  );
}

