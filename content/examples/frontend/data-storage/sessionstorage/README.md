# SessionStorage Examples

## Example 1: Multi-Step Form Persistence

```javascript
// Save form progress on each step
function saveFormStep(step, data) {
  const formState = JSON.parse(sessionStorage.getItem('wizard-form') || '{}');
  formState[`step${step}`] = data;
  formState.currentStep = step;
  sessionStorage.setItem('wizard-form', JSON.stringify(formState));
}

// Restore on page refresh
function restoreFormState() {
  const saved = sessionStorage.getItem('wizard-form');
  if (saved) {
    const formState = JSON.parse(saved);
    return formState;
  }
  return { currentStep: 1 };
}

// Clear on successful submission
function onSubmitSuccess() {
  sessionStorage.removeItem('wizard-form');
}
```

## Example 2: One-Time Notifications

```javascript
function showOncePerSession(notificationId, message) {
  const key = `shown-${notificationId}`;
  if (sessionStorage.getItem(key)) return; // Already shown this session

  showNotification(message);
  sessionStorage.setItem(key, 'true');
}

// Won't show again until a new tab/session
showOncePerSession('welcome', 'Welcome back!');
showOncePerSession('promo', 'Check out our new features!');
```

## Example 3: Scroll Position Restoration

```javascript
// Save scroll position before navigation
function saveScrollPosition(pageId) {
  sessionStorage.setItem(
    `scroll-${pageId}`,
    JSON.stringify({ x: window.scrollX, y: window.scrollY })
  );
}

// Restore on back navigation
function restoreScrollPosition(pageId) {
  const saved = sessionStorage.getItem(`scroll-${pageId}`);
  if (saved) {
    const { x, y } = JSON.parse(saved);
    requestAnimationFrame(() => window.scrollTo(x, y));
  }
}
```

## Example 4: Tab-Specific Debug State

```javascript
// Each tab gets its own debug log
function debugLog(message) {
  const logs = JSON.parse(sessionStorage.getItem('debug-log') || '[]');
  logs.push({
    timestamp: Date.now(),
    message,
    url: window.location.href,
  });
  // Keep last 100 entries
  if (logs.length > 100) logs.shift();
  sessionStorage.setItem('debug-log', JSON.stringify(logs));
}

function getDebugLog() {
  return JSON.parse(sessionStorage.getItem('debug-log') || '[]');
}
```
