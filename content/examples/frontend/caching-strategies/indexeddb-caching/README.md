# IndexedDB for Large Data Caching Examples

## Example 1: Basic IndexedDB Operations

```javascript
function openDatabase(name, version, onUpgrade) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      onUpgrade(db, event.oldVersion);
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Schema migration
const db = await openDatabase('AppDB', 3, (db, oldVersion) => {
  if (oldVersion < 1) {
    const users = db.createObjectStore('users', { keyPath: 'id' });
    users.createIndex('email', 'email', { unique: true });
    users.createIndex('createdAt', 'createdAt');
  }
  if (oldVersion < 2) {
    const products = db.createObjectStore('products', { keyPath: 'id' });
    products.createIndex('category', 'category');
    products.createIndex('price', 'price');
  }
  if (oldVersion < 3) {
    const orders = db.createObjectStore('orders', {
      keyPath: 'id',
      autoIncrement: true,
    });
    orders.createIndex('userId', 'userId');
    orders.createIndex('status', 'status');
  }
});

// CRUD operations
async function addUser(db, user) {
  const tx = db.transaction('users', 'readwrite');
  const store = tx.objectStore('users');
  store.put(user);
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function getUsersByIndex(db, indexName, value) {
  const tx = db.transaction('users', 'readonly');
  const index = tx.objectStore('users').index(indexName);
  const request = index.getAll(value);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

## Example 2: Dexie.js Wrapper (Recommended)

```javascript
import Dexie from 'dexie';

const db = new Dexie('AppDB');

// Schema definition (version migrations)
db.version(1).stores({
  users: 'id, email, createdAt',
  products: 'id, category, price, *tags',
  orders: '++id, userId, status, createdAt',
});

// Simple CRUD
await db.users.put({ id: '1', name: 'Alice', email: 'alice@example.com' });
const user = await db.users.get('1');
const admins = await db.users.where('role').equals('admin').toArray();

// Bulk operations (much faster)
await db.products.bulkPut(thousandsOfProducts);

// Complex queries
const expensiveElectronics = await db.products
  .where('category').equals('electronics')
  .and(product => product.price > 500)
  .sortBy('price');

// Live queries (auto-update UI on data changes)
import { useLiveQuery } from 'dexie-react-hooks';

function ProductList({ category }) {
  const products = useLiveQuery(
    () => db.products.where('category').equals(category).toArray(),
    [category]
  );

  if (!products) return <Loading />;
  return products.map(p => <ProductCard key={p.id} product={p} />);
}
```

## Example 3: Offline Sync Queue

```javascript
class SyncQueue {
  constructor(db) {
    this.db = db;
  }

  async enqueue(operation) {
    await this.db.syncQueue.put({
      ...operation,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retries: 0,
      status: 'pending',
    });
  }

  async processQueue() {
    const pending = await this.db.syncQueue
      .where('status').equals('pending')
      .sortBy('timestamp');

    for (const op of pending) {
      try {
        await this.executeOperation(op);
        await this.db.syncQueue.delete(op.id);
      } catch (error) {
        await this.db.syncQueue.update(op.id, {
          retries: op.retries + 1,
          status: op.retries >= 3 ? 'failed' : 'pending',
          lastError: error.message,
        });
      }
    }
  }

  async executeOperation(op) {
    const response = await fetch(op.url, {
      method: op.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(op.data),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
}

// Usage
const syncQueue = new SyncQueue(db);

async function createOrder(order) {
  // Save locally immediately
  await db.orders.put(order);

  if (navigator.onLine) {
    await fetch('/api/orders', { method: 'POST', body: JSON.stringify(order) });
  } else {
    await syncQueue.enqueue({
      url: '/api/orders',
      method: 'POST',
      data: order,
    });
  }
}

// Process queue when back online
window.addEventListener('online', () => syncQueue.processQueue());
```

## Example 4: Cache with IndexedDB Backend

```javascript
class IndexedDBCache {
  constructor(storeName = 'cache', maxAge = 3600000) {
    this.db = new Dexie('CacheDB');
    this.db.version(1).stores({ [storeName]: 'key, expiry' });
    this.store = this.db[storeName];
    this.maxAge = maxAge;
  }

  async get(key) {
    const entry = await this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      await this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key, value, maxAge = this.maxAge) {
    await this.store.put({
      key,
      value,
      expiry: Date.now() + maxAge,
    });
  }

  async cleanup() {
    await this.store.where('expiry').below(Date.now()).delete();
  }
}
```
