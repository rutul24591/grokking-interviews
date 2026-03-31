"use client";
import { useEffect, useMemo, useState } from "react";
type User = { name: string; role: string; unreadCount: number; bio: string };
const inflight = new Map<string, Promise<User>>();
function dedupFetch(url: string) {
  if (!inflight.has(url)) {
    inflight.set(url, fetch(url, { cache: "no-store" }).then((r) => r.json()).finally(() => inflight.delete(url)));
  }
  return inflight.get(url)!;
}
function Consumer({ label, field, origin }: { label: string; field: keyof User; origin: string }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { dedupFetch(`${origin}/user`).then(setUser); }, [origin]);
  return <article className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div><div className="mt-3 text-sm font-semibold text-slate-900">{String(user?.[field] ?? "loading")}</div></article>;
}
export default function DedupBoard() {
  const origin = process.env.NEXT_PUBLIC_ORIGIN_API?.trim() || "http://localhost:4210";
  const consumers = useMemo(() => [
    { label: "Header", field: "name" as const },
    { label: "Sidebar", field: "role" as const },
    { label: "Notifications", field: "unreadCount" as const },
    { label: "Profile", field: "bio" as const },
  ], []);
  return <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">{consumers.map((c) => <Consumer key={c.label} {...c} origin={origin} />)}</section>;
}
