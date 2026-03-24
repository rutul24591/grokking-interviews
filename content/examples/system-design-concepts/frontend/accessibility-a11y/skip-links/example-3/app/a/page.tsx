export default function PageA() {
  return (
    <main className="space-y-8">
      <header id="content" tabIndex={-1} className="skip-target outline-none">
        <h1 id="route-title" tabIndex={-1} className="text-3xl font-semibold tracking-tight outline-none">
          Page A
        </h1>
        <p className="mt-2 text-slate-300">Focus should land here after navigation.</p>
      </header>
    </main>
  );
}

