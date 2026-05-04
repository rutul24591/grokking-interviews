export type SavedView = {
  version: number;
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  query: {
    filters: { key: string; op: "eq" | "contains" | "gt" | "lt"; value: unknown }[];
    sort: { key: string; dir: "asc" | "desc" }[];
    globalSearch?: string;
  };
  columns?: {
    order: string[];
    hidden: string[];
    widths: Record<string, number>;
  };
};

export function serializeView(v: SavedView) {
  return JSON.stringify(v);
}

export function deserializeView(raw: string): SavedView | null {
  try {
    const p = JSON.parse(raw) as SavedView;
    if (typeof p.version !== "number") return null;
    if (!p.id || !p.name) return null;
    return p;
  } catch {
    return null;
  }
}

export type ShareMode = "snapshot" | "live";

export type SharedView = {
  shareId: string;
  mode: ShareMode;
  // snapshot embeds the data; live references id
  view?: SavedView;
  viewId?: string;
};

