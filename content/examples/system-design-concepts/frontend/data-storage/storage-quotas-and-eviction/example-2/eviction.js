const assets = [
  { key: "hero-image", priority: 1, lastUsedHoursAgo: 2 },
  { key: "archived-feed", priority: 3, lastUsedHoursAgo: 240 },
  { key: "draft-cache", priority: 0, lastUsedHoursAgo: 1 },
  { key: "metrics-snapshot", priority: 2, lastUsedHoursAgo: 48 }
];

const ordered = [...assets].sort((a, b) => b.priority - a.priority || b.lastUsedHoursAgo - a.lastUsedHoursAgo);
console.log("evict first:", ordered.map((item) => item.key));

