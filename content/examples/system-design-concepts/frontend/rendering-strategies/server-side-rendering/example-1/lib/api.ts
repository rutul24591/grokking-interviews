import type { ArticleResponse, FeedResponse, ProfileResponse } from "@/lib/types";

const API_ORIGIN = process.env.API_ORIGIN?.trim() || "http://localhost:4010";

function withUserHeaders(uid: string | null) {
  return uid ? { "x-user-id": uid } : {};
}

export async function getProfile(params: { uid: string | null }) {
  const res = await fetch(`${API_ORIGIN}/profile`, {
    cache: "no-store",
    headers: {
      ...withUserHeaders(params.uid),
    },
  });
  if (!res.ok) throw new Error(`Profile fetch failed (${res.status})`);
  return (await res.json()) as ProfileResponse;
}

export async function getFeed(params: { uid: string | null; q: string | null }) {
  const url = new URL(`${API_ORIGIN}/feed`);
  if (params.q) url.searchParams.set("q", params.q);

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      ...withUserHeaders(params.uid),
    },
  });
  if (!res.ok) throw new Error(`Feed fetch failed (${res.status})`);
  return (await res.json()) as FeedResponse;
}

export async function getArticle(params: { uid: string | null; id: string }) {
  const res = await fetch(`${API_ORIGIN}/articles/${encodeURIComponent(params.id)}`, {
    cache: "no-store",
    headers: {
      ...withUserHeaders(params.uid),
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Article fetch failed (${res.status})`);
  return (await res.json()) as ArticleResponse;
}

