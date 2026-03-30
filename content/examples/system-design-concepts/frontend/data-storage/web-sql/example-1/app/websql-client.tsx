"use client";

import { useMemo } from "react";

export function WebSqlClient() {
  const supported = useMemo(() => typeof window !== "undefined" && "openDatabase" in window, []);

  return (
    <div className="space-y-4 text-sm">
      <div>Web SQL supported: <span className="font-semibold">{String(supported)}</span></div>
      <div className="rounded-md border border-white/10 bg-black/20 p-4 text-white/80">
        {supported
          ? "Legacy support detected. Migrate records to IndexedDB and stop depending on Web SQL."
          : "Unsupported browser. Use IndexedDB instead."}
      </div>
      <div className="rounded-md border border-white/10 bg-black/20 p-4 text-white/80">
        Migration plan: export records, rewrite persistence to IndexedDB, and remove Web SQL boot paths from production.
      </div>
    </div>
  );
}
