"use client";

import { useEffect, useMemo, useState } from "react";

type PreviewVariant = {
  id: string;
  surface: "web" | "mobile" | "social";
  status: "ready" | "warning" | "missing-media";
  headline: string;
  width: number;
  imageState: "ready" | "cropped" | "missing";
  seoDescription: string;
};

type PreviewState = {
  activeSurface: PreviewVariant["surface"];
  variants: PreviewVariant[];
  publishBlocked: boolean;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<PreviewState | null>(null);

  async function refresh() {
    const response = await fetch("/api/preview/state");
    setState((await response.json()) as PreviewState);
  }

  async function setSurface(activeSurface: PreviewVariant["surface"]) {
    const response = await fetch("/api/preview/device", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeSurface })
    });
    setState((await response.json()) as PreviewState);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const activeVariant = useMemo(
    () => state?.variants.find((variant) => variant.surface === state.activeSurface),
    [state]
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Content Preview Review</h1>
      <p className="mt-2 text-slate-300">
        Validate publishing surfaces before release: headline fit, social card health, mobile rendering, and publish-blocking media gaps.
      </p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void setSurface("web")} className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold hover:bg-sky-500">Web</button>
            <button onClick={() => void setSurface("mobile")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Mobile</button>
            <button onClick={() => void setSurface("social")} className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Social</button>
          </div>
          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Release status</div>
            <div className="mt-2 text-lg font-semibold text-slate-100">{state?.publishBlocked ? "Blocked" : "Ready for publish"}</div>
            <div className="mt-2 text-slate-400">{state?.lastMessage}</div>
          </div>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Active preview</div>
          <div className="mt-2 text-lg font-semibold text-slate-100">{activeVariant?.surface}</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded border border-slate-800 px-3 py-3">headline: {activeVariant?.headline}</div>
            <div className="rounded border border-slate-800 px-3 py-3">status: {activeVariant?.status}</div>
            <div className="rounded border border-slate-800 px-3 py-3">render width: {activeVariant?.width}px</div>
            <div className="rounded border border-slate-800 px-3 py-3">image state: {activeVariant?.imageState}</div>
          </div>
          <div className="mt-4 rounded border border-slate-800 px-3 py-3">SEO description: {activeVariant?.seoDescription}</div>
        </article>
      </section>
    </main>
  );
}
