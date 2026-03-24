import { z } from "zod";

export const CapabilitySchema = z.enum(["read-content", "write-content", "publish"]);
export type Capability = z.infer<typeof CapabilitySchema>;

export const PluginManifestSchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  label: z.string().min(1),
  capabilities: z.array(CapabilitySchema).default([])
});

export type PluginManifest = z.infer<typeof PluginManifestSchema>;

export type HostApi = {
  readContent: () => { title: string; body: string };
  publish: () => void;
};

export type Plugin = {
  manifest: PluginManifest;
  run: (api: HostApi) => { ok: boolean; message: string };
};

