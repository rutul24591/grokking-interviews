function SpriteIcon() {
  return (
    <svg aria-hidden="true" className="h-10 w-10 text-blue-400">
      <use href="/sprite.svg#shield" />
    </svg>
  );
}

function DataIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="%2360a5fa" d="M12 2 2 7l10 5 10-5-10-5Zm0 7 10-5v10l-10 5-10-5V4l10 5Z"/></svg>`;
  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={dataUrl} alt="Data SVG icon" className="h-10 w-10" />;
}

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">CSP constraints</h1>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm opacity-80">
        <p>
          This app sets a CSP with <code>img-src 'self'</code> (no <code>data:</code>). Under this policy, external sprite icons work, while
          data-URL icons may be blocked.
        </p>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-8">
          <div className="space-y-2">
            <div className="text-xs uppercase opacity-70">Sprite icon</div>
            <SpriteIcon />
          </div>
          <div className="space-y-2">
            <div className="text-xs uppercase opacity-70">Data URL icon</div>
            <DataIcon />
          </div>
        </div>
      </section>
    </main>
  );
}

