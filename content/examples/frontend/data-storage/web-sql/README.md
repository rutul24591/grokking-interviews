# Web SQL (Deprecated) Examples

## Example 1: Web SQL Basic Usage (Historical Reference)

```javascript
// DEPRECATED - Do not use in new code
const db = openDatabase('mydb', '1.0', 'My Database', 2 * 1024 * 1024);

db.transaction((tx) => {
  tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)');
  tx.executeSql('INSERT INTO users (name, email) VALUES (?, ?)', ['Alice', 'alice@example.com']);
});

db.readTransaction((tx) => {
  tx.executeSql('SELECT * FROM users WHERE name = ?', ['Alice'], (tx, results) => {
    for (let i = 0; i < results.rows.length; i++) {
      console.log(results.rows.item(i));
    }
  });
});
```

## Example 2: Migration to IndexedDB (Dexie.js)

```javascript
// Step 1: Read all data from Web SQL
function readWebSQLData() {
  return new Promise((resolve) => {
    const db = openDatabase('legacy-app', '1.0', '', 0);
    const data = { users: [], products: [] };

    db.readTransaction((tx) => {
      tx.executeSql('SELECT * FROM users', [], (_, result) => {
        for (let i = 0; i < result.rows.length; i++) {
          data.users.push(result.rows.item(i));
        }
      });
      tx.executeSql('SELECT * FROM products', [], (_, result) => {
        for (let i = 0; i < result.rows.length; i++) {
          data.products.push(result.rows.item(i));
        }
      });
    }, null, () => resolve(data));
  });
}

// Step 2: Write to IndexedDB
async function migrateToIndexedDB() {
  if (!window.openDatabase) return; // Web SQL not supported

  const migrated = localStorage.getItem('websql-migrated');
  if (migrated) return;

  const data = await readWebSQLData();
  const db = new Dexie('modern-app');
  db.version(1).stores({
    users: 'id, name, email',
    products: 'id, category',
  });

  await db.users.bulkPut(data.users);
  await db.products.bulkPut(data.products);
  localStorage.setItem('websql-migrated', 'true');
}
```

## Example 3: Feature Detection

```javascript
function getStorageStrategy() {
  if ('indexedDB' in window) {
    return 'indexeddb'; // Modern standard
  }
  if ('openDatabase' in window) {
    return 'websql'; // Legacy fallback (Chrome/Safari only)
  }
  return 'localstorage'; // Last resort
}
```
