import { PluginManifestSchema, type HostContext, type PluginModule } from "@/lib/contracts";
import { getPluginById } from "@/lib/registry";

function defaultContext(): HostContext {
  return {
    tenantId: "tenant_demo",
    content: {
      title: "System design notes",
      body: "Plugins read this content via a stable contract. In production, this could be fetched from a content API."
    },
    nowIso: new Date().toISOString()
  };
}

export type ResolvedPlugin = PluginModule & { ctx: HostContext };

export function resolveEnabledPlugins(ids: string[]): ResolvedPlugin[] {
  const ctx = defaultContext();
  return ids
    .map((id) => getPluginById(id))
    .filter((p): p is PluginModule => Boolean(p))
    .map((p) => ({ ...p, manifest: PluginManifestSchema.parse(p.manifest), ctx }));
}

