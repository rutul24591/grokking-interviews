import type { PluginModule } from "@/lib/contracts";

export const WordCountPlugin: PluginModule = {
  manifest: {
    id: "word-count",
    version: "1.0.0",
    label: "Word count",
    capabilities: ["read-content"]
  },
  render: (ctx) => {
    const words = ctx.content.body.trim().split(/\s+/).filter(Boolean).length;
    return (
      <div className="space-y-2 text-sm text-slate-300">
        <p>
          Words: <span className="font-semibold text-slate-100">{words}</span>
        </p>
        <p className="text-slate-400">Computed at {ctx.nowIso}.</p>
      </div>
    );
  }
};

