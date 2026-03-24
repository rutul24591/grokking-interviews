import { buildPolicy } from "@/lib/robotsPolicy";

export default function Page() {
  const policy = buildPolicy();
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Robots policy builder</h1>
      <pre className="overflow-auto rounded border border-white/10 bg-black/30 p-3 text-xs">
        <code>{JSON.stringify(policy, null, 2)}</code>
      </pre>
    </main>
  );
}

