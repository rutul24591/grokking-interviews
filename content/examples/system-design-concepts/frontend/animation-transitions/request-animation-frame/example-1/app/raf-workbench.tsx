"use client";

import { useEffect, useRef, useState } from "react";

export function RafWorkbench() {
  const frameRef = useRef<number | null>(null);
  const previousRef = useRef<number | null>(null);
  const [running, setRunning] = useState(false);
  const [delta, setDelta] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (!running) return;
    const tick = (time: number) => {
      const previous = previousRef.current ?? time;
      const nextDelta = time - previous;
      previousRef.current = time;
      setDelta(nextDelta);
      setPosition((value) => (value + Math.min(nextDelta / 2, 12)) % 280);
      frameRef.current = window.requestAnimationFrame(tick);
    };
    frameRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      previousRef.current = null;
    };
  }, [running]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <div className="flex flex-wrap gap-3">
          <button className="rounded-2xl bg-sky-400 px-4 py-3 font-medium text-slate-950" onClick={() => setRunning(true)}>Start loop</button>
          <button className="rounded-2xl border border-slate-700 px-4 py-3" onClick={() => setRunning(false)}>Pause loop</button>
        </div>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="h-4 w-20 rounded-full bg-sky-400" style={{ transform: `translateX(${position}px)` }} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">Frame delta: {delta.toFixed(2)}ms</div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">Use `requestAnimationFrame` when motion should align to the browser paint loop instead of an arbitrary timer.</div>
        </div>
      </section>
    </main>
  );
}
