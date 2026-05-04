export type ColumnId = string;

export type AvailableColumn = {
  id: ColumnId;
  label: string;
  defaultVisible: boolean;
  defaultWidthPx: number;
};

export type UserColumnLayout = {
  version: number;
  order: ColumnId[];
  hidden: ColumnId[];
  pinnedLeft: ColumnId[];
  widths: Record<ColumnId, number>;
};

export function applyLayout(available: AvailableColumn[], layout: UserColumnLayout) {
  const byId = new Map(available.map((c) => [c.id, c]));
  const order = layout.order.filter((id) => byId.has(id));
  // include newly introduced columns at the end
  for (const c of available) if (!order.includes(c.id)) order.push(c.id);
  const hidden = new Set(layout.hidden);
  return order.map((id) => {
    const base = byId.get(id)!;
    return {
      ...base,
      visible: !hidden.has(id),
      widthPx: layout.widths[id] ?? base.defaultWidthPx,
      pinned: layout.pinnedLeft.includes(id) ? "left" : null,
    };
  });
}

