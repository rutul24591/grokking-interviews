import { z } from "zod";
import type { ReactNode } from "react";

const heroWidgetSchema = z.object({
  type: z.literal("hero"),
  title: z.string().min(1),
  subtitle: z.string().min(1)
});

const statWidgetSchema = z.object({
  type: z.literal("stat"),
  label: z.string().min(1),
  value: z.number()
});

const ctaWidgetSchema = z.object({
  type: z.literal("cta"),
  text: z.string().min(1),
  href: z.string().min(1)
});

export const widgetSchema = z.discriminatedUnion("type", [heroWidgetSchema, statWidgetSchema, ctaWidgetSchema]);
export type Widget = z.infer<typeof widgetSchema>;

export const layoutSchema = z.object({
  widgets: z.array(widgetSchema).min(1)
});
export type Layout = z.infer<typeof layoutSchema>;

function assertNever(x: never): never {
  throw new Error(`Unreachable widget: ${String(x)}`);
}

export function renderWidget(widget: Widget): ReactNode {
  switch (widget.type) {
    case "hero":
      return (
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 p-6">
          <h2 className="text-xl font-semibold">{widget.title}</h2>
          <p className="mt-1 text-sm text-white/70">{widget.subtitle}</p>
        </div>
      );
    case "stat":
      return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">{widget.label}</div>
          <div className="mt-1 text-3xl font-semibold tabular-nums">{widget.value}</div>
        </div>
      );
    case "cta":
      return (
        <a
          className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
          href={widget.href}
        >
          {widget.text}
        </a>
      );
    default:
      return assertNever(widget);
  }
}

