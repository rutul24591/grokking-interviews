import type { PluginModule } from "@/lib/contracts";
import { SeoAuditPlugin } from "@/plugins/seo-audit";
import { WordCountPlugin } from "@/plugins/word-count";

const Registry: Record<string, PluginModule> = {
  "seo-audit": SeoAuditPlugin,
  "word-count": WordCountPlugin
};

export function listPluginIds() {
  return Object.keys(Registry);
}

export function getPluginById(id: string) {
  return Registry[id] ?? null;
}

