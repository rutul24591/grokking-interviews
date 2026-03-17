# LocalStorage Examples

## Example 1: Basic CRUD Operations

```javascript
// Set (always strings)
localStorage.setItem('username', 'alice');
localStorage.setItem('preferences', JSON.stringify({ theme: 'dark', fontSize: 16 }));

// Get
const username = localStorage.getItem('username'); // "alice"
const prefs = JSON.parse(localStorage.getItem('preferences') || '{}');

// Remove
localStorage.removeItem('username');

// Clear all
localStorage.clear();

// Iterate
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}
```

## Example 2: Type-Safe Wrapper

```javascript
class TypedStorage {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded');
      }
      return false;
    }
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  has(key) {
    return localStorage.getItem(key) !== null;
  }
}

const storage = new TypedStorage();
storage.set('user', { id: 1, name: 'Alice' });
const user = storage.get('user'); // { id: 1, name: "Alice" }
```

## Example 3: Cross-Tab Sync via Storage Event

```javascript
// Listen for changes from OTHER tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'auth-token') {
    if (event.newValue === null) {
      // Token removed in another tab — user logged out
      handleLogout();
    } else if (event.oldValue === null) {
      // Token added in another tab — user logged in
      handleLogin(event.newValue);
    }
  }

  if (event.key === 'theme') {
    applyTheme(event.newValue);
  }
});

// Note: the tab that WRITES does NOT receive the storage event
```

## Example 4: SSR-Safe localStorage Access

```javascript
function safeGetItem(key) {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // Private browsing or storage disabled
  }
}

function isLocalStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
```
