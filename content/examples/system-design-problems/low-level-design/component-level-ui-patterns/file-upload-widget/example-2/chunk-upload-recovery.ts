/**
 * Chunk Upload Recovery — Resumes interrupted file uploads from the last successful chunk.
 *
 * Interview edge case: User uploads a 100MB file, gets to chunk 15/20, then loses
 * internet. On reconnect, the upload should resume from chunk 15, not restart from 0.
 * Solution: persist chunk progress to IndexedDB, verify with server on reconnect.
 */

export interface UploadSession {
  fileId: string;
  fileName: string;
  totalSize: number;
  chunkSize: number;
  uploadedChunks: Set<number>;
  status: 'uploading' | 'paused' | 'completed' | 'failed';
  lastUpdated: number;
}

const STORE_NAME = 'upload-sessions';
const DB_NAME = 'upload-recovery';
const DB_VERSION = 1;

/**
 * Opens IndexedDB for upload session storage.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'fileId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves upload session progress to IndexedDB.
 */
export async function saveUploadProgress(session: UploadSession): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.put({ ...session, uploadedChunks: [...session.uploadedChunks], lastUpdated: Date.now() });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Loads upload session from IndexedDB. Returns null if no session exists.
 */
export async function loadUploadProgress(fileId: string): Promise<UploadSession | null> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const request = store.get(fileId);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const data = request.result;
      if (!data) return resolve(null);
      resolve({ ...data, uploadedChunks: new Set(data.uploadedChunks) });
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clears upload session after completion.
 */
export async function clearUploadProgress(fileId: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(fileId);
}

/**
 * Calculates which chunks still need to be uploaded.
 */
export function getPendingChunks(session: UploadSession, totalChunks: number): number[] {
  const pending: number[] = [];
  for (let i = 0; i < totalChunks; i++) {
    if (!session.uploadedChunks.has(i)) pending.push(i);
  }
  return pending;
}
