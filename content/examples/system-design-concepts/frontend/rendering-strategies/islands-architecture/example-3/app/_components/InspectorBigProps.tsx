"use client";

import { useEffect, useMemo, useState } from "react";

export default function InspectorBigProps(props: { article: { id: string; body: string } }) {
  const [htmlBytes, setHtmlBytes] = useState<number | null>(null);
  const jsonBytes = useMemo(() => JSON.stringify(props.article).length, [props.article]);

  useEffect(() => {
    setHtmlBytes(document.documentElement.outerHTML.length);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
        Island (big props)
      </div>
      <div className="mt-3 grid gap-1 text-sm text-slate-100">
        <div>
          article id: <span className="font-mono">{props.article.id}</span>
        </div>
        <div>
          serialized JSON chars: <span className="font-mono">{jsonBytes}</span>
        </div>
        <div>
          document HTML chars (approx):{" "}
          <span className="font-mono">{htmlBytes ?? "…"}</span>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-500">
        Passing large objects into islands can bloat the initial payload even if only a tiny part is hydrated.
      </div>
    </div>
  );
}

