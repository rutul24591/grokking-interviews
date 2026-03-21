import { CommentsUi } from "@/components/CommentsUi";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">XSS injection protection — safe rendering + CSP</h1>
        <p className="text-sm text-slate-300">
          Demonstrates a safe default: never treat user input as HTML. Render rich text via a strict,
          non-HTML tokenization approach, and enforce CSP as defense in depth.
        </p>
      </header>

      <CommentsUi />

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Production notes</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Escape/encode by default. Only allow rich text via an allowlist parser.</li>
          <li>Prefer server-side rendering of rich content from trusted sources (not user HTML).</li>
          <li>Use CSP + strict script policies to reduce blast radius.</li>
        </ul>
      </section>
    </main>
  );
}

