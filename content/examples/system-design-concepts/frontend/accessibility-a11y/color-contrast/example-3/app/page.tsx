"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [forcedColors, setForcedColors] = useState<boolean | null>(null);
  const [prefersMore, setPrefersMore] = useState<boolean | null>(null);

  useEffect(() => {
    const fc = window.matchMedia?.("(forced-colors: active)");
    const pc = window.matchMedia?.("(prefers-contrast: more)");
    const update = () => {
      setForcedColors(fc ? fc.matches : null);
      setPrefersMore(pc ? pc.matches : null);
    };
    update();
    fc?.addEventListener("change", update);
    pc?.addEventListener("change", update);
    return () => {
      fc?.removeEventListener("change", update);
      pc?.removeEventListener("change", update);
    };
  }, []);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Forced-colors / high-contrast modes</h1>
        <p className="mt-2 text-slate-300">
          Some users rely on OS-level high contrast. Support it explicitly with CSS media queries.
        </p>
      </header>

      <section className="panel rounded-xl p-6">
        <h2 className="text-xl font-semibold">Detected</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            <code>(forced-colors: active)</code>: {forcedColors === null ? "unknown" : forcedColors ? "true" : "false"}
          </li>
          <li>
            <code>(prefers-contrast: more)</code>: {prefersMore === null ? "unknown" : prefersMore ? "true" : "false"}
          </li>
        </ul>
      </section>

      <section className="panel rounded-xl p-6">
        <h2 className="text-xl font-semibold">Preview</h2>
        <p className="mt-2 text-sm text-slate-300">
          In forced-colors mode the panel/button switch to system colors like <code>Canvas</code> and <code>ButtonFace</code>.
        </p>
        <button className="hc-button mt-4 rounded-md bg-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/30">
          Primary action
        </button>
      </section>

      <section className="panel rounded-xl p-6 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Staff-level guidance</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Don’t hardcode colors for borders/backgrounds in forced-colors mode unless necessary.</li>
          <li>Test with Windows High Contrast + browser forced-colors emulation.</li>
          <li>Design tokens should include “HC-safe” variants when brand colors break readability.</li>
        </ul>
      </section>
    </main>
  );
}

