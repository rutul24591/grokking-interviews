import { create } from 'zustand';
import type { UploadFile, UploadConfig, ChunkState, UploadStatus } from './upload-types';
import { DEFAULT_CONFIG, computeProgress } from './upload-types';
import { initUpload } from '../services/upload-service';
import { executeUpload } from '../services/chunk-manager';
import { loadSessions, deleteSession } from './indexeddb-helper';

interface UploadStoreState {
  files: Map<string, UploadFile>;
  queue: string[]; // ordered array of fileIds
  activeCount: number;
  config: UploadConfig;
  resumableSessions: Array<{ uploadId: string; fileName: string; fileSize: number; completedChunks: number[]; totalChunks: number }>;

  // Actions
  setConfig: (config: Partial<UploadConfig>) => void;
  addFiles: (files: FileList | File[]) => void;
  startUpload: (fileId: string) => Promise<void>;
  cancelUpload: (fileId: string) => void;
  retryFile: (fileId: string) => void;
  resumeSessions: () => Promise<void>;
  dismissResumeSession: (uploadId: string) => void;
  getFile: (fileId: string) => UploadFile | undefined;
  getProgress: (fileId: string) => number;
}

function createChunks(file: File, chunkSize: number, completedIndices: number[] = []): ChunkState[] {
  const chunks: ChunkState[] = [];
  const totalChunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const blob = file.slice(start, end);

    chunks.push({
      index: i,
      blob,
      size: blob.size,
      status: completedIndices.includes(i) ? 'completed' : 'pending',
      progress: completedIndices.includes(i) ? 100 : 0,
      retryCount: 0,
      presignedUrl: '',
    });
  }

  return chunks;
}

function validateFile(file: File, config: UploadConfig): string | null {
  if (file.size > config.maxFileSize) {
    return `File "${file.name}" exceeds maximum size of ${config.maxFileSize / (1024 * 1024)} MB`;
  }

  if (config.allowedTypes.length > 0 && !config.allowedTypes.includes(file.type)) {
    return `File type "${file.type}" is not allowed for "${file.name}"`;
  }

  return null;
}

// CSRF token — in production, read from a cookie or meta tag
function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';
}

export const useUploadStore = create<UploadStoreState>((set, get) => ({
  files: new Map(),
  queue: [],
  activeCount: 0,
  config: DEFAULT_CONFIG,
  resumableSessions: [],

  setConfig: (partial) => {
    set((state) => ({
      config: { ...state.config, ...partial },
    }));
  },

  addFiles: (fileInput) => {
    const { config, files, queue, activeCount } = get();
    const fileList = Array.from(fileInput);
    const newFileIds: string[] = [];

    for (const file of fileList) {
      // Validate
      const error = validateFile(file, config);
      if (error) {
        console.warn(error);
        continue;
      }

      const fileId = crypto.randomUUID();
      const chunks = createChunks(file, config.chunkSize);

      const uploadFile: UploadFile = {
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        chunks,
        status: 'queued',
        progress: 0,
        uploadId: null,
        abortController: null,
        errorMessage: null,
        createdAt: Date.now(),
      };

      const newFiles = new Map(files);
      newFiles.set(fileId, uploadFile);
      newFileIds.push(fileId);
    }

    // Add to queue
    const newQueue = [...queue, ...newFileIds];

    set({ files: newFiles, queue: newQueue });

    // Start uploads for available slots
    for (const fileId of newFileIds) {
      if (get().activeCount < get().config.concurrencyLimit) {
        get().startUpload(fileId);
      }
    }
  },

  startUpload: async (fileId: string) => {
    const { files, queue, activeCount, config } = get();
    const file = files.get(fileId);

    if (!file) return;
    if (activeCount >= config.concurrencyLimit) return; // No slot available

    // Remove from queue
    const newQueue = queue.filter((id) => id !== fileId);

    // Mark as uploading
    const abortController = new AbortController();
    const updatedFile = {
      ...file,
      status: 'uploading' as UploadStatus,
      abortController,
    };
    const newFiles = new Map(files);
    newFiles.set(fileId, updatedFile);

    set({ files: newFiles, queue: newQueue, activeCount: activeCount + 1 });

    try {
      // Step 1: Init upload — get uploadId + pre-signed URLs
      const initResponse = await initUpload(
        {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          chunkCount: file.chunks.length,
          csrfToken: getCsrfToken(),
        },
        config.apiEndpoint,
        abortController.signal
      );

      // Assign uploadId and pre-signed URLs to chunks
      const chunksWithUrls = file.chunks.map((chunk, i) => ({
        ...chunk,
        presignedUrl: initResponse.presignedUrls[i] || '',
      }));

      const fileWithUploadId = {
        ...get().files.get(fileId)!,
        uploadId: initResponse.uploadId,
        chunks: chunksWithUrls,
      };

      const finalFiles = new Map(get().files);
      finalFiles.set(fileId, fileWithUploadId);
      set({ files: finalFiles });

      // Step 2: Execute chunk uploads
      await executeUpload(fileWithUploadId, getCsrfToken(), {
        onChunkComplete: (fid, chunkIndex) => {
          const state = get();
          const f = state.files.get(fid);
          if (!f) return;

          const newChunks = [...f.chunks];
          newChunks[chunkIndex] = { ...newChunks[chunkIndex], status: 'completed' as const, progress: 100 };
          const progress = computeProgress(newChunks);

          const updated = { ...f, chunks: newChunks, progress };
          const fs = new Map(state.files);
          fs.set(fid, updated);
          set({ files: fs });
        },

        onChunkProgress: (fid, chunkIndex, progress) => {
          const state = get();
          const f = state.files.get(fid);
          if (!f) return;

          const newChunks = [...f.chunks];
          newChunks[chunkIndex] = { ...newChunks[chunkIndex], progress };
          const overallProgress = computeProgress(newChunks);

          const updated = { ...f, chunks: newChunks, progress: overallProgress };
          const fs = new Map(state.files);
          fs.set(fid, updated);
          set({ files: fs });
        },

        onChunkFailed: (fid, chunkIndex, error) => {
          const state = get();
          const f = state.files.get(fid);
          if (!f) return;

          const newChunks = [...f.chunks];
          newChunks[chunkIndex] = { ...newChunks[chunkIndex], status: 'failed' as const };

          const updated = { ...f, chunks: newChunks, errorMessage: error };
          const fs = new Map(state.files);
          fs.set(fid, updated);
          set({ files: fs });
        },

        onAllComplete: (fid) => {
          const state = get();
          const f = state.files.get(fid);
          if (!f) return;

          const updated = { ...f, status: 'completed' as const, progress: 100 };
          const fs = new Map(state.files);
          fs.set(fid, updated);
          set({
            files: fs,
            activeCount: state.activeCount - 1,
          });

          // Start next queued file
          if (state.queue.length > 0) {
            const nextFileId = state.queue[0];
            get().startUpload(nextFileId);
          }
        },

        onAllFailed: (fid, error) => {
          const state = get();
          const f = state.files.get(fid);
          if (!f) return;

          const updated = { ...f, status: 'failed' as const, errorMessage: error };
          const fs = new Map(state.files);
          fs.set(fid, updated);
          set({
            files: fs,
            activeCount: state.activeCount - 1,
          });

          // Start next queued file
          if (state.queue.length > 0) {
            const nextFileId = state.queue[0];
            get().startUpload(nextFileId);
          }
        },
      });
    } catch (error) {
      // Init upload failed
      const state = get();
      const f = state.files.get(fileId);
      if (!f) return;

      const errorMessage = error instanceof Error ? error.message : 'Init upload failed';
      const updated = { ...f, status: 'failed' as const, errorMessage };
      const fs = new Map(state.files);
      fs.set(fileId, updated);
      set({
        files: fs,
        activeCount: Math.max(0, state.activeCount - 1),
      });

      // Start next queued file
      if (state.queue.length > 0) {
        const nextFileId = state.queue[0];
        get().startUpload(nextFileId);
      }
    }
  },

  cancelUpload: (fileId: string) => {
    const { files, queue } = get();
    const file = files.get(fileId);

    if (!file) return;

    // Abort in-flight request
    if (file.abortController) {
      file.abortController.abort();
    }

    // Clean up IndexedDB
    if (file.uploadId) {
      deleteSession(file.uploadId).catch(console.error);
    }

    // Remove from store
    const newFiles = new Map(files);
    newFiles.delete(fileId);

    // Remove from queue if present
    const newQueue = queue.filter((id) => id !== fileId);

    set({
      files: newFiles,
      queue: newQueue,
      activeCount: file.status === 'uploading' ? get().activeCount - 1 : get().activeCount,
    });
  },

  retryFile: (fileId: string) => {
    const { files } = get();
    const file = files.get(fileId);

    if (!file || file.status !== 'failed') return;

    // Reset failed chunks to pending, keep completed ones
    const resetChunks = file.chunks.map((chunk) => {
      if (chunk.status === 'failed') {
        return { ...chunk, status: 'pending' as const, retryCount: 0, progress: 0 };
      }
      return chunk;
    });

    const newFiles = new Map(files);
    newFiles.set(fileId, {
      ...file,
      chunks: resetChunks,
      status: 'queued' as UploadStatus,
      errorMessage: null,
      progress: computeProgress(resetChunks),
      uploadId: null,
      abortController: null,
    });

    set({ files: newFiles, queue: [...get().queue, fileId] });

    // Start upload if slot available
    if (get().activeCount < get().config.concurrencyLimit) {
      get().startUpload(fileId);
    }
  },

  resumeSessions: async () => {
    try {
      const sessions = await loadSessions();
      set({ resumableSessions: sessions });
    } catch (error) {
      console.error('Failed to load resume sessions:', error);
    }
  },

  dismissResumeSession: (uploadId: string) => {
    const { resumableSessions } = get();
    set({
      resumableSessions: resumableSessions.filter((s) => s.uploadId !== uploadId),
    });
    // Also delete from IndexedDB
    deleteSession(uploadId).catch(console.error);
  },

  getFile: (fileId: string) => {
    return get().files.get(fileId);
  },

  getProgress: (fileId: string) => {
    const file = get().files.get(fileId);
    if (!file) return 0;
    return file.progress;
  },
}));
