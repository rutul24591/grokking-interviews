console.log("Example proof path for chunk-b:");
console.table([
  { level: 0, sibling: "hash(chunk-a)" },
  { level: 1, sibling: "hash(hash(chunk-c)+hash(chunk-d))" },
]);
console.log("Verification recomputes the root using the target leaf plus sibling hashes.");
