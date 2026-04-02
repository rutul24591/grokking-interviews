function evaluateMediaStaging(cases) {
  return cases.map((entry) => ({
    asset: entry.asset,
    canQueue: entry.sizeMb <= entry.maxSizeMb && entry.mimeAllowed,
    needsPreprocess: entry.type === "video" || entry.type === "audio",
    requiresWarning: entry.sizeMb > entry.maxSizeMb * 0.8
  }));
}

console.log(JSON.stringify(evaluateMediaStaging([
  { asset: "photo", sizeMb: 4, maxSizeMb: 10, mimeAllowed: true, type: "image" },
  { asset: "video", sizeMb: 42, maxSizeMb: 50, mimeAllowed: true, type: "video" },
  { asset: "archive", sizeMb: 65, maxSizeMb: 25, mimeAllowed: false, type: "file" }
]), null, 2));
