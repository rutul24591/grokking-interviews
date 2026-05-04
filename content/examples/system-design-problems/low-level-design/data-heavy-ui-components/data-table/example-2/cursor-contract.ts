export type CursorPageRequest = {
  after?: string | null;
  limit: number;
  sort?: { key: string; dir: "asc" | "desc" }[];
  filters?: { key: string; op: "eq" | "contains"; value: unknown }[];
};

export type CursorPageResponse<Row> = {
  rows: Row[];
  nextCursor: string | null;
  // optional: a snapshot token to guarantee consistency across pages
  snapshotId?: string;
};

