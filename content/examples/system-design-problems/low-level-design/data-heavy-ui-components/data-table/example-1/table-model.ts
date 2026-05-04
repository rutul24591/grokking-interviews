export type RowId = string;

export type Row = {
  id: RowId;
  [key: string]: unknown;
};

export type SortDirection = "asc" | "desc";

export type SortSpec = { key: string; dir: SortDirection };

export type FilterSpec =
  | { kind: "equals"; key: string; value: unknown }
  | { kind: "contains"; key: string; value: string };

export type TableQuery = {
  sort: SortSpec[];
  filters: FilterSpec[];
  globalSearch?: string;
};

function cmp(a: unknown, b: unknown) {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

export function applyFilters(rows: Row[], q: TableQuery) {
  const global = q.globalSearch?.trim().toLowerCase();
  return rows.filter((r) => {
    for (const f of q.filters) {
      if (f.kind === "equals") {
        if (r[f.key] !== f.value) return false;
      } else {
        const v = String(r[f.key] ?? "").toLowerCase();
        if (!v.includes(f.value.toLowerCase())) return false;
      }
    }
    if (global) {
      const hit = Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(global));
      if (!hit) return false;
    }
    return true;
  });
}

export function applySort(rows: Row[], sort: SortSpec[]) {
  if (!sort.length) return rows;
  const indexed = rows.map((r, idx) => ({ r, idx }));
  indexed.sort((a, b) => {
    for (const s of sort) {
      const c = cmp(a.r[s.key], b.r[s.key]);
      if (c !== 0) return s.dir === "asc" ? c : -c;
    }
    // stable tie-breaker (important for UX)
    return a.idx - b.idx;
  });
  return indexed.map((x) => x.r);
}

export type OffsetPage = { kind: "offset"; page: number; pageSize: number };
export type CursorPage = { kind: "cursor"; after?: string | null; limit: number };
export type PageSpec = OffsetPage | CursorPage;

export function applyOffsetPagination(rows: Row[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export function computeTableView(rows: Row[], q: TableQuery, page: PageSpec) {
  const filtered = applyFilters(rows, q);
  const sorted = applySort(filtered, q.sort);
  if (page.kind === "offset") return applyOffsetPagination(sorted, page.page, page.pageSize);
  // cursor-based pagination is generally server-backed; the UI model is declared here.
  return sorted.slice(0, page.limit);
}

