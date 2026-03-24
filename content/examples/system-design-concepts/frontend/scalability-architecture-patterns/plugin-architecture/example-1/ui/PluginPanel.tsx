import type { ResolvedPlugin } from "@/lib/host";

export function PluginPanel({ plugin }: { plugin: ResolvedPlugin }) {
  return (
    <section className="rounded-xl border border-white/10 bg-black/30 p-5">
      <header>
        <h3 className="text-base font-semibold text-slate-100">{plugin.manifest.label}</h3>
        <p className="mt-1 text-xs text-slate-400">
          id <code>{plugin.manifest.id}</code> · v{plugin.manifest.version}
        </p>
      </header>
      <div className="mt-4">{plugin.render(plugin.ctx)}</div>
      <footer className="mt-4 text-xs text-slate-400">
        Capabilities: {plugin.manifest.capabilities.length ? plugin.manifest.capabilities.join(", ") : "none"}
      </footer>
    </section>
  );
}

