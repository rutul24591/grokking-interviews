"use client";

import { useState } from "react";

type FileHandleLike = {
  getFile: () => Promise<File>;
  createWritable: () => Promise<{ write: (data: string) => Promise<void>; close: () => Promise<void> }>;
};

type WindowWithFileApi = Window & {
  showOpenFilePicker?: () => Promise<FileHandleLike[]>;
};

export function FileEditorClient() {
  const [content, setContent] = useState("");
  const [supported] = useState(typeof window !== "undefined" && "showOpenFilePicker" in window);
  const [handle, setHandle] = useState<FileHandleLike | null>(null);

  async function openFile() {
    const picks = await (window as WindowWithFileApi).showOpenFilePicker?.();
    const next = picks?.[0];
    if (!next) return;
    setHandle(next);
    const file = await next.getFile();
    setContent(await file.text());
  }

  async function saveFile() {
    if (!handle) return;
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-white/70">
        supported: <span className="font-semibold">{String(supported)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white disabled:opacity-50" disabled={!supported} onClick={() => void openFile()}>Open file</button>
        <button className="rounded-lg border border-white/10 bg-black/20 px-4 py-2 font-semibold text-white disabled:opacity-50" disabled={!handle} onClick={() => void saveFile()}>Save file</button>
      </div>
      <textarea className="min-h-64 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2" value={content} onChange={(e) => setContent(e.target.value)} />
      {!supported ? <p className="text-sm text-amber-300">This API is unavailable in many browsers. Use a server upload or IndexedDB draft fallback.</p> : null}
    </div>
  );
}

