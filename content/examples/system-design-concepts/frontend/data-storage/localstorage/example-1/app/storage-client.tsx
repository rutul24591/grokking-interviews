"use client";

import { useEffect, useState } from "react";
import { loadSettings, saveDraft, saveSettings, type DraftSettings } from "../lib/localStorageStore";

const EMPTY: DraftSettings = {
  draft: "",
  theme: "dark",
  fontScale: 100
};

export function LocalStorageClient() {
  const [state, setState] = useState<DraftSettings>(EMPTY);
  const [status, setStatus] = useState("hydrating");

  useEffect(() => {
    const loaded = loadSettings();
    setState(loaded);
    setStatus("ready");
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
          state: <span className="font-semibold">{status}</span>
        </span>
        <button
          type="button"
          className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500"
          onClick={() => {
            saveSettings(state);
            setStatus("saved");
          }}
        >
          Save all
        </button>
      </div>

      <label className="block text-sm">
        <div className="mb-1 text-white/70">Theme preference</div>
        <select
          className="rounded-md border border-white/10 bg-black/20 px-3 py-2"
          value={state.theme}
          onChange={(e) => {
            const next = { ...state, theme: e.target.value as DraftSettings["theme"] };
            setState(next);
            saveSettings(next);
          }}
        >
          <option value="dark">dark</option>
          <option value="light">light</option>
        </select>
      </label>

      <label className="block text-sm">
        <div className="mb-1 text-white/70">Font scale</div>
        <input
          className="w-full"
          type="range"
          min={90}
          max={120}
          step={5}
          value={state.fontScale}
          onChange={(e) => {
            const next = { ...state, fontScale: Number(e.target.value) };
            setState(next);
            saveSettings(next);
          }}
        />
      </label>

      <label className="block text-sm">
        <div className="mb-1 text-white/70">Draft</div>
        <textarea
          className="min-h-48 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2"
          style={{ fontSize: `${state.fontScale}%` }}
          value={state.draft}
          onChange={(e) => {
            const nextDraft = e.target.value;
            setState((current) => ({ ...current, draft: nextDraft }));
            saveDraft(nextDraft);
            setStatus("autosaved");
          }}
        />
      </label>
    </div>
  );
}

