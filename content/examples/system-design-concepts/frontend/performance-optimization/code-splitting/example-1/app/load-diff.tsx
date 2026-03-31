"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const DiffExplorer = dynamic(() => import("./diff-explorer"), {
  ssr: false,
  loading: () => (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
      Loading diff explorer chunk...
    </div>
  ),
});

export default function LoadDiff() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full bg-slate-950 px-5 py-3 text-sm text-white"
      >
        {open ? "Hide diff explorer" : "Open deep comparison"}
      </button>
      <div className="mt-4">{open ? <DiffExplorer /> : null}</div>
    </div>
  );
}

