// Cursor-based pagination helpers for collection endpoints.

function paginate(items, limit, cursor) {
  const startIndex = cursor ? items.findIndex((item) => item.id === cursor) + 1 : 0;
  const slice = items.slice(startIndex, startIndex + limit);
  const nextCursor = slice.length ? slice[slice.length - 1].id : null;
  return { slice, nextCursor };
}

function buildMeta({ limit, nextCursor, total }) {
  return {
    limit,
    nextCursor,
    total,
  };
}

module.exports = { paginate, buildMeta };
