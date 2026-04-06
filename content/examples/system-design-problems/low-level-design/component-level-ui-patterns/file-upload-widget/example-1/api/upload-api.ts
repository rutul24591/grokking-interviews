/**
 * Upload API — Public facade for the upload widget.
 *
 * Import this file from anywhere in the application to interact with uploads.
 * No React imports needed for programmatic usage.
 *
 * Usage:
 *   import { uploadApi } from '@/api/upload-api';
 *
 *   uploadApi.setConfig({ concurrencyLimit: 5 });
 *   uploadApi.cancelAll();
 */

import { useUploadStore } from '../lib/upload-store';
import type { UploadConfig } from '../lib/upload-types';

export const uploadApi = {
  /**
   * Update upload configuration.
   */
  setConfig: (config: Partial<UploadConfig>) => {
    useUploadStore.getState().setConfig(config);
  },

  /**
   * Cancel a specific upload by file ID.
   */
  cancel: (fileId: string) => {
    useUploadStore.getState().cancelUpload(fileId);
  },

  /**
   * Cancel all active and queued uploads.
   */
  cancelAll: () => {
    const { files } = useUploadStore.getState();
    files.forEach((_, fileId) => {
      useUploadStore.getState().cancelUpload(fileId);
    });
  },

  /**
   * Retry a failed upload by file ID.
   */
  retry: (fileId: string) => {
    useUploadStore.getState().retryFile(fileId);
  },

  /**
   * Get current upload progress for a file.
   */
  getProgress: (fileId: string) => {
    return useUploadStore.getState().getProgress(fileId);
  },

  /**
   * Get all active upload files.
   */
  getFiles: () => {
    return Array.from(useUploadStore.getState().files.values());
  },
};

export type { UploadConfig, UploadFile } from '../lib/upload-types';
