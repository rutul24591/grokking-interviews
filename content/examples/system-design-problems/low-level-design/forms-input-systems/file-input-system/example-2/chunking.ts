export type Chunk = { index: number; start: number; end: number };

export function splitIntoChunks(size: number, chunkSize: number): Chunk[] {
  const out: Chunk[] = [];
  let i = 0;
  for (let start = 0; start < size; start += chunkSize) {
    out.push({ index: i++, start, end: Math.min(size, start + chunkSize) });
  }
  return out;
}

