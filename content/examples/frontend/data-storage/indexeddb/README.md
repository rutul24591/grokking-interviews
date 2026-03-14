# IndexedDB Examples

## Example 1: Raw IndexedDB API

```javascript
function openDB(name, version, onUpgrade) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onupgradeneeded = (e) => onUpgrade(e.target.result, e.oldVersion);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const db = await openDB('MyApp', 2, (db, oldVersion) => {
  if (oldVersion < 1) {
    const users = db.createObjectStore('users', { keyPath: 'id' });
    users.createIndex('email', 'email', { unique: true });
  }
  if (oldVersion < 2) {
    const logs = db.createObjectStore('logs', { autoIncrement: true });
    logs.createIndex('timestamp', 'timestamp');
  }
});

// Write
async function putUser(db, user) {
  const tx = db.transaction('users', 'readwrite');
  tx.objectStore('users').put(user);
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

// Read
async function getUser(db, id) {
  const tx = db.transaction('users', 'readonly');
  const request = tx.objectStore('users').get(id);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

## Example 2: Dexie.js (Recommended Wrapper)

```javascript
import Dexie from 'dexie';

const db = new Dexie('MyApp');

db.version(1).stores({
  users: 'id, email, *tags',
  products: 'id, category, price',
  orders: '++id, userId, createdAt',
});

// CRUD
await db.users.put({ id: 'u1', name: 'Alice', email: 'alice@example.com', tags: ['admin'] });
const user = await db.users.get('u1');
const admins = await db.users.where('tags').equals('admin').toArray();
const expensive = await db.products.where('price').above(100).sortBy('price');

// Bulk operations
await db.products.bulkPut(thousandsOfProducts);

// Transactions
await db.transaction('rw', db.users, db.orders, async () => {
  await db.users.update('u1', { lastOrderAt: new Date() });
  await db.orders.add({ userId: 'u1', items: [...], createdAt: new Date() });
});
```

## Example 3: Live Queries with React (Dexie)

```javascript
import { useLiveQuery } from 'dexie-react-hooks';

function ProductList({ category, maxPrice }) {
  const products = useLiveQuery(
    () => db.products
      .where('category').equals(category)
      .and(p => p.price <= maxPrice)
      .toArray(),
    [category, maxPrice]
  );

  if (!products) return <Loading />;
  return products.map(p => <ProductCard key={p.id} product={p} />);
}
```

## Example 4: Cursor Iteration

```javascript
async function processLargeDataset(db, storeName, callback) {
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const request = store.openCursor();

  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        callback(cursor.value);
        cursor.continue(); // Move to next record
      } else {
        resolve(); // Done iterating
      }
    };
    request.onerror = () => reject(request.error);
  });
}
```
