// ThemeScriptInjector — inline script to prevent FOUC by applying theme before paint

"use client";

import Script from "next/script";

/**
 * This inline script runs before the page is interactive (beforeInteractive).
 * It reads the stored theme preference from localStorage, resolves "system"
 * via matchMedia, and sets data-theme on the <html> element before the first
 * browser paint. This eliminates the flash of unstyled/wrong-themed content.
 */
const THEME_SCRIPT = `
(function() {
  try {
    var mode = localStorage.getItem('theme-mode');
    if (!mode) mode = 'system';
    var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {
    // If localStorage is unavailable (private browsing), fall back to system detection
    try {
      var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = isDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e2) {
      // If matchMedia is also unavailable, default to light
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
})();
`;

export function ThemeScriptInjector() {
  return (
    <Script
      id="theme-fouc-prevention"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
    />
  );
}
