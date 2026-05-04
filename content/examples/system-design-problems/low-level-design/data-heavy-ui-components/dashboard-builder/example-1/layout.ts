export type WidgetId = string;

export type Rect = { x: number; y: number; w: number; h: number };

export type WidgetLayout = Rect & { id: WidgetId };

export type DashboardLayout = {
  version: number;
  cols: number;
  rowHeight: number;
  widgets: WidgetLayout[];
};

export function intersects(a: Rect, b: Rect) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function moveWidget(layout: DashboardLayout, id: WidgetId, next: Rect) {
  const widgets = layout.widgets.map((w) => (w.id === id ? { ...w, ...next } : w));
  return { ...layout, widgets };
}

export function compact(layout: DashboardLayout) {
  // Simple compaction: sort by y then x, then move up while no collisions.
  const widgets = [...layout.widgets].sort((a, b) => a.y - b.y || a.x - b.x);
  const placed: WidgetLayout[] = [];
  for (const w of widgets) {
    let y = w.y;
    while (y > 0) {
      const test = { ...w, y: y - 1 };
      if (placed.some((p) => intersects(p, test))) break;
      y -= 1;
    }
    placed.push({ ...w, y });
  }
  return { ...layout, widgets: placed };
}

export function serialize(layout: DashboardLayout) {
  return JSON.stringify(layout);
}

export function deserialize(raw: string): DashboardLayout | null {
  try {
    const p = JSON.parse(raw) as DashboardLayout;
    if (typeof p.version !== "number") return null;
    return p;
  } catch {
    return null;
  }
}

