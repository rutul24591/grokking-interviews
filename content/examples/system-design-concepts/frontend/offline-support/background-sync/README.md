# Background Sync Examples

## Example 1: Basic Background Sync Registration

```javascript
// main.js — Register a sync when user submits a form
async function submitForm(formData) {
  // Store data in IndexedDB first
  const db = await openDB('app', 1, {
    upgrade(db) {
      db.createObjectStore('pending-submissions', { keyPath: 'id', autoIncrement: true });
    },
  });

  await db.add('pending-submissions', {
    url: '/api/submit',
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
    timestamp: Date.now(),
  });

  // Register sync
  const registration = await navigator.serviceWorker.ready;
  await registration.sync.register('submit-form');

  // Show optimistic feedback
  showToast('Saved! Will submit when online.');
}
```

## Example 2: Service Worker Sync Event Handler

```javascript
// sw.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'submit-form') {
    event.waitUntil(replayPendingSubmissions());
  }

  if (event.tag === 'sync-messages') {
    event.waitUntil(syncPendingMessages());
  }
});

async function replayPendingSubmissions() {
  const db = await openDB('app', 1);
  const tx = db.transaction('pending-submissions', 'readonly');
  const store = tx.objectStore('pending-submissions');
  const pending = await store.getAll();

  for (const submission of pending) {
    const response = await fetch(submission.url, {
      method: submission.method,
      headers: { 'Content-Type': 'application/json' },
      body: submission.body,
    });

    if (response.ok) {
      // Remove from outbox
      const deleteTx = db.transaction('pending-submissions', 'readwrite');
      await deleteTx.objectStore('pending-submissions').delete(submission.id);
    } else if (response.status >= 500) {
      // Server error — throw to trigger retry
      throw new Error(`Server error: ${response.status}`);
    }
    // 4xx errors: remove from outbox (don't retry bad data)
  }
}
```

## Example 3: Fallback for Browsers Without Background Sync

```javascript
async function submitWithFallback(data) {
  // Store locally
  await storeInOutbox(data);

  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    // Use Background Sync
    const reg = await navigator.serviceWorker.ready;
    await reg.sync.register('submit-data');
  } else {
    // Fallback: try sending now, retry on visibility change
    try {
      await sendPendingData();
    } catch {
      // Retry when page becomes visible or online
      window.addEventListener('online', sendPendingData, { once: true });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') sendPendingData();
      }, { once: true });
    }
  }
}

async function sendPendingData() {
  const pending = await getOutboxItems();
  for (const item of pending) {
    try {
      await fetch(item.url, { method: 'POST', body: item.body });
      await removeFromOutbox(item.id);
    } catch {
      break; // Still offline
    }
  }
}
```

## Example 4: Batch Sync with Progress Notification

```javascript
// sw.js — Sync with notification feedback
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-photos') {
    event.waitUntil(syncPhotosWithProgress());
  }
});

async function syncPhotosWithProgress() {
  const db = await openDB('photos', 1);
  const pending = await db.getAll('pending-uploads');

  let synced = 0;
  for (const photo of pending) {
    const formData = new FormData();
    formData.append('photo', photo.blob, photo.filename);

    const response = await fetch('/api/photos', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      await db.delete('pending-uploads', photo.id);
      synced++;
    }
  }

  // Notify user
  if (synced > 0) {
    self.registration.showNotification('Photos Synced', {
      body: `${synced} photo${synced > 1 ? 's' : ''} uploaded successfully`,
      icon: '/icons/icon-192.png',
    });
  }
}
```
