// Demonstrates building and querying an inverted index.

const { buildIndex } = require("./index");
const { search } = require("./search");

const docs = [
  { id: "doc-1", text: "Designing data intensive systems" },
  { id: "doc-2", text: "Distributed systems and scalability" },
  { id: "doc-3", text: "Search engines use inverted indexes" },
];

const index = buildIndex(docs);
console.log(search(index, "systems"));
console.log(search(index, "search indexes"));
