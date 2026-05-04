export type ColumnId = string;

export type Column = {
  id: ColumnId;
  label: string;
  widthPx: number;
  minWidthPx: number;
  maxWidthPx: number;
  hidden?: boolean;
};

export function resizeColumn(c: Column, deltaPx: number) {
  const width = Math.max(c.minWidthPx, Math.min(c.maxWidthPx, c.widthPx + deltaPx));
  return { ...c, widthPx: width };
}

export type ColumnLayout = {
  version: number;
  columns: Column[];
};

export function serializeLayout(layout: ColumnLayout) {
  return JSON.stringify(layout);
}

export function deserializeLayout(raw: string): ColumnLayout | null {
  try {
    const parsed = JSON.parse(raw) as ColumnLayout;
    if (typeof parsed?.version !== "number") return null;
    if (!Array.isArray(parsed.columns)) return null;
    return parsed;
  } catch {
    return null;
  }
}

