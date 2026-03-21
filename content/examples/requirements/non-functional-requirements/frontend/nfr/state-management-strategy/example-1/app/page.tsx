import { Explorer } from "@/components/Explorer";

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">State management strategy — local vs URL vs global vs server</h1>
        <p className="text-sm text-slate-300">
          Demonstrates a practical partition: URL state for filters, global persisted UI preferences, and
          server state fetched from an API.
        </p>
      </header>
      <Explorer />
    </main>
  );
}

