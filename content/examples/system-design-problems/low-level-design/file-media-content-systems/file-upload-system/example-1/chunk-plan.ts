export type Chunk = { index: number; start: number; end: number; uploaded: boolean };

export function planChunks(fileSize: number, chunkSize: number): Chunk[] {
  const chunks: Chunk[] = [];
  let i = 0;
  for (let start = 0; start < fileSize; start += chunkSize) {
    chunks.push({ index: i++, start, end: Math.min(fileSize, start + chunkSize), uploaded: false });
  }
  return chunks;
}

export function fileProgress(chunks: Chunk[]) {
  const total = chunks.length;
  const done = chunks.filter((c) => c.uploaded).length;
  return total === 0 ? 0 : done / total;
}

