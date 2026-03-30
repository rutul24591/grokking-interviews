"use client";

import { useEffect, useRef, useState } from "react";

export function WaapiConsole() {
  const ref = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const [supported, setSupported] = useState(false);
  const [preset, setPreset] = useState<"enter" | "attention" | "dismiss">("enter");
  const [status, setStatus] = useState("Animation initialized but paused.");

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof element.animate !== "function") return;
    setSupported(true);
    animationRef.current = element.animate([{ transform: "translateX(0px)" }, { transform: "translateX(180px)" }], {
      duration: 900,
      fill: "both",
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    animationRef.current.pause();
    animationRef.current.onfinish = () => setStatus("Animation finished and retained final state.");
    animationRef.current.oncancel = () => setStatus("Animation cancelled and effect state removed.");
    return () => animationRef.current?.cancel();
  }, []);

  function rebuildAnimation(nextPreset: "enter" | "attention" | "dismiss") {
    const element = ref.current;
    if (!element || typeof element.animate !== "function") return;
    animationRef.current?.cancel();
    const definitions = {
      enter: [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "translateY(0px)" }],
      attention: [{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }],
      dismiss: [{ opacity: 1, transform: "translateX(0px)" }, { opacity: 0, transform: "translateX(120px)" }],
    } as const;
    animationRef.current = element.animate(definitions[nextPreset], {
      duration: nextPreset === "attention" ? 700 : 500,
      fill: "both",
      easing: nextPreset === "attention" ? "ease-in-out" : "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    animationRef.current.pause();
    setPreset(nextPreset);
    setStatus(`Loaded ${nextPreset} preset and paused at start.`);
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap gap-3">
          <button className="rounded-2xl bg-sky-400 px-4 py-3 font-medium text-slate-950" onClick={() => { animationRef.current?.play(); setStatus(`Playing ${preset} preset.`); }}>Play</button>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => { animationRef.current?.pause(); setStatus("Animation paused."); }}>Pause</button>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => { animationRef.current?.reverse(); setStatus("Animation reversed."); }}>Reverse</button>
          <select className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3" value={preset} onChange={(event) => rebuildAnimation(event.target.value as "enter" | "attention" | "dismiss")}>
            <option value="enter">Enter preset</option>
            <option value="attention">Attention preset</option>
            <option value="dismiss">Dismiss preset</option>
          </select>
        </div>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div ref={ref} className="h-4 w-20 rounded-full bg-sky-400" />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">WAAPI supported: {String(supported)} · preset={preset}</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">{status}</div>
        </div>
      </section>
    </main>
  );
}
