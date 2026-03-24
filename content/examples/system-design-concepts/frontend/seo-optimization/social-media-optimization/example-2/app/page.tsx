import { buildSocialMetadata } from "@/lib/socialMeta";

export default function Page() {
  const m = buildSocialMetadata({
    title: "Social Preview Defaults",
    description: "A single function that keeps OG/Twitter metadata consistent across routes.",
    canonicalPath: "/sample",
    ogImagePath: "/api/og?title=Social%20Preview%20Defaults"
  });

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Metadata builder</h1>
      <p className="text-sm opacity-80">
        This page shows a computed metadata object you can reuse across routes for consistency.
      </p>
      <pre className="overflow-auto rounded border border-white/10 bg-black/30 p-3 text-xs">
        <code>{JSON.stringify(m, null, 2)}</code>
      </pre>
    </main>
  );
}

