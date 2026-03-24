import { z } from "zod";

export const CapabilitySchema = z.enum(["read-content", "analyze-seo"]);
export type Capability = z.infer<typeof CapabilitySchema>;

export const PluginManifestSchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  label: z.string().min(1),
  capabilities: z.array(CapabilitySchema).default([])
});

export type PluginManifest = z.infer<typeof PluginManifestSchema>;

export type HostContext = {
  tenantId: string;
  content: { title: string; body: string };
  nowIso: string;
};

export type PluginModule = {
  manifest: PluginManifest;
  render: (ctx: HostContext) => React.ReactNode;
};

