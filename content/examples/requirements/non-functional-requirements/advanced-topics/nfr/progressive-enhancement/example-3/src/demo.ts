type Page<T> = { items: T[]; nextCursor: string | null };

function paginate<T>(items: T[], limit: number, cursor: number): Page<T> {
  const page = items.slice(cursor, cursor + limit);
  const next = cursor + page.length;
  return { items: page, nextCursor: next < items.length ? String(next) : null };
}

const items = Array.from({ length: 25 }, (_, i) => `item-${i}`);

// Baseline: server-render cursor pages and show "Load more" link to nextCursor.
let cursor = 0;
for (;;) {
  const page = paginate(items, 10, cursor);
  console.log("page:", page.items);
  if (!page.nextCursor) break;
  cursor = Number(page.nextCursor);
}

// Enhanced: a client would call fetch when the sentinel is visible.

