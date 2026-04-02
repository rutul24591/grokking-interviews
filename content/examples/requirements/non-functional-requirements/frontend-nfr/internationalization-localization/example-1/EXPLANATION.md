# i18n + l10n as a frontend NFR

Internationalization (i18n) is the architecture that makes multiple locales possible; localization (l10n) is the per-locale content and formatting.

## What this example implements
- **Locale-prefixed routes:** `/en`, `/fr`, `/ar`
- **Locale negotiation:** cookie → `Accept-Language` → default
- **Sticky locale:** set a `locale` cookie on redirect so navigation is stable
- **Formatting:** `Intl.NumberFormat` + `Intl.DateTimeFormat`
- **Plural rules:** a minimal `one/other` demo
- **RTL:** Arabic uses `dir="rtl"`
- **Server-side formatting preview:** `GET /api/i18n/preview` (demonstrates negotiation + `Vary`)

## Production notes
- Don’t translate only strings; cover dates, numbers, currencies, and text direction.
- Beware caches/CDNs: vary by locale and keep negotiation deterministic.
- Build a fallback chain and avoid partial translations shipping unnoticed (CI checks for missing keys).
