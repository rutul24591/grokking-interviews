"use client";

import type { BookmarksResponse } from "@/lib/types";

const API_ORIGIN =
  process.env.NEXT_PUBLIC_ORIGIN_API?.trim() ||
  process.env.ORIGIN_API?.trim() ||
  "http://localhost:4030";

let cachedUid: string | null = null;
let bookmarksPromise: Promise<BookmarksResponse> | null = null;
let cachedSet: Set<string> | null = null;

function randomUid() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getUid(): string {
  if (cachedUid) return cachedUid;
  const key = "uid";
  const existing = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
  const uid = existing && existing.length > 8 ? existing : randomUid();
  if (!existing) window.localStorage.setItem(key, uid);
  cachedUid = uid;
  return uid;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export async function getBookmarks(): Promise<Set<string>> {
  if (cachedSet) return cachedSet;
  if (!bookmarksPromise) {
    const url = new URL("/v1/bookmarks", API_ORIGIN);
    url.searchParams.set("uid", getUid());
    bookmarksPromise = fetchJson<BookmarksResponse>(url.toString(), { cache: "no-store" });
  }
  const data = await bookmarksPromise;
  cachedSet = new Set(data.bookmarkedIds);
  return cachedSet;
}

export async function toggleBookmark(articleId: string): Promise<Set<string>> {
  const uid = getUid();
  const url = new URL(`/v1/bookmarks/${encodeURIComponent(articleId)}/toggle`, API_ORIGIN);
  url.searchParams.set("uid", uid);

  // Optimistic update against the cached set.
  const set = (await getBookmarks()) as Set<string>;
  if (set.has(articleId)) set.delete(articleId);
  else set.add(articleId);

  // Fire-and-confirm: reconcile with server response.
  const res = await fetchJson<BookmarksResponse>(url.toString(), { method: "POST" });
  cachedSet = new Set(res.bookmarkedIds);
  return cachedSet;
}

