"use client";

import { dedupedFetch } from "@/lib/client/dedupe";
import { getCached, setCached } from "@/lib/client/etagCache";

export type Feed = { version: number; items: Array<{ id: string; title: string; score: number }> };

export type FeedFetchResult = {
  status: number;
  fromCache: boolean;
  bytes: number;
  feed: Feed | null;
};

export async function fetchFeed(): Promise<FeedFetchResult> {
  const cacheKey = "feed:v1";
  const cached = getCached<Feed>(cacheKey);

  const res = await dedupedFetch("GET:/api/feed", async () => {
    return await fetch("/api/feed", {
      headers: cached ? { "if-none-match": cached.etag } : {},
      cache: "no-store",
    });
  });

  if (res.status === 304 && cached) {
    return { status: 304, fromCache: true, bytes: 0, feed: cached.value };
  }

  const text = await res.text();
  const bytes = new TextEncoder().encode(text).length;
  const feed = text ? (JSON.parse(text) as Feed) : null;
  const etag = res.headers.get("etag");
  if (etag && feed) setCached(cacheKey, etag, feed);
  return { status: res.status, fromCache: false, bytes, feed };
}

