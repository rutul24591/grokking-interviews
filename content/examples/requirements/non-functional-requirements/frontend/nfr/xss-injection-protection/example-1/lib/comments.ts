export type Comment = { id: string; ts: number; author: string; text: string };

let seq = 0;
let comments: Comment[] = [
  { id: "c1", ts: Date.now() - 40_000, author: "alice", text: "Hello **world**. Use `code` formatting." }
];
seq = 1;

export function listComments() {
  return comments;
}

export function addComment(author: string, text: string) {
  seq++;
  const c: Comment = { id: `c${seq}`, ts: Date.now(), author, text };
  comments = [c, ...comments].slice(0, 50);
  return c;
}

export function resetComments() {
  seq = 1;
  comments = [{ id: "c1", ts: Date.now() - 40_000, author: "alice", text: "Hello **world**. Use `code` formatting." }];
}

