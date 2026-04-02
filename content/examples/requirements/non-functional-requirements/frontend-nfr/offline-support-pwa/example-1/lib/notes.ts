export type Note = { id: string; ts: number; text: string };

let seq = 0;
let notes: Note[] = [
  { id: "n_1", ts: Date.now() - 60_000, text: "Offline first: cache what users need, not everything." },
  { id: "n_2", ts: Date.now() - 30_000, text: "Make writes resilient: queue and replay when online." }
];

export function resetNotes() {
  seq = 2;
  notes = [
    { id: "n_1", ts: Date.now() - 60_000, text: "Offline first: cache what users need, not everything." },
    { id: "n_2", ts: Date.now() - 30_000, text: "Make writes resilient: queue and replay when online." }
  ];
}

export function listNotes() {
  return { notes, version: seq };
}

export function addNote(text: string) {
  seq++;
  const n: Note = { id: `n_${seq + 2}`, ts: Date.now(), text };
  notes = [n, ...notes].slice(0, 50);
  return { note: n, ...listNotes() };
}

