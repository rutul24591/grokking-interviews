import type { Chunk } from "./chunk-plan";

export type ResumableUpload = {
  version: number;
  uploadId: string;
  fileName: string;
  fileSize: number;
  chunkSize: number;
  chunks: Chunk[];
  createdAt: number;
  updatedAt: number;
};

export function serialize(state: ResumableUpload) {
  return JSON.stringify(state);
}

export function deserialize(raw: string): ResumableUpload | null {
  try {
    const p = JSON.parse(raw) as ResumableUpload;
    if (typeof p.version !== "number") return null;
    if (!p.uploadId) return null;
    return p;
  } catch {
    return null;
  }
}

