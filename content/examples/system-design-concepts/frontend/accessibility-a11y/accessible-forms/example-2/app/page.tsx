"use client";

import { useRef, useState } from "react";
import { ErrorSummary, type ErrorItem } from "@/components/ErrorSummary";

export default function Page() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const errors: ErrorItem[] = [];
  if (submitted && value.trim().length === 0) errors.push({ fieldId: "name", message: "Name is required." });

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Error summary primitive</h1>
        <p className="mt-2 text-slate-300">This example isolates the error summary behavior for reuse.</p>
      </header>

      <form
        className="rounded-xl border border-white/10 bg-white/5 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
          if (value.trim().length === 0) window.setTimeout(() => summaryRef.current?.focus(), 0);
        }}
      >
        {errors.length > 0 ? <ErrorSummary ref={summaryRef} items={errors} /> : null}

        <label htmlFor="name" className="text-sm font-semibold text-slate-100">
          Name
        </label>
        <input
          id="name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
        />

        <button
          type="submit"
          className="mt-6 rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30"
        >
          Submit
        </button>
      </form>
    </main>
  );
}

