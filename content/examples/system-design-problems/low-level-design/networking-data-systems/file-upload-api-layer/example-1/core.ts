export type Begin = { fileName: string; fileSize: number; chunkSize: number };
export type BeginResp = { uploadId: string; uploadedChunks?: number[] };

export type ChunkReq = { uploadId: string; chunkIndex: number; start: number; end: number };

export type CommitReq = { uploadId: string };
export type CommitResp = { objectKey: string };

export type UploadApi = {
  begin: (b: Begin, signal: AbortSignal) => Promise<BeginResp>;
  uploadChunk: (c: ChunkReq, signal: AbortSignal, onProgress: (p: number) => void) => Promise<void>;
  commit: (c: CommitReq, signal: AbortSignal) => Promise<CommitResp>;
};
