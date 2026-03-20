"use client";

import { useMemo, useState } from "react";

function expensiveTokenize(input: string) {
  // Artificial CPU work to simulate a heavy editor runtime.
  let acc = 0;
  for (let i = 0; i < 250_000; i += 1) acc = (acc + i * 31) % 1_000_003;
  return { tokens: input.split(/\s+/).filter(Boolean), acc };
}

export default function HeavyEditor() {
  const [value, setValue] = useState(
    "This editor is intentionally heavy to demonstrate deferring hydration of expensive widgets.",
  );

  const analysis = useMemo(() => expensiveTokenize(value), [value]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-300">
        Heavy Editor Island
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-3 h-28 w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none focus:border-slate-600"
      />
      <div className="mt-3 text-xs text-slate-400">
        Tokens: <span className="font-mono">{analysis.tokens.length}</span> · CPU checksum:{" "}
        <span className="font-mono">{analysis.acc}</span>
      </div>
    </div>
  );
}

