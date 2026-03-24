import { IconButton } from "@/components/IconButton";

export default function Page() {
  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Accessible names: visible vs hidden vs aria-label</h1>
        <p className="mt-2 text-slate-300">
          Screen readers need an accessible name. Provide visible text when possible; otherwise use visually hidden
          text.
        </p>
      </header>

      <section className="grid gap-4 rounded-xl border border-white/10 bg-white/5 p-6 md:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-black/30 p-4">
          <h2 className="text-sm font-semibold text-slate-100">Visible label</h2>
          <button className="mt-3 rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold hover:bg-indigo-500/30">
            Download
          </button>
          <p className="mt-3 text-sm text-slate-300">Best: visible text is the accessible name.</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 p-4">
          <h2 className="text-sm font-semibold text-slate-100">Icon-only + hidden text</h2>
          <IconButton label="Search" />
          <p className="mt-3 text-sm text-slate-300">
            Recommended for icon-only buttons: include visually hidden text inside the button.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/30 p-4">
          <h2 className="text-sm font-semibold text-slate-100">aria-label (fallback)</h2>
          <button
            aria-label="Open settings"
            className="mt-3 inline-flex items-center justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
          >
            ⚙️
          </button>
          <p className="mt-3 text-sm text-slate-300">Use aria-label when you can’t render text in the DOM.</p>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Pitfall</h2>
        <p className="mt-2">
          Don’t put critical meaning only in <code>title</code> attributes. Many screen readers don’t announce it
          consistently, and it isn’t keyboard-friendly.
        </p>
      </section>
    </main>
  );
}

