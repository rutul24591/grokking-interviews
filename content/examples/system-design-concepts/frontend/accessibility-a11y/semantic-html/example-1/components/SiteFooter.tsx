export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-semibold text-slate-100">Semantic HTML (a11y)</span> — structure first.
        </p>
        <p>Inspect the DOM: landmarks and headings should describe the page without CSS.</p>
      </div>
    </footer>
  );
}

