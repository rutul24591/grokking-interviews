const budgetKb = {
  initialRoute: 170,
  sharedVendors: 120,
  asyncChunk: 90,
};

const buildStats = {
  initialRoute: 188,
  sharedVendors: 96,
  asyncChunk: 74,
};

let failed = false;

for (const [chunkName, limit] of Object.entries(budgetKb)) {
  const actual = buildStats[chunkName];
  const pass = actual <= limit;
  failed ||= !pass;

  console.log(`${chunkName}: ${actual}kb / budget ${limit}kb -> ${pass ? "pass" : "fail"}`);
}

if (failed) {
  console.error("\nBundle budget regression detected.");
  process.exit(1);
}
