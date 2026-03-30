import { WizardClient } from "./wizard-client";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold">SessionStorage checkout draft</h1>
      <p className="mt-3 text-white/80">Preserve in-progress multi-step form state for the current tab only.</p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <WizardClient />
      </div>
    </main>
  );
}

