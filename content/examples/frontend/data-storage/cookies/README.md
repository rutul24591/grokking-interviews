# Cookies Examples

## Example 1: Server-Side Cookie Setting (Express.js)

```javascript
// Set a secure session cookie
app.post('/login', (req, res) => {
  const sessionId = generateSessionId();

  res.cookie('session', sessionId, {
    httpOnly: true,     // Not accessible via document.cookie
    secure: true,       // HTTPS only
    sameSite: 'lax',    // Sent on top-level navigations
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
    domain: '.example.com', // Available to subdomains
  });

  res.json({ success: true });
});

// __Host- prefix for maximum security
res.cookie('__Host-session', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
  // No domain — locked to exact origin
});
```

## Example 2: Client-Side Cookie Helpers

```javascript
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + encodeURIComponent(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// Usage
setCookie('theme', 'dark', 365);
const theme = getCookie('theme'); // "dark"
```

## Example 3: CSRF Token Cookie

```javascript
// Server sets CSRF token as a non-HttpOnly cookie
res.cookie('csrf-token', generateCSRFToken(), {
  httpOnly: false,   // JS needs to read this
  secure: true,
  sameSite: 'strict',
  path: '/',
});

// Client reads and sends as header
async function secureFetch(url, options = {}) {
  const csrfToken = getCookie('csrf-token');
  return fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      ...options.headers,
      'X-CSRF-Token': csrfToken,
    },
  });
}
```

## Example 4: Cookie Consent Banner

```javascript
function hasConsent() {
  return getCookie('cookie-consent') === 'accepted';
}

function acceptCookies(categories) {
  setCookie('cookie-consent', 'accepted', 365);
  setCookie('cookie-categories', JSON.stringify(categories), 365);

  if (categories.includes('analytics')) {
    initAnalytics();
  }
  if (categories.includes('marketing')) {
    initMarketing();
  }
}

function rejectCookies() {
  setCookie('cookie-consent', 'rejected', 365);
  // Only essential cookies remain
}
```
