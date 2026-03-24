import type { ReactNode } from "react";

export function Card({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section data-ds="Card" className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--panel)] p-6">
      <h2 className="text-base font-semibold text-[var(--text)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
      {children}
    </section>
  );
}

