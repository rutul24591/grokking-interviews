export function SafePlugin() {
  return (
    <section className="rounded-xl border border-white/10 bg-black/30 p-5">
      <h3 className="text-base font-semibold text-slate-100">Safe plugin</h3>
      <p className="mt-2 text-sm text-slate-300">Renders normally.</p>
    </section>
  );
}

export function ThrowingPlugin() {
  throw new Error("Simulated plugin failure while rendering.");
}

