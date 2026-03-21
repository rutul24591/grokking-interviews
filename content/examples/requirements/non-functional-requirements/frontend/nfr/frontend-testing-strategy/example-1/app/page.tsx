import { QuoteForm } from "@/components/QuoteForm";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Frontend Testing Strategy — Quote flow</h1>
        <p className="text-sm text-slate-300">
          This page is intentionally small, but it has enough moving pieces to demonstrate a practical
          testing pyramid: pure logic unit tests, component tests with mocked fetch, and an optional
          Playwright E2E smoke.
        </p>
      </header>

      <QuoteForm />

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">What to test (and why)</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>
            <strong>Unit:</strong> pricing rules and input normalization (fast, deterministic).
          </li>
          <li>
            <strong>Component:</strong> form validation + render states, with fetch mocked (still fast).
          </li>
          <li>
            <strong>E2E:</strong> one or two high-value journeys to catch wiring/regression issues.
          </li>
        </ul>
      </section>
    </main>
  );
}

