"use client";

import { useMemo, useState } from "react";
import { buildSrcSet } from "@/lib/srcset";

export default function Page() {
  const [widths, setWidths] = useState("320, 480, 640, 960");
  const widthList = useMemo(
    () =>
      widths
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0),
    [widths],
  );

  const srcset = useMemo(
    () => buildSrcSet({ basePath: "/api/image", widths: widthList, format: "webp", height: 240 }),
    [widthList],
  );

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Generate srcset/sizes</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <label className="text-sm">
          <span className="opacity-80">Widths (comma-separated)</span>
          <input
            className="mt-1 w-full rounded border border-white/10 bg-black/30 px-3 py-2"
            value={widths}
            onChange={(e) => setWidths(e.target.value)}
          />
        </label>
        <div className="mt-4 text-sm">
          <div className="opacity-80">srcset</div>
          <div className="mt-2 break-all rounded bg-black/30 p-3">
            <code>{srcset}</code>
          </div>
          <div className="mt-4 text-sm opacity-80">
            Pair this with <code>sizes</code> that matches your layout, e.g. <code>(max-width: 768px) 100vw, 720px</code>.
          </div>
        </div>
      </section>
    </main>
  );
}

