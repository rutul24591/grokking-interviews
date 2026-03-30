const records = [
  { key: "draft-1", ttlHours: 2, critical: true },
  { key: "search-cache", ttlHours: 24, critical: false },
  { key: "analytics-buffer", ttlHours: 12, critical: false }
];

const cleanup = records.filter((record) => !record.critical).map((record) => record.key);
console.log("cleanup targets", cleanup);
console.log("keep critical drafts until explicit sync or export");

