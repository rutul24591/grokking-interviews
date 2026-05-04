export type Page<T> = { items: T[]; nextCursor: string | null };

export type Fetcher<T> = (cursor: string | null) => Promise<Page<T>>;

export function createCursorPager<T>(fetcher: Fetcher<T>) {
  let cursor: string | null = null;
  let loading: Promise<void> | null = null;
  const items: T[] = [];

  async function loadMore() {
    if (loading) return loading;
    loading = (async () => {
      const page = await fetcher(cursor);
      items.push(...page.items);
      cursor = page.nextCursor;
    })().finally(() => {
      loading = null;
    });
    return loading;
  }

  return { items, loadMore, get hasMore() { return cursor !== null; } };
}

