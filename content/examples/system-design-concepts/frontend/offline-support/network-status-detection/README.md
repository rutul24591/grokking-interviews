# Network Status Detection Examples

## Example 1: Multi-Signal Connectivity Detection

```javascript
class ConnectivityDetector {
  constructor(heartbeatUrl = '/api/health') {
    this.heartbeatUrl = heartbeatUrl;
    this.status = navigator.onLine ? 'online' : 'offline';
    this.listeners = new Set();
    this.heartbeatInterval = null;

    window.addEventListener('online', () => this.onBrowserEvent('online'));
    window.addEventListener('offline', () => this.onBrowserEvent('offline'));
  }

  onBrowserEvent(type) {
    if (type === 'offline') {
      this.updateStatus('offline');
    } else {
      // Don't trust 'online' event — verify with heartbeat
      this.heartbeat();
    }
  }

  async heartbeat() {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 5000);

      const response = await fetch(this.heartbeatUrl, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      });

      this.updateStatus(response.ok ? 'online' : 'degraded');
    } catch {
      this.updateStatus(navigator.onLine ? 'degraded' : 'offline');
    }
  }

  updateStatus(newStatus) {
    if (newStatus !== this.status) {
      const prev = this.status;
      this.status = newStatus;
      this.listeners.forEach(fn => fn(newStatus, prev));
    }
  }

  startMonitoring(intervalMs = 30000) {
    this.heartbeat();
    this.heartbeatInterval = setInterval(() => this.heartbeat(), intervalMs);
  }

  stopMonitoring() {
    clearInterval(this.heartbeatInterval);
  }

  onChange(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}
```

## Example 2: React Hook for Network Status

```javascript
function useNetworkStatus() {
  const [status, setStatus] = useState({
    online: navigator.onLine,
    effectiveType: navigator.connection?.effectiveType || 'unknown',
    saveData: navigator.connection?.saveData || false,
    downlink: navigator.connection?.downlink || null,
    rtt: navigator.connection?.rtt || null,
  });

  useEffect(() => {
    function updateOnlineStatus() {
      setStatus(prev => ({ ...prev, online: navigator.onLine }));
    }

    function updateConnectionInfo() {
      if (navigator.connection) {
        setStatus(prev => ({
          ...prev,
          effectiveType: navigator.connection.effectiveType,
          saveData: navigator.connection.saveData,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
        }));
      }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    navigator.connection?.addEventListener('change', updateConnectionInfo);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      navigator.connection?.removeEventListener('change', updateConnectionInfo);
    };
  }, []);

  return status;
}

// Usage in component
function App() {
  const network = useNetworkStatus();

  return (
    <div>
      {!network.online && <OfflineBanner />}
      {network.saveData && <LiteMode />}
      {network.effectiveType === 'slow-2g' && <TextOnlyMode />}
    </div>
  );
}
```

## Example 3: Adaptive Loading Based on Connection

```javascript
function getAssetQuality() {
  const connection = navigator.connection;
  if (!connection) return 'high'; // Default to high if API unavailable

  if (connection.saveData) return 'minimal';

  switch (connection.effectiveType) {
    case 'slow-2g':
    case '2g':
      return 'minimal'; // Text only, no images
    case '3g':
      return 'medium';  // Compressed images, no video autoplay
    case '4g':
    default:
      return 'high';    // Full experience
  }
}

function getImageSrc(baseUrl) {
  const quality = getAssetQuality();
  switch (quality) {
    case 'minimal': return null; // Don't load image
    case 'medium':  return `${baseUrl}?w=400&q=60`;
    case 'high':    return `${baseUrl}?w=1200&q=85`;
  }
}

// Adaptive prefetching
function shouldPrefetch() {
  const connection = navigator.connection;
  if (!connection) return true;
  return !connection.saveData && connection.effectiveType === '4g';
}
```

## Example 4: Debounced Connectivity Status with Flap Prevention

```javascript
class StableConnectivityDetector {
  constructor(options = {}) {
    this.stableDelay = options.stableDelay || 3000;
    this.status = 'online';
    this.pendingStatus = null;
    this.timer = null;
    this.listeners = new Set();

    window.addEventListener('online', () => this.scheduleUpdate('online'));
    window.addEventListener('offline', () => this.scheduleUpdate('offline'));
  }

  scheduleUpdate(newStatus) {
    // Immediately report going offline (user needs to know)
    if (newStatus === 'offline') {
      clearTimeout(this.timer);
      this.pendingStatus = null;
      this.commit('offline');
      return;
    }

    // Debounce going online (prevent flapping)
    if (this.pendingStatus === newStatus) return;
    this.pendingStatus = newStatus;

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.commit(newStatus);
      this.pendingStatus = null;
    }, this.stableDelay);
  }

  commit(status) {
    if (status !== this.status) {
      this.status = status;
      this.listeners.forEach(fn => fn(status));
    }
  }

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}
```
