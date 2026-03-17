# Offline-First Architecture Examples

## Example 1: IndexedDB-Based Local Store with Outbox Pattern

```javascript
const DB_NAME = 'offline-app';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('documents', { keyPath: 'id' });
      db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Write locally first, queue for sync
async function saveDocument(doc) {
  const db = await openDB();
  const tx = db.transaction(['documents', 'outbox'], 'readwrite');

  // Save to local store
  doc.updatedAt = Date.now();
  doc.version = (doc.version || 0) + 1;
  tx.objectStore('documents').put(doc);

  // Queue mutation for sync
  tx.objectStore('outbox').add({
    type: 'UPDATE',
    collection: 'documents',
    payload: doc,
    timestamp: Date.now(),
  });

  await new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });

  // Trigger background sync if available
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const reg = await navigator.serviceWorker.ready;
    await reg.sync.register('sync-outbox');
  }
}

// Read always from local store
async function getDocument(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('documents', 'readonly');
    const request = tx.objectStore('documents').get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

## Example 2: Sync Engine with Conflict Detection

```javascript
class SyncEngine {
  constructor(apiBase) {
    this.apiBase = apiBase;
    this.syncing = false;
  }

  async syncOutbox() {
    if (this.syncing) return;
    this.syncing = true;

    try {
      const db = await openDB();
      const tx = db.transaction('outbox', 'readonly');
      const outbox = tx.objectStore('outbox');
      const mutations = await this.getAllFromStore(outbox);

      for (const mutation of mutations) {
        try {
          const result = await fetch(`${this.apiBase}/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mutation),
          });

          if (result.ok) {
            const response = await result.json();

            if (response.conflict) {
              await this.resolveConflict(mutation, response);
            }

            // Remove from outbox
            const deleteTx = db.transaction('outbox', 'readwrite');
            deleteTx.objectStore('outbox').delete(mutation.id);
          } else if (result.status === 409) {
            // Version conflict — fetch server version and merge
            await this.handleVersionConflict(mutation);
          }
        } catch (err) {
          // Network error — stop syncing, retry later
          break;
        }
      }
    } finally {
      this.syncing = false;
    }
  }

  async resolveConflict(local, serverResponse) {
    const serverVersion = serverResponse.serverDocument;
    const merged = this.fieldLevelMerge(local.payload, serverVersion);

    const db = await openDB();
    const tx = db.transaction('documents', 'readwrite');
    tx.objectStore('documents').put(merged);
  }

  fieldLevelMerge(local, server) {
    // Field-level: take the most recently updated field
    const merged = { ...server };
    for (const key of Object.keys(local)) {
      if (local[`${key}_updatedAt`] > server[`${key}_updatedAt`]) {
        merged[key] = local[key];
      }
    }
    return merged;
  }

  getAllFromStore(store) {
    return new Promise((resolve) => {
      const items = [];
      const cursor = store.openCursor();
      cursor.onsuccess = (e) => {
        const c = e.target.result;
        if (c) { items.push(c.value); c.continue(); }
        else resolve(items);
      };
    });
  }
}
```

## Example 3: React Hook for Offline-First Data

```javascript
function useOfflineFirst(collection, id) {
  const [data, setData] = useState(null);
  const [syncStatus, setSyncStatus] = useState('synced'); // synced | pending | error

  useEffect(() => {
    // Step 1: Load from local store immediately
    getDocument(id).then(localDoc => {
      if (localDoc) setData(localDoc);
    });

    // Step 2: Fetch fresh data in background
    fetch(`/api/${collection}/${id}`)
      .then(res => res.json())
      .then(async serverDoc => {
        setData(serverDoc);
        // Update local store
        const db = await openDB();
        const tx = db.transaction('documents', 'readwrite');
        tx.objectStore('documents').put(serverDoc);
      })
      .catch(() => {
        // Offline — local data is already displayed
      });
  }, [collection, id]);

  const update = async (changes) => {
    const updated = { ...data, ...changes };
    setData(updated); // Optimistic update
    setSyncStatus('pending');

    try {
      await saveDocument(updated);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  };

  return { data, update, syncStatus };
}
```
