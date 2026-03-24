export default function Page() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Font loading strategies</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm opacity-80">
        <p>
          This page uses self-hosted <code>Sora</code> for UI text and <code>Fira Code</code> for code blocks.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <code>&lt;link rel="preload" as="font"&gt;</code> for the critical font file.
          </li>
          <li>
            <code>font-display: swap</code> to avoid FOIT.
          </li>
          <li>Keep a system font fallback stack to reduce layout shift.</li>
        </ul>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Sample</h2>
        <p className="mt-2 text-sm opacity-80">
          The quick brown fox jumps over the lazy dog. Numbers: 0123456789.
        </p>
        <pre className="mt-4 overflow-auto rounded bg-black/30 p-3 text-sm">
          <code>{`// Code blocks use the code font.
function render() {
  return "fonts";
}`}</code>
        </pre>
      </section>
    </main>
  );
}

