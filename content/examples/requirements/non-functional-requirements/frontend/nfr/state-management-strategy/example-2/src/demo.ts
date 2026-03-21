type Filters = { tag?: string; page?: number; sort?: "new" | "top" };

function toQuery(f: Filters) {
  const p = new URLSearchParams();
  if (f.tag) p.set("tag", f.tag);
  if (f.page) p.set("page", String(f.page));
  if (f.sort) p.set("sort", f.sort);
  return p.toString();
}

function fromQuery(qs: string): Filters {
  const p = new URLSearchParams(qs.startsWith("?") ? qs.slice(1) : qs);
  const page = p.get("page");
  const sort = p.get("sort");
  return {
    tag: p.get("tag") || undefined,
    page: page ? Number(page) : undefined,
    sort: sort === "new" || sort === "top" ? sort : undefined
  };
}

const sample = { tag: "frontend", page: 2, sort: "top" as const };
const qs = toQuery(sample);

console.log(JSON.stringify({ sample, qs, parsed: fromQuery(qs) }, null, 2));

