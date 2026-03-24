import { PluginManifestSchema, type HostApi, type Plugin } from "@/lib/contracts";

const Content = { title: "Draft", body: "Plugins access content through gated APIs." };

export function createHost(plugin: Plugin) {
  const manifest = PluginManifestSchema.parse(plugin.manifest);
  const caps = new Set(manifest.capabilities);

  const api: HostApi = {
    readContent: () => {
      if (!caps.has("read-content")) throw new Error("plugin_not_authorized: read-content");
      return Content;
    },
    publish: () => {
      if (!caps.has("publish")) throw new Error("plugin_not_authorized: publish");
      // In production: enqueue publish job, validate permissions, etc.
    }
  };

  return { manifest, api };
}

