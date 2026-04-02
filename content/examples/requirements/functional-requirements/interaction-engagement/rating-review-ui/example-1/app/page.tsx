"use client";

import { useEffect, useState } from "react";

type Review = {
  id: string;
  author: string;
  rating: number;
  status: "published" | "pending";
};

type RatingState = {
  average: number;
  reviews: Review[];
  draftRating: number;
  lastMessage: string;
};

export default function Page() {
  const [state, setState] = useState<RatingState | null>(null);

  async function refresh() {
    const response = await fetch("/api/rating-review-ui/state");
    setState((await response.json()) as RatingState);
  }

  async function act(type: "submit-review" | "change-rating") {
    const response = await fetch("/api/rating-review-ui/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setState((await response.json()) as RatingState);
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Rating Review UI</h1>
      <p className="mt-2 text-slate-300">Capture ratings and reviews while keeping average score, pending moderation, and draft state visible to the user.</p>
      <section className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
          <div className="text-xs uppercase tracking-wide text-slate-500">Average rating</div>
          <div className="mt-2 text-2xl font-semibold text-slate-100">{state?.average}</div>
          <button onClick={() => void act("change-rating")} className="mt-4 rounded border border-slate-700 px-4 py-2 text-sm font-semibold">Adjust draft rating</button>
          <button onClick={() => void act("submit-review")} className="mt-3 rounded bg-sky-600 px-4 py-2 text-sm font-semibold">Submit review</button>
          <p className="mt-4 text-slate-400">{state?.lastMessage}</p>
        </article>
        <article className="space-y-4">
          {state?.reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
              <div className="font-semibold text-slate-100">{review.author}</div>
              <div className="mt-1 text-xs text-slate-500">rating {review.rating} · {review.status}</div>
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
