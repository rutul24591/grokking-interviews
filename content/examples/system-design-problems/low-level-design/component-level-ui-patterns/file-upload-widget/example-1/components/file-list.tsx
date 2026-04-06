'use client';

import { useEffect } from 'react';
import { useUploadStore } from '../lib/upload-store';
import { FileListItem } from './file-list-item';
import { formatFileSize } from '../lib/upload-types';

export function FileList() {
  const files = useUploadStore((state) => Array.from(state.files.values()));
  const queue = useUploadStore((state) => state.queue);
  const activeCount = useUploadStore((state) => state.activeCount);
  const concurrencyLimit = useUploadStore((state) => state.config.concurrencyLimit);
  const resumableSessions = useUploadStore((state) => state.resumableSessions);
  const resumeSessions = useUploadStore((state) => state.resumeSessions);
  const dismissResumeSession = useUploadStore((state) => state.dismissResumeSession);

  // Load resume sessions on mount
  useEffect(() => {
    resumeSessions();
  }, [resumeSessions]);

  if (files.size === 0 && resumableSessions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4" role="list" aria-label="File upload list">
      {/* Resume sessions prompt */}
      {resumableSessions.length > 0 && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-yellow-900/30">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {resumableSessions.length} incomplete upload(s) found. Resume or discard?
          </p>
          <div className="mt-3 space-y-2">
            {resumableSessions.map((session) => (
              <div
                key={session.uploadId}
                className="flex items-center justify-between rounded bg-white px-3 py-2 dark:bg-gray-800"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {session.fileName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.completedChunks}/{session.totalChunks} chunks complete
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                  >
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => dismissResumeSession(session.uploadId)}
                    className="rounded px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queue info */}
      {queue.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {activeCount} uploading, {queue.length} queued (limit: {concurrencyLimit} concurrent)
        </p>
      )}

      {/* File list */}
      {files.map((file) => (
        <FileListItem key={file.id} file={file} />
      ))}
    </div>
  );
}
