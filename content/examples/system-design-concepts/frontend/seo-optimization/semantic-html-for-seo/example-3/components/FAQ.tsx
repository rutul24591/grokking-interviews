export type FaqItem = { question: string; answer: string };

export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <div className="mt-4 space-y-3">
      {items.map((i) => (
        <details key={i.question} className="rounded-lg border border-white/10 bg-black/30 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-100">{i.question}</summary>
          <p className="mt-3 text-sm text-slate-300">{i.answer}</p>
        </details>
      ))}
    </div>
  );
}

