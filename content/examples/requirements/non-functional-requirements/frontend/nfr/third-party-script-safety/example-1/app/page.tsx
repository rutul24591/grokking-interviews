import { SandboxWidget } from "@/components/SandboxWidget";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Third-party script safety — sandbox + validation</h1>
        <p className="text-sm text-slate-300">
          Third-party code is a supply-chain risk and a reliability risk. Prefer isolation (sandboxed
          iframe) and validate any messages crossing the boundary.
        </p>
      </header>

      <SandboxWidget />

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Production checklist</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Use CSP to restrict where scripts can load from.</li>
          <li>Prefer sandboxed iframes for untrusted widgets.</li>
          <li>Validate `postMessage` payloads and treat the boundary as untrusted input.</li>
        </ul>
      </section>
    </main>
  );
}

