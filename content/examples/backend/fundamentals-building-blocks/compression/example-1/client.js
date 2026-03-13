// Runs compression comparisons on a JSON payload.

const { gzip, brotli } = require("./compress");

const payload = {
  id: 1,
  name: "inventory",
  items: Array.from({ length: 100 }, (_, i) => ({
    id: i,
    sku: `sku-${i}`,
    description: "High throughput inventory item",
  })),
};

const raw = Buffer.from(JSON.stringify(payload), "utf8");
const gz = gzip(raw);
const br = brotli(raw);

console.log({
  rawBytes: raw.length,
  gzipBytes: gz.length,
  brotliBytes: br.length,
});
