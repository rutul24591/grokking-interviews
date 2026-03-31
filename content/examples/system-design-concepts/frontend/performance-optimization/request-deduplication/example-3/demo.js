const requests = [
  { atMs: 0, query: "r" },
  { atMs: 40, query: "re" },
  { atMs: 90, query: "ren" },
];
let active = null;
for (const request of requests) {
  if (active) console.log(`abort ${active.query}`);
  active = request;
  console.log(`start ${request.query} at ${request.atMs}ms`);
}
console.log(`keep ${active.query} only`);
