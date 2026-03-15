# Progressive Web Apps (PWA) Examples

## Example 1: Web App Manifest

```json
{
  "name": "My PWA Application",
  "short_name": "MyPWA",
  "description": "A progressive web app example",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "shortcuts": [
    {
      "name": "New Document",
      "short_name": "New",
      "url": "/new",
      "icons": [{ "src": "/icons/new.png", "sizes": "96x96" }]
    }
  ],
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [{ "name": "media", "accept": ["image/*", "video/*"] }]
    }
  }
}
```

## Example 2: Service Worker Registration with Update Handling

```javascript
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;

  const registration = await navigator.serviceWorker.register('/sw.js', {
    scope: '/',
  });

  // Listen for updates
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New version available — show update banner
        showUpdateBanner(() => {
          newWorker.postMessage({ type: 'SKIP_WAITING' });
        });
      }
    });
  });

  // Reload page when new SW takes over
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  return registration;
}

function showUpdateBanner(onUpdate) {
  const banner = document.createElement('div');
  banner.innerHTML = `
    <p>A new version is available.</p>
    <button id="update-btn">Update Now</button>
  `;
  document.body.appendChild(banner);
  document.getElementById('update-btn').addEventListener('click', onUpdate);
}
```

## Example 3: Custom Install Prompt

```javascript
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

function showInstallButton() {
  const btn = document.getElementById('install-btn');
  btn.style.display = 'block';

  btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User installed the PWA');
    }
    deferredPrompt = null;
    btn.style.display = 'none';
  });
}

// Track installation
window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  // Analytics: track successful installation
});

// Detect display mode
function isInstalledPWA() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
}
```

## Example 4: App Shell with Precaching

```javascript
// sw.js — App Shell caching strategy
const SHELL_CACHE = 'app-shell-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/offline.html',
  '/icons/icon-192.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names
          .filter(name => name !== SHELL_CACHE)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
```
