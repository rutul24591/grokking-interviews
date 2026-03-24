"use client";

import { useCallback, useState } from "react";
import { loadStylesheetOnce } from "@/lib/loadStylesheet";

export default function Page() {
  const [enabled, setEnabled] = useState(false);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      if (next) loadStylesheetOnce("/fonts/code-font.css", "code-font-css");
      return next;
    });
  }, []);

  return (
    <main className={`mx-auto max-w-3xl space-y-6 p-6 ${enabled ? "code-font-enabled" : ""}`}>
      <h1 className="text-2xl font-semibold">Route-level font budget</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <button className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-black" onClick={toggle}>
          {enabled ? "Disable" : "Enable"} code font
        </button>
        <p className="mt-3 text-sm opacity-80">
          When enabled, we lazily load a stylesheet that defines an <code>@font-face</code> for the code font. This keeps initial load
          smaller for sessions that never need the code font.
        </p>
      </section>

      <pre className="overflow-auto rounded border border-white/10 bg-black/30 p-3 text-sm">
        <code>{`// Toggle the code font.
// In a real app, you’d trigger this on route or feature entry.`}</code>
      </pre>
    </main>
  );
}

