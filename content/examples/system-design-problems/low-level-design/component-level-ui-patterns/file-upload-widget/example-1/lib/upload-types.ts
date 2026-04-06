export type UploadStatus =
  | 'queued'
  | 'uploading'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type ChunkStatus = 'pending' | 'uploading' | 'completed' | 'failed';

export interface ChunkState {
  index: number;
  blob: Blob;
  size: number;
  status: ChunkStatus;
  progress: number; // 0-100
  retryCount: number;
  presignedUrl: string;
}

export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  chunks: ChunkState[];
  status: UploadStatus;
  progress: number; // 0-100, computed from chunks
  uploadId: string | null;
  abortController: AbortController | null;
  errorMessage: string | null;
  createdAt: number;
}

export interface UploadConfig {
  chunkSize: number; // bytes, default: 5 MB
  concurrencyLimit: number; // parallel uploads, default: 3
  maxRetries: number; // per chunk, default: 3
  allowedTypes: string[]; // MIME types, empty = all allowed
  maxFileSize: number; // bytes, default: 5 GB
  apiEndpoint: string; // base URL for init/complete
}

export const DEFAULT_CONFIG: UploadConfig = {
  chunkSize: 5 * 1024 * 1024, // 5 MB
  concurrencyLimit: 3,
  maxRetries: 3,
  allowedTypes: [],
  maxFileSize: 5 * 1024 * 1024 * 1024, // 5 GB
  apiEndpoint: '/api/upload',
};

export const FILE_TYPE_ICONS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/zip': 'ZIP',
  'text/plain': 'TXT',
  'text/csv': 'CSV',
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function computeProgress(chunks: ChunkState[]): number {
  if (chunks.length === 0) return 0;
  const completed = chunks.filter((c) => c.status === 'completed').length;
  return Math.round((completed / chunks.length) * 100);
}
