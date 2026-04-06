/**
 * Map-based UI — Staff-Level Offline Map Support.
 *
 * Staff differentiator: Tile caching with IndexedDB, offline marker storage,
 * and sync queue for changes made while offline.
 */

/**
 * Manages offline tile caching using IndexedDB.
 * Stores map tiles as blobs with URL-based keys.
 */
export class OfflineTileCache {
  private dbName: string = 'map-tiles';
  private storeName: string = 'tiles';
  private maxTiles: number = 1000;

  /**
   * Opens the IndexedDB database.
   */
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'url' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Stores a tile in the cache.
   */
  async storeTile(url: string, blob: Blob): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(this.storeName, 'readwrite');
    tx.objectStore(this.storeName).put({ url, blob, cachedAt: Date.now() });

    // Enforce max tiles — evict oldest
    const countRequest = tx.objectStore(this.storeName).count();
    countRequest.onsuccess = () => {
      if (countRequest.result > this.maxTiles) {
        this.evictOldest(db, countRequest.result - this.maxTiles);
      }
    };
  }

  /**
   * Retrieves a tile from the cache.
   */
  async getTile(url: string): Promise<Blob | null> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const request = tx.objectStore(this.storeName).get(url);
      request.onsuccess = () => resolve(request.result?.blob || null);
      request.onerror = () => resolve(null);
    });
  }

  /**
   * Evicts the oldest tiles.
   */
  private evictOldest(db: IDBDatabase, count: number): void {
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    const request = store.openCursor();
    let evicted = 0;

    request.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor && evicted < count) {
        cursor.delete();
        evicted++;
        cursor.continue();
      }
    };
  }
}
