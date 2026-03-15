"use client";

import { useMemo, useState } from "react";
import { classNames } from "@/lib/classNames";
import type { ExampleGroup } from "@/types/examples";

type ExampleViewerProps = {
  example?: ExampleGroup;
};

export function ExampleViewer({ example }: ExampleViewerProps) {
  const files = example?.files ?? [];
  const { visibleFiles, explanation } = useMemo(() => {
    const explanationFile = files.find((file) => {
      const lower = file.name.toLowerCase();
      return lower === "explanation.md" || lower === "explanation.txt";
    });
    const remaining = files.filter((file) => file !== explanationFile);
    return {
      visibleFiles: remaining,
      explanation: explanationFile?.content ?? "",
    };
  }, [files]);

  const defaultFile = useMemo(() => {
    if (!visibleFiles.length) return undefined;
    const priority = [
      "server.js",
      "app.js",
      "index.js",
      "client.js",
      "main.js",
      "handler.js",
    ];
    for (const name of priority) {
      const match = visibleFiles.find(
        (file) => file.name.toLowerCase() === name
      );
      if (match) return match;
    }
    const nonReadme = visibleFiles.find(
      (file) => file.name.toLowerCase() !== "readme.md"
    );
    if (nonReadme) return nonReadme;
    return visibleFiles[0];
  }, [visibleFiles]);

  const [selected, setSelected] = useState(defaultFile?.name ?? "");
  const resolvedSelected = useMemo(() => {
    if (!visibleFiles.length) return "";
    const exists = visibleFiles.some((file) => file.name === selected);
    return exists ? selected : (defaultFile?.name ?? "");
  }, [visibleFiles, selected, defaultFile?.name]);

  const active =
    visibleFiles.find((file) => file.name === resolvedSelected) ?? defaultFile;

  if (!files.length) {
    return (
      <div className="rounded-2xl border border-dashed border-theme bg-panel-soft p-6 text-sm text-muted">
        Example not available yet.
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-theme bg-panel-soft p-4">
      <div className="flex flex-wrap gap-2 border-b border-theme pb-3">
        {visibleFiles.map((file) => (
          <button
            key={file.name}
            type="button"
            onClick={() => setSelected(file.name)}
            className={classNames(
              "rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] transition",
              file.name === active?.name
                ? "bg-accent text-white"
                : "bg-panel text-muted hover:text-body"
            )}
          >
            {file.name}
          </button>
        ))}
      </div>
      <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        {active?.name ?? "Example"}
      </div>
      <pre className="mt-3 max-h-[70vh] overflow-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">
        <code>{active?.content ?? ""}</code>
      </pre>
      {explanation ? (
        <div className="mt-4 rounded-lg border border-theme bg-panel p-4 text-sm text-body">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Explanation
          </div>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed text-body">
            {explanation}
          </p>
        </div>
      ) : null}
    </section>
  );
}
