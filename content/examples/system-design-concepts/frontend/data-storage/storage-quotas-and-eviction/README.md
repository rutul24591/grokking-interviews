# Storage Quotas and Eviction Examples

## Example 1: Check Storage Quota

```javascript
async function checkStorageQuota() {
  if (!navigator.storage?.estimate) {
    console.warn('StorageManager API not supported');
    return null;
  }

  const estimate = await navigator.storage.estimate();

  return {
    quota: estimate.quota,           // Total available (bytes)
    usage: estimate.usage,           // Currently used (bytes)
    remaining: estimate.quota - estimate.usage,
    percentUsed: ((estimate.usage / estimate.quota) * 100).toFixed(2),
    quotaMB: (estimate.quota / (1024 * 1024)).toFixed(0),
    usageMB: (estimate.usage / (1024 * 1024)).toFixed(2),
  };
}

// Usage breakdown (Chrome 84+)
async function getUsageBreakdown() {
  const estimate = await navigator.storage.estimate();
  if (estimate.usageDetails) {
    return {
      indexedDB: estimate.usageDetails.indexedDB || 0,
      caches: estimate.usageDetails.caches || 0,
      serviceWorkerRegistrations: estimate.usageDetails.serviceWorkerRegistrations || 0,
    };
  }
  return null;
}
```

## Example 2: Request Persistent Storage

```javascript
async function requestPersistence() {
  if (!navigator.storage?.persist) return false;

  // Check if already persistent
  const isPersisted = await navigator.storage.persisted();
  if (isPersisted) return true;

  // Request persistence (browser may auto-grant based on engagement)
  const granted = await navigator.storage.persist();
  if (granted) {
    console.log('Storage will not be evicted under pressure');
  } else {
    console.log('Storage may be evicted — browser denied persistence');
  }
  return granted;
}

// Chrome auto-grants if:
// - Site is bookmarked or added to home screen
// - Site has push notification permission
// - Site has high engagement score
```

## Example 3: Graceful Quota Management

```javascript
class StorageManager {
  constructor(maxUsagePercent = 80) {
    this.maxUsagePercent = maxUsagePercent;
  }

  async hasSpace(neededBytes) {
    const estimate = await navigator.storage.estimate();
    const available = estimate.quota - estimate.usage;
    const percentAfter = ((estimate.usage + neededBytes) / estimate.quota) * 100;
    return percentAfter < this.maxUsagePercent && available > neededBytes;
  }

  async writeWithQuotaCheck(storeFn, neededBytes) {
    if (!(await this.hasSpace(neededBytes))) {
      await this.evictOldData();
      if (!(await this.hasSpace(neededBytes))) {
        throw new Error('Insufficient storage');
      }
    }

    try {
      return await storeFn();
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        await this.evictOldData();
        return await storeFn(); // Retry once
      }
      throw e;
    }
  }

  async evictOldData() {
    // Delete old caches
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(n => n.includes('-old'));
    await Promise.all(oldCaches.map(n => caches.delete(n)));

    // Delete old IndexedDB records
    const db = await openDB();
    const tx = db.transaction('logs', 'readwrite');
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days
    await tx.objectStore('logs').index('timestamp')
      .openCursor(IDBKeyRange.upperBound(cutoff))
      .then(function deleteOld(cursor) {
        if (!cursor) return;
        cursor.delete();
        return cursor.continue().then(deleteOld);
      });
  }
}
```

## Example 4: Storage Pressure Monitoring

```javascript
// Periodic quota monitoring
async function monitorStorage(intervalMs = 60000) {
  setInterval(async () => {
    const info = await checkStorageQuota();
    if (!info) return;

    if (parseFloat(info.percentUsed) > 90) {
      console.warn(`Storage at ${info.percentUsed}% — consider cleanup`);
      showStorageWarning(info);
    }
  }, intervalMs);
}

// React hook
function useStorageQuota() {
  const [quota, setQuota] = useState(null);

  useEffect(() => {
    checkStorageQuota().then(setQuota);

    const interval = setInterval(async () => {
      setQuota(await checkStorageQuota());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return quota;
}
```
