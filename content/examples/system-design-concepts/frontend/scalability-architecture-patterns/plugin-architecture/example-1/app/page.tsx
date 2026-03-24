import Link from "next/link";
import { resolveEnabledPlugins } from "@/lib/host";
import { PluginPanel } from "@/ui/PluginPanel";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = sp.plugins;
  const enabled = typeof raw === "string" ? raw.split(",").filter(Boolean) : [];
  const plugins = resolveEnabledPlugins(enabled);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Plugin architecture</h1>
        <p className="mt-2 text-slate-300">
          The host renders plugins from a registry. Enable plugins via query param:{" "}
          <code>?plugins=seo-audit,word-count</code>.
        </p>
        <p className="mt-3 text-sm text-slate-300">
          Quick links:{" "}
          <Link className="hover:underline" href="/?plugins=seo-audit,word-count">
            enable two plugins
          </Link>{" "}
          ·{" "}
          <Link className="hover:underline" href="/">
            disable all
          </Link>
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Enabled plugins</h2>
        <p className="mt-2 text-sm text-slate-300">
          Count: <span className="font-semibold text-slate-100">{plugins.length}</span>
        </p>
        {plugins.length === 0 ? (
          <p className="mt-4 text-sm text-slate-300">No plugins enabled. Use query param to enable.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {plugins.map((p) => (
              <PluginPanel key={p.manifest.id} plugin={p} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
        <h2 className="text-base font-semibold text-slate-100">Platform notes</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Plugins should be capability-scoped; don’t give “God” APIs.</li>
          <li>Version plugin contracts; treat breaking changes like API changes.</li>
          <li>Isolate failures so one plugin can’t take down the host page.</li>
        </ul>
      </section>
    </main>
  );
}

