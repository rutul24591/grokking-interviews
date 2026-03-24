export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 id="route-title" tabIndex={-1} className="text-3xl font-semibold tracking-tight outline-none">
          Settings
        </h1>
        <p className="mt-2 text-slate-300">Try navigating here with a keyboard and notice focus placement.</p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Preferences</h2>
        <div className="mt-4 space-y-3 text-slate-300">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4" /> Email notifications
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4" /> Weekly summary
          </label>
        </div>
      </section>
    </section>
  );
}

