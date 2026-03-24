import type { PluginModule } from "@/lib/contracts";

export const SeoAuditPlugin: PluginModule = {
  manifest: {
    id: "seo-audit",
    version: "1.0.0",
    label: "SEO audit",
    capabilities: ["analyze-seo", "read-content"]
  },
  render: (ctx) => {
    const hasTitle = ctx.content.title.trim().length > 0;
    const hasBody = ctx.content.body.trim().length > 30;
    return (
      <div className="space-y-2 text-sm text-slate-300">
        <p>
          <span className="font-semibold text-slate-100">Tenant</span>: {ctx.tenantId}
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Title present:{" "}
            <span className={hasTitle ? "font-semibold text-emerald-200" : "font-semibold text-rose-300"}>
              {String(hasTitle)}
            </span>
          </li>
          <li>
            Body length ok:{" "}
            <span className={hasBody ? "font-semibold text-emerald-200" : "font-semibold text-rose-300"}>
              {String(hasBody)}
            </span>
          </li>
        </ul>
      </div>
    );
  }
};

