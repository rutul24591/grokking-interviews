"use client";

import { useState } from "react";

const entities = {
  users: {
    u1: { id: 'u1', name: 'Asha' },
    u2: { id: 'u2', name: 'Ben' }
  },
  comments: {
    c1: { id: 'c1', authorId: 'u2', text: 'Add metrics' },
    c2: { id: 'c2', authorId: 'u1', text: 'Ship in two phases' }
  },
  posts: {
    p1: { id: 'p1', title: 'Offline support rollout', authorId: 'u1', commentIds: ['c1', 'c2'] }
  }
} as const;

export default function Page() {
  const [selectedPostId] = useState("p1");
  const post = entities.posts[selectedPostId];
  const author = entities.users[post.authorId];
  return (
    <main className="mx-auto min-h-screen max-w-5xl p-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-violet-300">State normalization</p>
        <h1 className="mt-2 text-3xl font-semibold">Feed explorer</h1>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-xl font-medium">{post.title}</h2>
          <p className="mt-1 text-sm text-slate-400">Author: {author.name}</p>
          <div className="mt-4 space-y-3">
            {post.commentIds.map((commentId) => {
              const comment = entities.comments[commentId];
              const commentAuthor = entities.users[comment.authorId];
              return <div key={comment.id} className="rounded-xl border border-slate-800 px-3 py-3 text-sm text-slate-300">{commentAuthor.name}: {comment.text}</div>;
            })}
          </div>
        </article>
        <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
          <h2 className="text-lg font-medium">Normalized entity maps</h2>
          <p className="mt-3">users={Object.keys(entities.users).length} · comments={Object.keys(entities.comments).length} · posts={Object.keys(entities.posts).length}</p>
          <p className="mt-3 text-slate-400">Views compose post, author, and comments through IDs instead of nesting duplicate records.</p>
        </aside>
        </div>
      </section>
    </main>
  );
}
