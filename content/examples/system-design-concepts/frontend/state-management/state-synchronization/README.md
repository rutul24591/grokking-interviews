# State Synchronization Across Tabs Examples

## Example 1: BroadcastChannel API

```javascript
const channel = new BroadcastChannel('app-sync');

// Send state updates
function broadcastStateChange(type, payload) {
  channel.postMessage({ type, payload, tabId: getTabId() });
}

// Receive state updates from other tabs
channel.onmessage = (event) => {
  const { type, payload, tabId } = event.data;
  if (tabId === getTabId()) return; // Ignore own messages

  switch (type) {
    case 'AUTH_LOGOUT':
      authStore.getState().logout();
      window.location.href = '/login';
      break;
    case 'THEME_CHANGE':
      themeStore.getState().setTheme(payload);
      break;
    case 'CART_UPDATE':
      cartStore.getState().syncCart(payload);
      break;
  }
};

// Usage
function logout() {
  authStore.getState().logout();
  broadcastStateChange('AUTH_LOGOUT');
}
```

## Example 2: localStorage Storage Event (Legacy Fallback)

```javascript
function setupCrossTabSync(store, storageKey) {
  // Listen for changes from other tabs
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey) return;
    if (event.newValue === null) return;

    try {
      const newState = JSON.parse(event.newValue);
      store.setState(newState, true); // Replace state
    } catch (e) {
      console.error('Failed to parse cross-tab state', e);
    }
  });

  // Persist state changes
  store.subscribe((state) => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  });
}
```

## Example 3: Leader Election with Web Locks

```javascript
class TabLeader {
  constructor(name) {
    this.name = name;
    this.isLeader = false;
  }

  async elect(onBecomeLeader, onLoseLeadership) {
    try {
      await navigator.locks.request(
        `leader-${this.name}`,
        { mode: 'exclusive' },
        async () => {
          this.isLeader = true;
          onBecomeLeader();

          // Hold the lock until tab closes
          return new Promise(() => {});
        }
      );
    } catch {
      this.isLeader = false;
      onLoseLeadership?.();
    }
  }
}

// Usage: only leader tab maintains WebSocket connection
const leader = new TabLeader('ws-connection');

leader.elect(
  () => {
    // This tab is the leader - manage the WebSocket
    const ws = new WebSocket('wss://api.example.com');
    ws.onmessage = (e) => {
      // Broadcast received data to all tabs
      channel.postMessage({ type: 'WS_DATA', payload: JSON.parse(e.data) });
    };
  },
  () => {
    console.log('Another tab is the leader');
  }
);
```

## Example 4: SharedWorker for Shared State

```javascript
// shared-worker.js
const connections = new Set();
let sharedState = {};

self.onconnect = (event) => {
  const port = event.ports[0];
  connections.add(port);

  port.onmessage = (e) => {
    const { type, payload } = e.data;

    if (type === 'GET_STATE') {
      port.postMessage({ type: 'STATE', payload: sharedState });
    } else if (type === 'UPDATE_STATE') {
      sharedState = { ...sharedState, ...payload };
      // Broadcast to all connected tabs
      connections.forEach(p => {
        if (p !== port) {
          p.postMessage({ type: 'STATE', payload: sharedState });
        }
      });
    }
  };

  port.onclose = () => connections.delete(port);
  port.start();
};

// main.js
const worker = new SharedWorker('/shared-worker.js');
worker.port.start();
worker.port.postMessage({ type: 'GET_STATE' });
worker.port.onmessage = (e) => {
  if (e.data.type === 'STATE') {
    store.setState(e.data.payload);
  }
};
```
