export type FeedItem = { id: string; title: string; score: number };

let version = 1;
let items: FeedItem[] = [
  { id: "a", title: "Designing a cache key strategy", score: 99 },
  { id: "b", title: "Choosing ETag vs max-age", score: 92 },
  { id: "c", title: "Budgeted retries and backoff", score: 88 },
];

export function getFeed() {
  return { version, items };
}

export function bumpFeed() {
  version++;
  items = [{ id: `n_${version}`, title: `New item v${version}`, score: 80 }, ...items].slice(0, 10);
  return getFeed();
}

export function feedEtag(v: number) {
  return `"feed-${v}"`;
}

