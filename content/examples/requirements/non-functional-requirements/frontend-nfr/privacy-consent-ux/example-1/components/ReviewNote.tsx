type ReviewNoteProps = {
  title: string;
  detail: string;
};

export function ReviewNote({ title, detail }: ReviewNoteProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm text-slate-300">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{title}</div>
      <p className="mt-2">{detail}</p>
    </div>
  );
}
