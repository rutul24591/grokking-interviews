"use client";

import { useEffect, useState } from "react";
import { addNote, getAllNotes, getByTag, initDb, type NoteRecord } from "../lib/idb";

export function IndexedDbClient() {
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [tagFilter, setTagFilter] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("");

  async function refresh() {
    const next = tagFilter ? await getByTag(tagFilter) : await getAllNotes();
    setNotes(next);
  }

  useEffect(() => {
    void initDb().then(refresh);
  }, [tagFilter]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
        <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2" placeholder="Tag" value={tag} onChange={(e) => setTag(e.target.value)} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white"
          onClick={async () => {
            await addNote({ id: crypto.randomUUID(), title, body, tag });
            setTitle("");
            setBody("");
            setTag("");
            await refresh();
          }}
        >
          Save note
        </button>
        <input className="rounded-md border border-white/10 bg-black/20 px-3 py-2" placeholder="Filter by tag" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} />
      </div>

      <div className="space-y-2 text-sm">
        {notes.map((note) => (
          <div key={note.id} className="rounded-md border border-white/10 bg-black/20 p-3">
            <div className="font-semibold">{note.title}</div>
            <div className="text-white/70">{note.body}</div>
            <div className="mt-1 text-cyan-300">{note.tag}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

