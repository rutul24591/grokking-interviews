import { Host } from "@/ui/Host";

export default function Page() {
  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Capability gating</h1>
        <p className="mt-2 text-slate-300">
          Plugins must be least-privilege. Host APIs enforce capabilities, not “trust the plugin”.
        </p>
      </header>

      <Host />
    </main>
  );
}

