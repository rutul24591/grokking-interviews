function staleDocuments(documents, thresholdMinutes) {
  return documents.filter((document) => document.freshnessMinutes > thresholdMinutes).map((document) => document.id);
}
console.log(staleDocuments([{ id: 'a', freshnessMinutes: 3 }, { id: 'b', freshnessMinutes: 24 }], 10));
