## What “secure storage” means in the browser

There is no perfect client storage. You choose based on threat model:

- **HttpOnly cookies**: best for session/refresh tokens in web apps (reduces XSS theft)
- **localStorage/sessionStorage**: easy, but readable by JS → high risk for tokens
- **IndexedDB**: useful for larger encrypted blobs; still readable by JS

Rule of thumb:
- keep long-lived credentials out of JS-accessible storage
- assume XSS is possible and reduce impact

