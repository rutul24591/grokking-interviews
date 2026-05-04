export type BeginUploadRequest = { fileName: string; fileSize: number; chunkSize: number; checksum?: string };
export type BeginUploadResponse = { uploadId: string; uploadedChunks?: number[] };

export type UploadChunkRequest = { uploadId: string; chunkIndex: number; start: number; end: number; checksum?: string };

export type CommitRequest = { uploadId: string };
export type CommitResponse = { objectKey: string };

