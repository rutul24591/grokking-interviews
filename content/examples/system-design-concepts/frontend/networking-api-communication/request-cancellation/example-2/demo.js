const requests = [
  { name: "cache", startedAt: 0, completedAt: 900 },
  { name: "caching", startedAt: 150, completedAt: 600 },
  { name: "cached", startedAt: 280, completedAt: 500 }
];

let active = null;
for (const request of requests) {
  if (active) console.log(`abort ${active.name} at ${request.startedAt} ms`);
  active = request;
  console.log(`start ${request.name}`);
}
console.log(`apply ${active.name} at ${active.completedAt} ms`);
