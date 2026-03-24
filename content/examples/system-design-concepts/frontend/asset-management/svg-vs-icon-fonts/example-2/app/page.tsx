"use client";

import { useCallback, useState } from "react";

const MALICIOUS = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="64" viewBox="0 0 160 64" onload="alert('xss')">
  <rect width="160" height="64" rx="12" fill="#0b1020"/>
  <text x="18" y="40" font-family="ui-sans-serif,system-ui" font-size="18" fill="#e6e9f2">Hello SVG</text>
  <script>alert('xss')</script>
</svg>`;

export default function Page() {
  const [svg, setSvg] = useState(MALICIOUS);
  const [sanitized, setSanitized] = useState<string>("");

  const run = useCallback(async () => {
    const res = await fetch("/api/sanitize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ svg }),
    });
    const j = (await res.json()) as { sanitized: string };
    setSanitized(j.sanitized);
  }, [svg]);

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Inline SVG sanitization</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <textarea className="h-44 w-full rounded border border-white/10 bg-black/30 p-3 text-xs" value={svg} onChange={(e) => setSvg(e.target.value)} />
        <div className="mt-3 flex gap-2">
          <button className="rounded bg-blue-500 px-3 py-2 text-sm font-medium text-black" onClick={run}>
            Sanitize
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-semibold">Sanitized output</h2>
          <pre className="mt-3 overflow-auto rounded bg-black/30 p-3 text-xs">
            <code>{sanitized || "(click Sanitize)"}</code>
          </pre>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-semibold">Rendered</h2>
          <div className="mt-3 rounded bg-white p-3 text-black" dangerouslySetInnerHTML={{ __html: sanitized || "" }} />
          <p className="mt-3 text-sm opacity-80">
            Rendering uses <code>dangerouslySetInnerHTML</code> for demonstration. Prefer a build pipeline for known-good icons.
          </p>
        </div>
      </section>
    </main>
  );
}

