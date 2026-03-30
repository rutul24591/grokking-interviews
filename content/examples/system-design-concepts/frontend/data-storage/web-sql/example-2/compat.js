function decideStorageSupport({ webSql, indexedDb }) {
  if (indexedDb) return "indexeddb";
  if (webSql) return "migrate-legacy-websql";
  return "server-roundtrip";
}

console.log(decideStorageSupport({ webSql: true, indexedDb: true }));
console.log(decideStorageSupport({ webSql: true, indexedDb: false }));
console.log(decideStorageSupport({ webSql: false, indexedDb: false }));

