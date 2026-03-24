import { DsButton } from "@/ui/DsButton";

export default function Page() {
  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Typed variants helper</h1>
        <p className="mt-2 text-slate-300">This keeps styling consistent and prevents “variant drift”.</p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <DsButton>Primary</DsButton>
          <DsButton variant="secondary">Secondary</DsButton>
          <DsButton variant="danger">Danger</DsButton>
          <DsButton size="sm">Small</DsButton>
        </div>
      </section>
    </main>
  );
}

