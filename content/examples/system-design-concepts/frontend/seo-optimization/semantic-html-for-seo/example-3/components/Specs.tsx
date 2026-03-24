export type Spec = { name: string; value: string };

export function Specs({ specs }: { specs: Spec[] }) {
  return (
    <dl className="mt-4 grid gap-3 rounded-lg border border-white/10 bg-black/30 p-4 sm:grid-cols-2">
      {specs.map((s) => (
        <div key={s.name}>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-300">{s.name}</dt>
          <dd className="mt-1 text-sm text-slate-100">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

