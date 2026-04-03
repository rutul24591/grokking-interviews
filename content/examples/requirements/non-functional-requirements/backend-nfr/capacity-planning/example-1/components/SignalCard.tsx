type SignalCardProps = {
  label: string;
  value: string;
  hint: string;
};

export function SignalCard({ label, value, hint }: SignalCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-black/30 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      <p className="mt-2 text-sm text-slate-400">{hint}</p>
    </div>
  );
}
