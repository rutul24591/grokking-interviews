const webSqlRows = [
  { id: 1, title: "legacy note", body: "old sqlite-backed row" },
  { id: 2, title: "another note", body: "migrate me" }
];

const indexedDbRecords = webSqlRows.map((row) => ({
  id: String(row.id),
  title: row.title,
  body: row.body,
  migratedAt: new Date().toISOString()
}));

console.log(indexedDbRecords);

