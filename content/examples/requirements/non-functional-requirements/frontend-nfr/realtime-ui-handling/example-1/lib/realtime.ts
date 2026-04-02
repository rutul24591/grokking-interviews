export type Message = { cursor: number; id: string; ts: number; text: string };

let cursor = 0;
let messages: Message[] = [
  { cursor: 1, id: "m_1", ts: Date.now() - 30_000, text: "Welcome — open two tabs to see sync." }
];
cursor = 1;

const listeners = new Set<(m: Message) => void>();

export function resetRealtime() {
  cursor = 0;
  messages = [];
}

export function publish(text: string) {
  cursor++;
  const m: Message = { cursor, id: `m_${cursor}`, ts: Date.now(), text };
  messages = [m, ...messages].slice(0, 100);
  for (const fn of listeners) fn(m);
  return m;
}

export function snapshot(sinceCursor: number) {
  const newOnes = messages.filter((m) => m.cursor > sinceCursor).sort((a, b) => a.cursor - b.cursor);
  return { cursor, messages: newOnes };
}

export function subscribe(fn: (m: Message) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

