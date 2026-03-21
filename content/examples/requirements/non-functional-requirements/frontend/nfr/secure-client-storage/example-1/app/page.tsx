import { AttackPanel } from "@/components/AttackPanel";
import { StorageDemo } from "@/components/StorageDemo";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Secure client storage — choose a safe boundary</h1>
        <p className="text-sm text-slate-300">
          This demo contrasts two approaches: an <strong>HttpOnly cookie session</strong> vs a{" "}
          <strong>JS-readable bearer token</strong> stored in localStorage.
        </p>
      </header>

      <StorageDemo />
      <AttackPanel />

      <section className="rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-300">
        <h2 className="font-medium text-slate-200">Production guidance</h2>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Never store long-lived auth tokens in localStorage; assume XSS can read it.</li>
          <li>Use HttpOnly cookies for session auth; pair with CSRF protections (SameSite + tokens).</li>
          <li>Store only non-sensitive UX prefs client-side (theme, layout), not secrets.</li>
        </ul>
      </section>
    </main>
  );
}

