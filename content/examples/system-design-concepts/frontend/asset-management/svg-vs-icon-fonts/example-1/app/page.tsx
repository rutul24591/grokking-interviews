function Icon({ id, label }: { id: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg aria-hidden="true" className="h-6 w-6 text-blue-400">
        <use href={`/sprite.svg#${id}`} />
      </svg>
      <span className="text-sm">{label}</span>
    </span>
  );
}

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">SVG sprite icons</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm opacity-80">
        <p>
          This page uses a generated <code>/public/sprite.svg</code> and references icons via <code>&lt;use&gt;</code>.
        </p>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap gap-6">
          <Icon id="icon-search" label="Search" />
          <Icon id="icon-lock" label="Lock" />
        </div>
      </section>
    </main>
  );
}

