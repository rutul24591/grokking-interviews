// pnpm add @aspect-build/zstd  (or similar binding)

const { compress, decompress, train } = require('@aspect-build/zstd');

// Basic compression
const input = Buffer.from(JSON.stringify(largeApiResponse));
const compressed = compress(input, 3);  // Level 3 — fast, good ratio

console.log(`\${input.length} → \${compressed.length} (\${((1 - compressed.length/input.length) * 100).toFixed(1)}% reduction)`);

// Dictionary training — powerful for small, repetitive payloads
const samples = apiResponses.map(r => Buffer.from(JSON.stringify(r)));
const dictionary = train(samples, { dictSize: 32768 });  // 32KB dict

// Compression with trained dictionary — much better for small payloads
const withDict = compress(input, 3, dictionary);
console.log(`With dictionary: \${input.length} → \${withDict.length}`);
// For small JSON payloads (<1KB), dictionaries can improve ratio by 40-60%